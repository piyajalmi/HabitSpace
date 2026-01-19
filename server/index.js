const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const habitRoutes = require("./routes/habitRoutes");


const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors()); 
app.use(helmet());             // ✅ ADD THIS
app.use(express.json());
app.use("/api/habits", habitRoutes);


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
});

app.use("/api/auth", authLimiter);

//authentication
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

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
