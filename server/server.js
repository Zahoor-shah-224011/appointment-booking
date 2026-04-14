import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
// import publicRouter from './routes/publicRoutes.js';

const app = express();

// =====================
// 🌐 CORS Configuration
// =====================
const allowedOrigins = [
  // "http://localhost:5173",
  "http://localhost:3000",

  "https://appointment-booking-next-lemon.vercel.app", 
  "https://appointment-booking-frontend-two.vercel.app", 
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server-to-server
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

// Apply CORS middleware
app.use(cors(corsOptions));




// Handle preflight OPTIONS requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    cors(corsOptions)(req, res, next);
  } else {
    next();
  }
});


// Test email route (temporary)
app.get('/test-email', async (req, res) => {
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'zahorchemist@gmail.com', // 🔁 Replace with your actual email
      subject: 'Test Email',
      html: '<p>Hello! This is a test email from your appointment system.</p>'
    });
    if (error) {
      console.error(error);
      return res.status(500).json({ success: false, error });
    }
    res.json({ success: true, data });                   
  } catch (err) {                                           
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});




// =====================
// 🔐 Other Middleware
// =====================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================
// 🚀 Routes
// =====================
app.get('/', (req, res) => {
  res.json({ message: 'Prescripto Backend is live 🚀' });
});
// app.use('/api/public', publicRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/payments', paymentRouter);

// =====================
// ❌ 404 & Error Handlers
// =====================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ============================================
// ✅ Connect to DB and export app for Vercel
// ============================================

// Connect to MongoDB immediately (top-level await works because "type": "module")
await connectDB();



// Conditionally start the server only when not on Vercel
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel's serverless environment
export default app;