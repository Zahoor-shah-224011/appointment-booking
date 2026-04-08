// import PresDoctor from "../models/PresDoctor.js";

import PresDoctor from '../models/presDoctor.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { uploadToCloudinary } from '../config/multer.js';

// @desc    Doctor login


// zahoor$hah1234     doctor@example.com





// @route   POST /api/doctor/login
// @access  Public
export const doctorLogin = async (req, res) => {


  try {
    const { email, password } = req.body;

    const doctor = await PresDoctor.findOne({ email }).select('+password');
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ✅ CREATE TOKEN
    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ SET COOKIE
   const isProduction = process.env.NODE_ENV === 'production';

res.cookie('doctorToken', token, {
  httpOnly: true,
  secure: isProduction,      // false on localhost
  sameSite: isProduction ? 'none' : 'lax',  // lax works for localhost redirects
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
    // ✅ SEND RESPONSE (THIS WAS MISSING)
    return res.json({
      success: true,
      message: "Doctor login successful",
      doctorId: doctor._id,
    });

  } catch (error) {
    console.error('DOCTOR LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await PresDoctor.findById(id).select('-password'); // exclude password
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, doctor });
  } catch (error) {
    console.error('GET DOCTOR BY ID ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const { limit } = req.query;

    let query = Appointment.find({ doctor: doctorId })
      .populate('patient', 'name email image dob')
      .sort({ date: -1, 'timeSlot.start': -1 });

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const appointments = await query;
    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    // ...
  }
};

// @desc    Update appointment status (completed or cancelled)
// @route   PUT /api/doctor/appointments/:id/status
// @access  Private (doctor)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected: 'completed' or 'cancelled'

    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Ensure the appointment belongs to the logged-in doctor
    if (appointment.doctor.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ success: true, message: `Appointment marked as ${status}` });
  } catch (error) {
    console.error('UPDATE APPOINTMENT STATUS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// @desc    Get logged-in doctor's profile
// @route   GET /api/doctor/profile
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await PresDoctor.findById(req.doctor._id).select('-password');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, doctor });
  } catch (error) {
    console.error('GET DOCTOR PROFILE ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update doctor's profile
// @route   PUT /api/doctor/profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const { degree, specialty, experience, about, fees, address, available } = req.body;

    const doctor = await PresDoctor.findById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Update fields only if provided
    if (degree !== undefined) doctor.degree = degree;
    if (specialty !== undefined) doctor.specialty = specialty;
    if (experience !== undefined) doctor.experience = experience;
    if (about !== undefined) doctor.about = about;
    if (fees !== undefined) doctor.fees = fees;
    if (address !== undefined) doctor.address = address;
    if (available !== undefined) doctor.available = available === 'true' || available === true;

    // Handle image upload
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'doctors');
      doctor.image = imageUrl;
    }

    await doctor.save();

    const updatedDoctor = await PresDoctor.findById(doctor._id).select('-password');
    res.json({ success: true, message: 'Profile updated', doctor: updatedDoctor });
  } catch (error) {
    console.error('UPDATE DOCTOR PROFILE ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// controllers/doctorController.js
export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.doctor._id;

    // Total earnings (sum of fees for completed appointments)
    const earningsResult = await Appointment.aggregate([
      { $match: { doctor: doctorId, status: 'completed' } },
      { $lookup: { from: 'presdoctors', localField: 'doctor', foreignField: '_id', as: 'doctorInfo' } },
      { $unwind: '$doctorInfo' },
      { $group: { _id: null, total: { $sum: '$doctorInfo.fees' } } }
    ]);
    const earnings = earningsResult.length ? earningsResult[0].total : 0;

    // Total appointments (all, or you can count only non-cancelled)
    const appointmentsCount = await Appointment.countDocuments({ doctor: doctorId });

    // Total distinct patients
    const patientsCount = await Appointment.distinct('patient', { doctor: doctorId }).then(p => p.length);

    // Recent 5 appointments
    const recentAppointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name image')
      .sort({ date: -1, 'timeSlot.start': -1 })
      .limit(5);

    res.json({
      success: true,
      data: { earnings, appointmentsCount, patientsCount, recentAppointments }
    });
  } catch (error) {
    console.error('DASHBOARD ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// doctorController.js
export const getCurrentDoctor = async (req, res) => {
  try {
    // req.doctor should be set by protectDoctor middleware
    const doctor = await PresDoctor.findById(req.doctor._id).select('-password');
    res.json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



export const doctorLogout = async (req, res) => {
  try {
    res.clearCookie('doctorToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('DOCTOR LOGOUT ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



 // adjust path if needed

// @desc    Register a new doctor
// @route   POST /api/doctor/register
// @access  Public
export const doctorRegister = async (req, res) => {
  try {
    const { name, email, password, specialty, degree, experience, fees, about, address } = req.body;

    // Basic validation
    if (!name || !email || !password || !specialty || !degree || !experience || !fees) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if doctor already exists
    const existingDoctor = await PresDoctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image if provided
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'doctors');
    }

    // Create doctor (address is stored as a string)
    const doctor = await PresDoctor.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      specialty,
      degree,
      experience: Number(experience),
      fees: Number(fees),
      about: about || '',
      address: address || '', // store as string
      available: true,
    });

    // Generate token and set cookie (auto‑login)
    const token = jwt.sign(
      { id: doctor._id, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

   const isProduction = process.env.NODE_ENV === 'production';

res.cookie('doctorToken', token, {
  httpOnly: true,
  secure: isProduction,      // false on localhost
  sameSite: isProduction ? 'none' : 'lax',  // lax works for localhost redirects
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        image: doctor.image,
        specialty: doctor.specialty,
      },
    });
  } catch (error) {
    console.error('DOCTOR REGISTER ERROR:', error);

    // Handle duplicate key error (just in case)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Doctor already exists with this email' });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getAllDoctorsPublic = async (req, res) => {
  try {
    // Return only _id for sitemap
    const doctors = await PresDoctor.find({}, '_id');
    res.json({ success: true, doctors });
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};