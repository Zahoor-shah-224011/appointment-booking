import express from "express";
import { addDoctor, adminLogin, adminLogout, getAllDoctors, isAdminAuth } from "../controllers/adminController.js";
import isAdmin from "../middleware/isAdmin.js";
import multerUpload from "../config/multer.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/is-auth",isAdmin, isAdminAuth);
adminRouter.post("/logout",isAdmin, adminLogout);
adminRouter.post("/add-doctor",  multerUpload.single("image"), addDoctor);
adminRouter.get('/doctors', getAllDoctors);



export default adminRouter;
