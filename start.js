#!/usr/bin/env node

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

// ==================== MIDDLEWARE ====================
app.use(cors({ origin: '*', credentials: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory user storage
let users = [];
let bookings = [];

// Comprehensive providers database with locations
let providers = [
  // Lucknow Providers
  { id: 1, name: 'Raj Kumar', service: 'Plumbing', rating: 4.8, reviews: 156, location: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', available: true },
  { id: 2, name: 'Priya Singh', service: 'Cleaning', rating: 4.9, reviews: 203, location: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', available: true },
  { id: 3, name: 'Amit Verma', service: 'Electrical', rating: 4.7, reviews: 128, location: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', available: true },
  { id: 4, name: 'Sneha Gupta', service: 'Tutoring', rating: 4.9, reviews: 89, location: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', available: true },
  { id: 5, name: 'Mohammad Ali', service: 'Delivery', rating: 4.6, reviews: 342, location: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', available: true },
  
  // Delhi Providers
  { id: 6, name: 'Vikram Patel', service: 'Gardening', rating: 4.8, reviews: 95, location: 'Delhi', city: 'Delhi', state: 'Delhi', available: true },
  { id: 7, name: 'Ravi Singh', service: 'IT Support', rating: 4.7, reviews: 167, location: 'Delhi', city: 'Delhi', state: 'Delhi', available: true },
  { id: 8, name: 'Lisa Chen', service: 'Pet Care', rating: 4.9, reviews: 112, location: 'Delhi', city: 'Delhi', state: 'Delhi', available: true },
  { id: 9, name: 'Arun Kumar', service: 'Plumbing', rating: 4.8, reviews: 198, location: 'Delhi', city: 'Delhi', state: 'Delhi', available: true },
  { id: 10, name: 'Neha Sharma', service: 'Cleaning', rating: 4.9, reviews: 256, location: 'Delhi', city: 'Delhi', state: 'Delhi', available: true },
  
  // Mumbai Providers
  { id: 11, name: 'Suresh Nair', service: 'Electrical', rating: 4.8, reviews: 234, location: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', available: true },
  { id: 12, name: 'Anjali Desai', service: 'Tutoring', rating: 4.9, reviews: 178, location: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', available: true },
  { id: 13, name: 'Karan Malik', service: 'Delivery', rating: 4.7, reviews: 445, location: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', available: true },
  { id: 14, name: 'Pooja Reddy', service: 'Pet Care', rating: 4.9, reviews: 134, location: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', available: true },
  { id: 15, name: 'Sanjay Dubey', service: 'Gardening', rating: 4.7, reviews: 112, location: 'Mumbai', city: 'Mumbai', state: 'Maharashtra', available: true },
  
  // Bangalore Providers
  { id: 16, name: 'Harish Kumar', service: 'IT Support', rating: 4.9, reviews: 289, location: 'Bangalore', city: 'Bangalore', state: 'Karnataka', available: true },
  { id: 17, name: 'Meera Iyer', service: 'Cleaning', rating: 4.8, reviews: 201, location: 'Bangalore', city: 'Bangalore', state: 'Karnataka', available: true },
  { id: 18, name: 'Rohit Sharma', service: 'Plumbing', rating: 4.8, reviews: 167, location: 'Bangalore', city: 'Bangalore', state: 'Karnataka', available: true },
  { id: 19, name: 'Divya Patel', service: 'Electrical', rating: 4.9, reviews: 223, location: 'Bangalore', city: 'Bangalore', state: 'Karnataka', available: true },
  { id: 20, name: 'Arjun Singh', service: 'Delivery', rating: 4.6, reviews: 523, location: 'Bangalore', city: 'Bangalore', state: 'Karnataka', available: true }
];

console.log("Database connection skipped - Using in-memory storage for demo");

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!", users: users.length, success: true });
});

// Signup endpoint
app.post("/api/signup", (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    
    const { email, firstName, lastName, password, postcode } = req.body;
    
    // Validation
    if (!email || !password || !firstName || !lastName) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ message: "All fields are required", success: false });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists", success: false });
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
    console.log("✅ User registered successfully:", email);
    console.log("📊 Total users:", users.length);
    
    res.status(201).json({ 
      message: "User registered successfully", 
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      success: true 
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message, success: false });
  }
});

// Login endpoint
app.post("/api/login", (req, res) => {
  try {
    console.log("Login request received:", req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Validation failed: Missing email or password");
      return res.status(400).json({ message: "Email and password are required", success: false });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      console.log("✅ Login successful for:", email);
      res.status(200).json({ 
        message: "Login successful", 
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
        success: true 
      });
    } else {
      console.log("❌ Login failed: Invalid credentials for", email);
      res.status(401).json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message, success: false });
  }
});

// Get all users (for testing)
app.get("/api/users", (req, res) => {
  res.json({ users: users, count: users.length, success: true });
});

// Get providers by location and service (MUST be before /api/providers/:id)
app.get("/api/providers/search", (req, res) => {
  try {
    const { location, service } = req.query;
    
    let filtered = providers;

    if (location) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(location.toLowerCase()) ||
        p.location.toLowerCase().includes(location.toLowerCase()) ||
        p.state.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (service) {
      filtered = filtered.filter(p => p.service.toLowerCase().includes(service.toLowerCase()));
    }

    res.json({ providers: filtered, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error searching providers", error: error.message, success: false });
  }
});

// Get all providers
app.get("/api/providers", (req, res) => {
  res.json({ providers: providers, success: true });
});

// Create booking
app.post("/api/booking", (req, res) => {
  try {
    console.log("📅 Booking request received:", req.body);
    
    const { service, option, date, time, address, phone, description, paymentMethod, amount, userId, transactionId } = req.body;
    
    if (!service || !date || !time || !address || !phone) {
      return res.status(400).json({ message: "Missing required fields", success: false });
    }

    // Find available provider for the service
    const availableProviders = providers.filter(p => p.service === service);
    const selectedProvider = availableProviders[Math.floor(Math.random() * availableProviders.length)] || providers[0];

    const booking = {
      id: 'BK' + Date.now(),
      userId: userId || 'guest',
      service,
      option,
      date,
      time,
      address,
      phone,
      description,
      paymentMethod,
      amount,
      transactionId,
      provider: selectedProvider,
      status: 'confirmed',
      createdAt: new Date(),
      estimatedArrival: '30-45 minutes'
    };

    bookings.push(booking);
    console.log("✅ Booking created:", booking.id);

    res.status(201).json({ 
      message: "Booking confirmed successfully", 
      booking: booking,
      success: true 
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: "Error creating booking", error: error.message, success: false });
  }
});

// Get booking by ID
app.get("/api/booking/:id", (req, res) => {
  try {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found", success: false });
    }
    res.json({ booking: booking, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message, success: false });
  }
});

// Get all bookings for user
app.get("/api/bookings/:userId", (req, res) => {
  try {
    const userBookings = bookings.filter(b => b.userId === req.params.userId);
    res.json({ bookings: userBookings, count: userBookings.length, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message, success: false });
  }
});

// Verify payment
app.post("/api/verify-payment", (req, res) => {
  try {
    const { transactionId, amount } = req.body;
    
    // Simulate payment verification
    const isValid = transactionId && amount > 0;
    
    res.json({ 
      transactionId,
      status: isValid ? 'completed' : 'failed',
      message: isValid ? 'Payment verified successfully' : 'Payment verification failed',
      success: isValid
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error: error.message, success: false });
  }
});

// Cancel booking
app.post("/api/booking/:id/cancel", (req, res) => {
  try {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found", success: false });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();

    res.json({ message: "Booking cancelled successfully", booking: booking, success: true });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error: error.message, success: false });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Server error", error: err.message, success: false });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:8080`);
  console.log(`🔌 Backend API: http://localhost:${PORT}/api`);
  console.log(`📝 Test endpoint: http://localhost:${PORT}/api/test\n`);
});
