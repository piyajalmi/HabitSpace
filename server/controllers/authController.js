const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateResetToken = require("../utils/generateResetToken");
const nodemailer = require("nodemailer");

const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};


// 🔹 FORGOT PASSWORD
const forgotPassword = async (req, res) => {

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = generateResetToken();

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const resetURL = `http://localhost:5173/reset-password/${resetToken}`;

 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

  await transporter.sendMail({
    to: user.email,
    subject: "HabitSpace Password Reset",
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password (valid for 15 mins):</p>
      <a href="${resetURL}">${resetURL}</a>
    `,
  });

  res.json({ message: "Reset link sent to email" });
};
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Token invalid or expired" });

  const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};


const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Password validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // 2️⃣ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // 3️⃣ Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 4️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5️⃣ Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 6️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    // 7️⃣ SEND VERIFICATION EMAIL ✅ (THIS WAS MISSING)
    const verifyUrl = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;


    await sendEmail({
      to: user.email,
      subject: "Verify your HabitSpace account",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Welcome to HabitSpace 🌱</h2>
          <p>Please verify your email to continue:</p>
          <a
            href="${verifyUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#4f46e5;
              color:#fff;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Verify Email
          </a>
          <p style="margin-top:16px;font-size:12px;color:#666;">
            If you didn’t create this account, ignore this email.
          </p>
        </div>
      `,
    });

    // 8️⃣ Create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 9️⃣ Response
    res.status(201).json({
      message: "Signup successful. Please verify your email.",
      token,
      name: user.name,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email before logging in",
  });
}

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

   const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


    res.json({
  message: "Login successful",
  token,
  name: user.name, // ✅ ADD
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  signup,
  login,
  verifyEmail,
  getMe,
  forgotPassword,
  resetPassword,
};



