import jwt from 'jsonwebtoken';
import PresDoctor from '../models/presDoctor.js';

export const protectDoctor = async (req, res, next) => {
  try {
    const token = req.cookies.doctorToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    if (decoded.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const doctor = await PresDoctor.findById(decoded.id).select('-password');
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'Doctor not found' });
    }

    req.doctor = doctor; // attach doctor to request
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};