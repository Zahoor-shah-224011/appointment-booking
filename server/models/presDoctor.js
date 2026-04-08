// models/doctorModel.js
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },




 





    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // don't return password in queries by default
    },

    image: {
      type: String,
      required: [true, 'Profile image is required'],
    },

    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },

    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },

    experience: {
      type: String,
      required: [true, 'Years of experience is required'],
    },

    about: {
      type: String,
      required: [true, 'About section is required'],
      maxlength: 1000,
    },

    available: {
      type: Boolean,
      default: true,
    },

    fees: {
      type: Number,
      required: [true, 'Consultation fees are required'],
      min: 0,
    },

   address: { type: String, default: '' },       // full address as string (optional, keep for backward compatibility)
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  country: { type: String, default: '' },
  phone: { type: String, default: '' },
    date: {
      type: Date,
      default: Date.now,
    },

    slots_booked: {
      type: Map,
      of: [String], // dateString → array of time slots "10:00", "14:30", etc.
      default: () => new Map(),
    },
  },
  {
    timestamps: true,
    minimize: false, // keep empty objects/arrays
  }
);

const PresDoctor = mongoose.models.PresDoctor || mongoose.model('PresDoctor', doctorSchema);

export default PresDoctor;
