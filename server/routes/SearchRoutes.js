const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

/**
 * @desc    Get all places
 * @route   GET /
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    // Retrieve all places from the database
    const places = await Place.find();

    // Send places as JSON response
    res.json(places);
  } catch (error) {
    // Handle errors
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @desc    Search for places by title or address
 * @route   GET /places
 * @access  Public
 */
router.get("/places", async (req, res) => {
  try {
    // Parse query parameters from request
    const { searchText } = req.query;

    // Construct the query object based on available parameters
    const query = {};

    if (searchText) {
      // Use a single regular expression to search both place's title and address
      query.$or = [
        { title: new RegExp(searchText, "i") }, // Case-insensitive title search
        { address: new RegExp(searchText, "i") }, // Case-insensitive address search
      ];
    }

    // Execute the query and retrieve matching places
    const places = await Place.find(query);

    // Send the matching places as JSON response
    res.json(places);
  } catch (error) {
    // Handling errors
    console.error("Error searching places:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
