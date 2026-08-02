import userModel from "../models/userModel.js";

// Must run AFTER userAuth (which sets req.body.userId from the JWT).
const adminAuth = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (!user || !user.isAdmin) {
            return res.json({ success: false, message: 'Not Authorized. Admins only.' });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
