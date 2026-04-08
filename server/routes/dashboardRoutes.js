import express from 'express';
import { getAdminDashboard } from '../controllers/dashboardController.js';
import isAdmin from '../middleware/isAdmin.js';

const dashboardRouter = express.Router();

// All dashboard routes are protected by admin middleware
dashboardRouter.get('/', getAdminDashboard);

export default dashboardRouter;