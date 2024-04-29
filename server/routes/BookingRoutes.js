const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const { getUserDataFromReq } = require("../lib");

/**
 * @description API endpoint to create(post) Booking data
 */
router.post("/", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;

  // Check for missing fields
  if (!place || !userData || !checkIn || !checkOut || !name || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new booking document
    const newBooking = await Booking.create({
      place,
      user: userData.id,
      checkIn,
      checkOut,
      name,
      phone,
      price,
    });

    // Return the newly created booking
    res.status(201).json(newBooking);
  } catch (error) {
    // Return error message if unable to create booking
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @description API endpoint to fetch(get) Bookings data of a user
 */
router.get("/", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

module.exports = router;
