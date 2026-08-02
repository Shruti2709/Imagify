import express from "express";
import { getAnalytics } from "../controllers/adminController.js";
import userAuth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

const adminRouter = express.Router();

// userAuth first (decodes JWT -> req.body.userId), then adminAuth checks user.isAdmin
adminRouter.get('/analytics', userAuth, adminAuth, getAnalytics);

export default adminRouter;
