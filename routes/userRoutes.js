const express = require("express");
const router = express.Router();

// In-memory user storage for demo (replace with MongoDB later)
let users = [];

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Backend is working!", users: users.length });
});

// signup
router.post("/signup", (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    
    const { email, firstName, lastName, password, postcode } = req.body;
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = {
      id: users.length + 1,
      firstName,
      lastName,
      email,
      password,
      postcode: postcode || "",
      createdAt: new Date()
    };
    
    users.push(user);
    console.log("User registered successfully:", email);
    console.log("Total users:", users.length);
    
    res.status(201).json({ 
      message: "User registered successfully", 
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      success: true 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// login
router.post("/login", (req, res) => {
  try {
    console.log("Login request received:", req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Validation failed: Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      console.log("Login successful for:", email);
      res.status(200).json({ 
        message: "Login successful", 
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        success: true 
      });
    } else {
      console.log("Login failed: Invalid credentials for", email);
      res.status(401).json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

module.exports = router;
