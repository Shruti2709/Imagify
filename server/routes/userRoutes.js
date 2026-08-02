import express from "express";
import { registerUser, loginUser, userCredits, getProfile } from "../controllers/userController.js";
import userAuth from "../middlewares/auth.js";
import { paymentRazorpay } from "../controllers/userController.js";
import { verifyRazorpay } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth, userCredits);
userRouter.get('/profile', userAuth, getProfile);
userRouter.post('/pay-razor', userAuth, paymentRazorpay);
userRouter.post('/verify-razor', verifyRazorpay);

export default userRouter;
