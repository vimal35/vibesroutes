const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "stayease-dev-secret-change-me";

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  mobile: user.mobile || "",
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

router.post("/register", async (req, res) => {
  try {
    const fullName = String(req.body?.fullName || "").trim();
    const email = normalizeEmail(req.body?.email);
    const mobile = String(req.body?.mobile || "").trim();
    const password = String(req.body?.password || "");
    const confirmPassword = String(req.body?.confirmPassword || "");
    const acceptTerms = Boolean(req.body?.acceptTerms);

    if (!fullName) {
      return res
        .status(400)
        .json({ success: false, message: "Full name is required." });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address." });
    }

    if (mobile && !/^[0-9+()\-\s]{8,15}$/.test(mobile)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid mobile number." });
    }

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters long.",
        });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    if (!acceptTerms) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please accept the Terms & Conditions and Privacy Policy.",
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({
          success: false,
          message: "An account with this email already exists.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
    });

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message:
        "Unable to create your account right now. Please try again later.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid email address." });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Enter your password." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const token = signToken(user);

    return res.json({
      success: true,
      message: "Signed in successfully.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to sign you in right now. Please try again later.",
    });
  }
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication token missing." });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
});

module.exports = router;
