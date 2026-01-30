const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const habitRoutes = require("./routes/habitRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

const connectDB = require("./config/db");
;
dotenv.config();

const app = express();
app.set("trust proxy", 1); 

connectDB()

const startNotificationScheduler = require("./utils/notificationScheduler");
startNotificationScheduler();



// Middleware

app.use(helmet());             // ✅ ADD THIS
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://habit-space-60kooev66-piya-jalmis-projects.vercel.app/"],
  credentials: true
}));

app.use("/api/habits", habitRoutes);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
});



//authentication
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/summary", summaryRoutes);

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



