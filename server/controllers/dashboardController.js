// controllers/dashboardController.js (or add to adminController.js)
import PresDoctor from '../models/presDoctor.js';
import Appointment from '../models/Appointment.js';
import PresUser from '../models/presUser.js';

export const getAdminDashboard = async (req, res) => {
  try {
    // 1. Total doctors
    const totalDoctors = await PresDoctor.countDocuments();

    // 2. Total appointments (adjust filter as needed)
    const totalAppointments = await Appointment.countDocuments();
    // If you want only active appointments (pending/confirmed), use:
    // const totalAppointments = await Appointment.countDocuments({ status: { $in: ['pending', 'confirmed'] } });

    // 3. Total patients (all registered users)
    const totalPatients = await PresUser.countDocuments();
    // Alternatively, count distinct patients who have booked appointments:
    // const distinctPatients = await Appointment.distinct('patient');
    // const totalPatients = distinctPatients.length;

    // 4. Latest 5 appointments with doctor details
    const latestAppointments = await Appointment.find()
      .populate('doctor', 'name image')
      .sort({ date: -1 }) // or createdAt, whichever you prefer
      .limit(5);

      
    // Format for frontend
    const formattedLatest = latestAppointments.map((app) => ({
      id: app._id,
      doctorName: app.doctor?.name || 'Unknown',
      doctorImage: app.doctor?.image || null,
      bookingDate: app.date, // you can format the date on frontend
    }));

    res.json({
      success: true,
      data: {
        totalDoctors,
        totalAppointments,
        totalPatients,
        latestAppointments: formattedLatest,
      },
    });
  } catch (error) {
    console.error('DASHBOARD ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};