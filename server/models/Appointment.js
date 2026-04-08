import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PresDoctor',
      required: true,
      index: true,
    },
   patient: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'PresUser', // ✅ correct model name
  required: true,
  index: true,
},
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      start: { type: String, required: true }, // e.g., "10:00 AM"
      end: { type: String, required: true },   // e.g., "10:30 AM"
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
      index: true,
    },
    payment: {
      method: { type: String, enum: ['online', 'offline'], default: 'offline' },
      transactionId: String,
      amount: Number,
      status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure unique appointment per doctor per time slot on same date
appointmentSchema.index(
  { doctor: 1, date: 1, 'timeSlot.start': 1, 'timeSlot.end': 1 },
  { unique: true }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;