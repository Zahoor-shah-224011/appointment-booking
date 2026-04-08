import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  getAvailableSlots,
  getAllAppointmentsAdmin,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js'; // your auth middleware
import { adminLogin } from '../controllers/adminController.js';

const appointmentRouter = express.Router();
appointmentRouter.get('/admin/all', getAllAppointmentsAdmin); 
// All routes below are protected by default, except available-slots (optional)
appointmentRouter.use(protect); // apply to all routes in this file

appointmentRouter.post('/book', bookAppointment);
appointmentRouter.get('/my-appointments', getMyAppointments);
appointmentRouter.get('/doctor/:doctorId', getDoctorAppointments);
appointmentRouter.put('/:id/cancel', cancelAppointment);
appointmentRouter.get('/available-slots/:doctorId', getAvailableSlots);
// may be public, adjust

export default appointmentRouter;