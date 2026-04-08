// controllers/paymentController.js
import Stripe from 'stripe';

import Appointment from '../models/Appointment.js';
import PresDoctor from '../models/presDoctor.js';
import PresUser from '../models/presUser.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
console.log("CLIENT_URL:", process.env.CLIENT_URL);
    if (!req.user) {
  return res.status(401).json({ success: false, message: "User not authenticated" });
}
    const { doctorId, doctorName, amount, appointmentData } = req.body;

    // Basic validation
    if (!doctorId || !doctorName || !amount || !appointmentData) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Appointment with Dr. ${doctorName}`,
            },
            unit_amount: Math.round(amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        doctorId,
        userId: req.user._id.toString(),
        appointmentData: JSON.stringify(appointmentData),
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe Checkout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};







// controllers/paymentController.js




export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ success: false, message: 'Missing session ID' });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    // Extract metadata (doctorId, userId, appointmentData)
    const { doctorId, userId, appointmentData } = session.metadata;
    const { date, timeSlot } = JSON.parse(appointmentData);

    // Check if doctor exists
    const doctor = await PresDoctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check if user exists
    const user = await PresUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: userId,
      date,
      timeSlot,
      payment: {
        method: 'online',
        status: 'paid',
        amount: session.amount_total / 100, // convert cents to dollars
      },
      status: 'confirmed',
    });

    // Optionally, you can also set a new cookie here if needed, but the existing cookie should be present if the domain is correct.
    // If you want to force-set the cookie again:
    // const token = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // res.cookie('userToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7*24*60*60*1000, path: '/' });

    res.json({
      success: true,
      message: 'Payment confirmed and appointment created',
      appointmentId: appointment._id,
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};