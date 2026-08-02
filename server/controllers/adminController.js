import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import transactionModel from "../models/transactionModel.js";

// GET /api/admin/analytics — high-level platform stats for the admin dashboard
export const getAnalytics = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [
            totalUsers,
            totalImages,
            imagesToday,
            publicImages,
            paidTransactions
        ] = await Promise.all([
            userModel.countDocuments({}),
            imageModel.countDocuments({}),
            imageModel.countDocuments({ createdAt: { $gte: startOfToday } }),
            imageModel.countDocuments({ isPublic: true }),
            transactionModel.find({ payment: true })
        ]);

        const totalRevenue = paidTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalCreditsSold = paidTransactions.reduce((sum, t) => sum + (t.credits || 0), 0);

        // Count new signups today via Mongo's ObjectId embedded timestamp.
        const objectIdFromDate = (date) => Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
        const newSignupsToday = await userModel.countDocuments({
            _id: { $gte: objectIdFromDate(startOfToday) }
        });

        const modelBreakdown = await imageModel.aggregate([
            { $group: { _id: "$model", count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            analytics: {
                totalUsers,
                newSignupsToday,
                totalImages,
                imagesToday,
                publicImages,
                totalRevenue,
                totalCreditsSold,
                totalTransactions: paidTransactions.length,
                modelBreakdown
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
