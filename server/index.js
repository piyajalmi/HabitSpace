const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Health route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend + DB connected",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
