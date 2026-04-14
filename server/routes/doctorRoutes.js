import express from 'express';
import { doctorLogin, doctorLogout, doctorRegister, getAllDoctorsPublic, getCurrentDoctor, getDoctorAppointments, getDoctorById, getDoctorDashboard, getDoctorProfile, updateAppointmentStatus, updateDoctorProfile } from '../controllers/doctorController.js';
import { protectDoctor } from '../middleware/doctorAuth.js';
import multerUpload from '../config/multer.js';



const doctorRouter = express.Router();
// Add this route BEFORE the protectDoctor middleware (so it's public)
doctorRouter.get('/all', async (req, res) => {
  try {
    const doctors = await PresDoctor.find({}, '_id').lean();
    res.json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

doctorRouter.post('/login', doctorLogin);
doctorRouter.post('/logout', doctorLogout);
// apply auth ONLY where needed
doctorRouter.get('/all', getAllDoctorsPublic);
doctorRouter.get('/appointments', protectDoctor, getDoctorAppointments);
doctorRouter.get('/profile', protectDoctor, getDoctorProfile);
doctorRouter.put('/profile', protectDoctor, multerUpload.single('image'), updateDoctorProfile);
doctorRouter.get('/dashboard', protectDoctor, getDoctorDashboard);
doctorRouter.put('/appointments/:id/status', protectDoctor, updateAppointmentStatus);
doctorRouter.post('/register', multerUpload.single('image'), doctorRegister);
doctorRouter.get('/me', protectDoctor, getCurrentDoctor);
doctorRouter.get('/:id', getDoctorById);

export default doctorRouter;



