import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { uploadToCloudinary } from "../config/multer.js";
import PresDoctor from "../models/presDoctor.js";
// import PresDoctor from "../models/PresDoctor.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    // 1️⃣ check fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // 2️⃣ verify admin credentials
if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
  return res.status(401).json({ success: false, message: "Invalid credentials" });
}

    // 3️⃣ create token
    const token = jwt.sign(
      { role: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ send cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,          // required for Vercel (HTTPS)
      sameSite: "none",      // required for cross-origin frontend
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5️⃣ response
    res.status(200).json({
      success: true,
      message: "Admin login successful",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





export const isAdminAuth = (req, res) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.json({ success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      return res.json({ success: true });
    }

    res.json({ success: false });

  } catch {
    res.json({ success: false });
  }
};



export const adminLogout = (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};



export const addDoctor = async (req, res) => {
 
  try {
    // image check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // upload image
    const imageUrl = await uploadToCloudinary(req.file.buffer, "doctors");

    // parse address (comes as string)
    let address = {};
    try {
      address = JSON.parse(req.body.address);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid address format",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create doctor
    const doctor = await PresDoctor.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: imageUrl,
     specialty: req.body.specialty,     // ✅ matches frontend // frontend → backend mapping
      degree: req.body.degree,
      experience: req.body.experience,
      about: req.body.about,
      fees: req.body.fees,
      address: address,
    });

    res.json({
      success: true,
      message: "Doctor added successfully",
      doctorId: doctor._id,
    });

  } catch (error) {
    console.log("ADD DOCTOR ERROR:", error);

    // duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while adding doctor",
    });
  }
};

// controllers/doctorController.js (or add to existing adminController)
export const getAllDoctors = async (req, res) => {
  try {
    // Fetch all doctors, excluding password and __v, and sorting by newest first
    const doctors = await PresDoctor.find({})
      .select('-password -__v')
      .sort({ createdAt: -1 }); // optional: sort by creation date

    res.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error('GET ALL DOCTORS ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctors',
    });
  }
};