const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register route
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body; // Include role in destructuring

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role // Include role
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password: hashedPassword, ...userWithoutPassword } = user.toObject();

        res.status(200).json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
