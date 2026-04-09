// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Only load .env file in development — deployment env vars are injected automatically
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "techstore_secret_key_2024";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "TechStore API running OK" });
});

// ── MongoDB Connection ─────────────────────────────────────────────────────────
// ── MongoDB Connection ─────────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB Connection FAILED:", error.message);
    // Don't exit — let server stay alive
  }
};

// ── Routes (Auth, Products, Upload) ──────────────────────────────────────────
// ... keep all your existing route code unchanged ...
// (register/login/me/profile, products CRUD, cloudinary upload)

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "faith-electronics",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const PLACEHOLDER = "https://res.cloudinary.com/dr2u0jpvn/image/upload/v1773492892/placeholder_a1dh9w.jpg";

app.post("/api/upload", upload.array("images", 5), (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: "No files uploaded" });
    res.json({ urls: req.files.map(f => f.path) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── Start Server ─────────────────────────────────────────────────────────────
// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
connectDB();