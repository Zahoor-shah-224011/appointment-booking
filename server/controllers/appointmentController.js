import Appointment from '../models/Appointment.js';
import PresDoctor from '../models/presDoctor.js';
import PresUser from "../models/presUser.js"; // adjust path as needed
 // adjust path

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private (patient)
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, paymentMethod, notes } = req.body;
    const patientId = req.user._id; // from auth middleware

    // 1. Validate required fields
    if (!doctorId || !date || !timeSlot || !timeSlot.start || !timeSlot.end) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 2. Check if doctor exists
    const doctor = await PresDoctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // 3. Check if the time slot is already booked for this doctor on that date
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date).setHours(0,0,0,0), // ensure we compare only date part
      'timeSlot.start': timeSlot.start,
      'timeSlot.end': timeSlot.end,
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, message: 'Time slot already booked' });
    }

    // 4. Create appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date: new Date(date),
      timeSlot,
      notes,
      payment: {
        method: paymentMethod || 'offline',
        amount: doctor.fees, // assuming doctor has a fees field
        status: paymentMethod === 'online' ? 'paid' : 'unpaid',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    console.error('BOOK APPOINTMENT ERROR:', error);
    // Handle duplicate key error (if index works)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Time slot already taken' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all appointments for the logged-in patient
// @route   GET /api/appointments/my-appointments
// @access  Private
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialty image fees')
      .sort({ date: -1, 'timeSlot.start': -1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error('GET MY APPOINTMENTS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all appointments for a specific doctor (admin/doctor view)
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private (doctor or admin)
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // optional filter by date

    const filter = { doctor: doctorId };
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email')
      .sort({ date: 1, 'timeSlot.start': 1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    console.error('GET DOCTOR APPOINTMENTS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (patient who booked or admin)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check authorization: either the patient who booked or an admin
    if (appointment.patient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only allow cancellation if status is pending or confirmed
    if (!['pending', 'confirmed'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('CANCEL APPOINTMENT ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get available time slots for a doctor on a specific date
// @route   GET /api/appointments/available-slots/:doctorId
// @access  Public (or private)
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ success: false, message: 'Doctor ID and date are required' });
    }

    // 1. Fetch doctor to get working hours and slot duration (customize as needed)
    const doctor = await PresDoctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Example: generate slots from 9 AM to 5 PM with 30 min intervals
    // In a real app, these could be stored in the doctor's profile.
    const startHour = 9; // 9 AM
    const endHour = 17;  // 5 PM
    const slotDuration = 30; // minutes

    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += slotDuration) {
        const start = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const endMin = min + slotDuration;
        const endHourAdjusted = hour + Math.floor(endMin / 60);
        const endMinAdjusted = endMin % 60;
        const end = `${endHourAdjusted.toString().padStart(2, '0')}:${endMinAdjusted.toString().padStart(2, '0')}`;

        slots.push({
          start,
          end,
          display: `${formatTime(start)} - ${formatTime(end)}`,
        });
      }
    }

    // 2. Get already booked slots for that date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled'] }, // exclude cancelled
    }).select('timeSlot');

    // 3. Create a set of booked slot keys
    const bookedSlots = new Set(
      bookedAppointments.map(a => `${a.timeSlot.start}-${a.timeSlot.end}`)
    );

    // 4. Filter available slots
    const availableSlots = slots.filter(
      slot => !bookedSlots.has(`${slot.start}-${slot.end}`)
    );

    res.json({ success: true, date, availableSlots });
  } catch (error) {
    console.error('GET AVAILABLE SLOTS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper to format time from "HH:MM" to "h:mm AM/PM"
function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}


// @desc    Get all appointments (admin only)
// @route   GET /api/appointments/admin/all
// @access  Private/Admin
export const getAllAppointmentsAdmin = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate({
        path: 'doctor',
        select: 'name specialty image fees address',
      })
      .populate({
        path: 'patient',
        select: 'name email image dob',
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error('GET ALL APPOINTMENTS ADMIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};