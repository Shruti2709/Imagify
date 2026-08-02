import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";
import { sendMail, welcomeEmailHtml, paymentEmailHtml } from "../utils/mailer.js";

dotenv.config();

const DAILY_FREE_CREDITS = Number(process.env.DAILY_FREE_CREDITS) || 3;

// Returns true if `date` was NOT on today's calendar date (so a bonus is due)
const isNewDay = (date) => {
    if (!date) return true;
    const last = new Date(date);
    const now = new Date();
    return last.toDateString() !== now.toDateString();
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userdata = {
            name, email, password: hashedPassword
        }
        const newUser = new userModel(userdata);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // Fire-and-forget welcome email — never blocks registration if SMTP isn't configured.
        sendMail({ to: user.email, subject: "Welcome to Imagify 🎉", html: welcomeEmailHtml(user.name) });

        res.json({ success: true, message: "User registered successfully", token, user: { name: user.name } })
    }
    catch (error) {

        console.error(error);
        res.json({ success: false, message: "Error registering user" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, message: "User logged in successfully", token, user: { name: user.name } });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const userCredits = async (req, res) => {

    try {
        const { userId } = req.body;

        let user = await userModel.findById(userId)

        let dailyBonusApplied = false;

        // Daily free credits: grant a small top-up once per calendar day.
        if (isNewDay(user.lastFreeCreditAt)) {
            user = await userModel.findByIdAndUpdate(
                userId,
                {
                    $inc: { creditBalance: DAILY_FREE_CREDITS },
                    $set: { lastFreeCreditAt: new Date() }
                },
                { new: true }
            );
            dailyBonusApplied = true;
        }

        res.json({
            success: true,
            credits: user.creditBalance,
            user: { name: user.name },
            dailyBonusApplied,
            dailyBonusAmount: DAILY_FREE_CREDITS
        })
    }
    catch (error) {

        console.error(error);
        res.json({ success: false, message: error.message });

    }

}

// GET /api/user/profile — dashboard stats for the logged-in user
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const [totalImages, favoritesCount, publicCount] = await Promise.all([
            imageModel.countDocuments({ userId }),
            imageModel.countDocuments({ userId, isFavorite: true }),
            imageModel.countDocuments({ userId, isPublic: true }),
        ]);

        res.json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
                creditBalance: user.creditBalance,
                isAdmin: user.isAdmin,
                memberSince: user._id.getTimestamp(),
                totalImages,
                favoritesCount,
                publicCount
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const paymentRazorpay = async (req, res) => {

    try {

        const { userId, planId } = req.body;

        const userData = await userModel.findById(userId);

        if (!userId || !planId) {
            return res.json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        let credits, plan, amount, date;

        switch (planId) {

            case 'Basic':
                credits = 100;
                plan = 'Basic';
                amount = 10;
                break;

            case 'Advanced':
                credits = 500;
                plan = 'Advanced';
                amount = 50;
                break;

            case 'Business':
                credits = 5000;
                plan = 'Business';
                amount = 250;
                break;

            default:
                return res.json({
                    success: false,
                    message: "plan not found"
                });
        }

        date = Date.now();

        const transactionData = {
            userId,
            plan,
            credits,
            amount,
            date
        };

        const newTransaction = new transactionModel(transactionData);

        await newTransaction.save();

        console.log("Transaction Saved:", newTransaction._id);

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id.toString()
        };

        razorpayInstance.orders.create(options, (error, order) => {

            if (error) {
                console.error(error);
                return res.json({
                    success: false,
                    message: error.message
                });
            }

            return res.json({
                success: true,
                order
            });

        });

    } catch (error) {

        console.error(error);

        res.json({
            success: false,
            message: error.message
        });

    }
}
export const verifyRazorpay = async (req, res) => {

    try {

        const { razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        console.log("Receipt from Razorpay:", orderInfo.receipt);

        if (orderInfo.status === 'paid') {

            const transaction = await transactionModel.findById(orderInfo.receipt);

            console.log("Transaction Found:", transaction);

            if (!transaction) {
                return res.json({
                    success: false,
                    message: "Transaction not found"
                });
            }

            if (transaction.payment) {
                return res.json({
                    success: false,
                    message: "Payment already verified"
                });
            }

            const userData = await userModel.findById(transaction.userId);

            const creditBalance =
                userData.creditBalance + transaction.credits;

            await userModel.findByIdAndUpdate(
                userData._id,
                { creditBalance }
            );

            await transactionModel.findByIdAndUpdate(
                transaction._id,
                { payment: true }
            );

            // Fire-and-forget payment confirmation email.
            sendMail({
                to: userData.email,
                subject: "Payment Successful — Credits Added",
                html: paymentEmailHtml(userData.name, transaction.credits, transaction.amount, process.env.CURRENCY)
            });

            return res.json({
                success: true,
                message: "Payment successful and credits added"
            });

        }

        return res.json({
            success: false,
            message: "Payment failed"
        });

    } catch (error) {

        console.error(error);

        res.json({
            success: false,
            message: error.message
        });

    }
};
