import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PresUser from "../models/presUser.js";

/* ----------------------------- TOKEN CREATOR ----------------------------- */
const createToken = (userId) => {
  return jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ----------------------------- REGISTER USER ----------------------------- */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // check existing
    const existingUser = await PresUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await PresUser.create({
      name,
      email,
      password: hashedPassword,
    });

    // token
// token
const token = createToken(user._id);
const isProd = process.env.NODE_ENV === "production";

res.cookie("userToken", token, {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',  // ← add this
});








    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/* ------------------------------- LOGIN USER ------------------------------ */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // find user with password
    const user = await PresUser.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // create token
 // token
const token = createToken(user._id);
const isProd = process.env.NODE_ENV === "production";

res.cookie("userToken", token, {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',  // ← add this
});

    // cookie
    // res.cookie("userToken", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};



// controllers/userController.js
export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.userToken; // must match cookie name
    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await PresUser.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("userToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.json({ success: true, message: "Logged out" });
};





// @desc    Get logged-in user's profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    // `req.user` is set by your `protect` middleware
    const user = await PresUser.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/user/profile
// @access  Private
// import PresUser from '../models/presUser.js';



import { uploadToCloudinary } from '../config/multer.js'; // adjust path

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address, gender, birthday } = req.body;
    const user = await PresUser.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (gender) user.gender = gender;

    // Parse birthday
    if (birthday) {
      const parts = birthday.match(/(\d{1,2})\s+(\w+),\s+(\d{4})/);
      if (parts) {
        const day = parseInt(parts[1]);
        const month = parts[2];
        const year = parseInt(parts[3]);
        const monthIndex = new Date(Date.parse(month + ' 1, 2000')).getMonth();
        if (!isNaN(monthIndex)) {
          user.dob = new Date(year, monthIndex, day);
        }
      }
    }

    // ✅ Handle image upload – use buffer and upload to Cloudinary
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'users');
      user.image = imageUrl;
    }

    await user.save();

    // Fetch updated user without password
    const updatedUser = await PresUser.findById(user._id).select('-password');
    res.json({ success: true, message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};