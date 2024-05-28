const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

// Sign-up route
router.post("/signup", async (req, res) => {
  try {
    // Extracting data from request body
    const { name, email,mobile, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new user instance
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Sending success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handling errors
    console.error("Error in sign up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Sign-in route
router.post("/signin", async (req, res) => {
  try {
    // Extracting email and password from request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    // Sending success response with token
    res.json({ message: "Sign in successful", token });
  } catch (error) {
    // Handling errors
    console.error("Error in sign in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
