const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @desc API endpoint to create a new place(room)
 * @route POST /api/places
 * @access Public
 */
router.post("/", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  // Verify JWT token
  jwt.verify(token, JWT_SECRET, {}, async (err, userData) => {
    if (err) {
      // If token verification fails, send 401 Unauthorized response
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      // Create new place document
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      // Send newly created place document as response
      res.json(placeDoc);
    } catch (error) {
      // If an error occurs during place creation, send 500 Internal Server Error response
      console.error("Error creating place:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

/**
 * @desc API endpoint to update an existing place(room)
 * @route PUT /api/places
 * @access Public
 */
router.put("/", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  // Verify JWT token
  jwt.verify(token, JWT_SECRET, {}, async (err, userData) => {
    if (err) {
      // If token verification fails, send 401 Unauthorized response
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      // Find the place document by ID
      const placeDoc = await Place.findById(id);

      // Check if the user is the owner of the place
      if (userData.id === placeDoc.owner.toString()) {
        // Update the place document with new data
        placeDoc.set({
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        });

        // Save the updated place document
        await placeDoc.save();

        // Send success response
        res.json("ok");
      } else {
        // If user is not the owner, send 403 Forbidden response
        res.status(403).json({ message: "Forbidden" });
      }
    } catch (error) {
      // If an error occurs during place update, send 500 Internal Server Error response
      console.error("Error updating place:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

/**
 * @desc API endpoint to retrieve places owned by a user
 * @route GET /api/places/user-places
 * @access Public
 */
router.get("/user-places", async (req, res) => {
  const { token } = req.cookies;

  // Verify JWT token
  jwt.verify(token, JWT_SECRET, {}, async (err, userData) => {
    if (err) {
      // If token verification fails, send 401 Unauthorized response
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Extract user ID from token payload
      const { id } = userData;

      // Find places owned by the user
      const userPlaces = await Place.find({ owner: id });

      // Send the list of user-owned places as response
      res.json(userPlaces);
    } catch (error) {
      // If an error occurs, send 500 Internal Server Error response
      console.error("Error fetching user places:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
});

/**
 * @desc API endpoint to retrieve a specific place by its ID
 * @route GET /api/places/:id
 * @access Public
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find place by ID
    const place = await Place.findById(id);

    // Check if place exists
    if (!place) {
      // If place is not found, send 404 Not Found response
      return res.status(404).json({ message: "Place not found" });
    }

    // Send the place document as response
    res.json(place);
  } catch (error) {
    // If an error occurs, send 500 Internal Server Error response
    console.error("Error fetching place by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @desc API endpoint to delete a place by its ID
 * @route DELETE /api/places/:id
 * @access Public
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find place by ID and delete it
    const deletedPlace = await Place.findByIdAndDelete(id);

    // Check if place exists
    if (!deletedPlace) {
      // If place is not found, send 404 Not Found response
      return res.status(404).json({ message: "Place not found" });
    }

    // Send success response
    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    // If an error occurs, send 500 Internal Server Error response
    console.error("Error deleting place by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
