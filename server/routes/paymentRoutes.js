// routes/paymentRoutes.js
import express from 'express';
import { confirmPayment, createCheckoutSession } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-checkout-session', protect, createCheckoutSession);
paymentRouter.post('/confirm-payment', confirmPayment);

export default paymentRouter;