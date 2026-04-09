const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// routes
app.use("/api", userRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
