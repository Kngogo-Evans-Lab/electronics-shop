const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "techstore_secret_key_2024";



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", function(req, res) {
  res.json({ message: "TechStore API running OK" });
});

var connectDB = async function() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB Connection FAILED:", error.message);
  }
};


const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client("360074851790-0lr673nbbl2mj2jmb2fjb2tdkisbq22c.apps.googleusercontent.com");

app.post("/api/auth/google", async function(req, res) {
  try {
    var email = req.body.email;
    var name = req.body.name;
    if (!email) return res.status(400).json({ error: "Invalid Google token" });

    var user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        name: name || "Google User",
        email: email,
        phone: "",
        password: await bcrypt.hash(Math.random().toString(36) + Date.now(), 12),
      });
    }

    var token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Google authentication failed" });
  }
});



var userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: "" },
  password: { type: String, required: true },
}, { timestamps: true });

var User = mongoose.model("User", userSchema);

var productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, trim: true },
  brand: { type: String, trim: true },
  description: { type: String, trim: true },
  specs: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  salePrice: { type: Number, min: 0, default: null },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

var Product = mongoose.model("Product", productSchema);

var authMiddleware = function(req, res, next) {
  var token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/auth/register", async function(req, res) {
  try {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    var exists = await User.findOne({ email: email });
    if (exists)
      return res.status(400).json({ error: "An account with this email already exists" });
    var hashed = await bcrypt.hash(password, 12);
    var user = await User.create({ name: name, email: email, phone: phone || "", password: hashed });
    var token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

app.post("/api/auth/login", async function(req, res) {
  try {
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });
    var user = await User.findOne({ email: email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });
    var match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });
    var token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token: token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

app.get("/api/auth/me", authMiddleware, async function(req, res) {
  try {
    var user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

app.put("/api/auth/profile", authMiddleware, async function(req, res) {
  try {
    var user = await User.findByIdAndUpdate(
      req.user.id, { name: req.body.name, phone: req.body.phone }, { new: true }
    ).select("-password");
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "faith-electronics",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

var upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

var PLACEHOLDER = "https://res.cloudinary.com/dr2u0jpvn/image/upload/v1773492892/placeholder_a1dh9w.jpg";

app.post("/api/upload", upload.array("images", 5), function(req, res) {
  try {
    if (!req.files || !req.files.length) return res.status(400).json({ error: "No files uploaded" });
    res.json({ urls: req.files.map(function(f) { return f.path; }) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products", async function(req, res) {
  try {
    var products = await Product.find().lean();
    res.json(products.map(function(p) {
      return Object.assign({}, p, { imageUrl: p.imageUrl || PLACEHOLDER });
    }));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", async function(req, res) {
  try {
    var product = await new Product(req.body).save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/products/:id", async function(req, res) {
  try {
    var product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/products/:id", async function(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, "0.0.0.0", function() {
  console.log("Server running on port " + PORT);
});

connectDB();