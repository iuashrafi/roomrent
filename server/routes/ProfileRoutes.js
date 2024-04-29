const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { getUserDataFromReq } = require("../lib");

/**
 * @desc - API endpoint for updating user's name and email
 */
router.put("/update", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches the user's password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Update the user's name and email
    user.name = name;
    user.email = email;

    // Save the updated user document
    await user.save();

    res.json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error); // Logging the error for debugging
    res.status(422).json({ error: error.message });
  }
});

/**
 * @desc - API endpoint for updating user's password
 */
router.put("/update-password", async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    const userData = await getUserDataFromReq(req);
    // Find the user by their ID
    const user = await User.findById(userData.id);

    // Check if the old password matches the user's current password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Generate salt and hash the new password
    const bcryptSalt = bcrypt.genSaltSync(10);
    const hashedNewPassword = bcrypt.hashSync(newPassword, bcryptSalt);

    // Update the user's password
    user.password = hashedNewPassword;

    // Save the updated user document
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error); // Logging the error for debugging
    res.status(422).json({ error: error.message });
  }
});

module.exports = router;
