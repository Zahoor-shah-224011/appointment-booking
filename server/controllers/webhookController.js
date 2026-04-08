import Stripe from 'stripe';
import Appointment from '../models/Appointment.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { doctorId, userId, appointmentData } = session.metadata;
    const { date, timeSlot } = JSON.parse(appointmentData);

    // Create appointment with paid status
    await Appointment.create({
      doctor: doctorId,
      patient: userId,
      date,
      timeSlot,
      payment: { method: 'online', status: 'paid', amount: session.amount_total / 100 },
      status: 'confirmed',
    });
  }

  res.json({ received: true });
};