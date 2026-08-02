import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import imageModels, { getAvailableModels } from "../config/imageModels.js";
import promptTemplates from "../data/promptTemplates.js";

export const generateImage = async (req, res) => {
    try {

        const { userId, prompt, model } = req.body;

        const user = await userModel.findById(userId);

        if (!user || !prompt) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        if (user.creditBalance === 0 || user.creditBalance < 0) {
            return res.json({
                success: false, message: 'No credit balance', creditBalance: user.creditBalance
            })
        }

        const selectedModel = model && imageModels[model] ? model : 'clipdrop';

        const resultImage = await imageModels[selectedModel].generate(prompt);

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })

        // Save every generation to the user's history automatically.
        const savedImage = await imageModel.create({
            userId: user._id.toString(),
            prompt,
            model: selectedModel,
            imageUrl: resultImage
        });

        res.json({
            success: true,
            message: 'Image Generated',
            creditBalance: user.creditBalance - 1,
            resultImage,
            imageId: savedImage._id,
            model: selectedModel
        })

    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// GET /api/image/models — list of supported AI models for the dropdown
export const listModels = async (req, res) => {
    res.json({ success: true, models: getAvailableModels() });
}

// GET /api/image/templates — curated prompt templates
export const listTemplates = async (req, res) => {
    res.json({ success: true, templates: promptTemplates });
}

// GET /api/image/history — the logged-in user's generation history, newest first
export const getHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        const images = await imageModel.find({ userId }).sort({ createdAt: -1 }).limit(100);
        res.json({ success: true, images });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// GET /api/image/favorites — the logged-in user's favorited images
export const getFavorites = async (req, res) => {
    try {
        const { userId } = req.body;
        const images = await imageModel.find({ userId, isFavorite: true }).sort({ createdAt: -1 });
        res.json({ success: true, images });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// PATCH /api/image/:id/favorite — toggle favorite status (owner only)
export const toggleFavorite = async (req, res) => {
    try {
        const { userId } = req.body;
        const { id } = req.params;

        const image = await imageModel.findOne({ _id: id, userId });
        if (!image) {
            return res.json({ success: false, message: 'Image not found' });
        }

        image.isFavorite = !image.isFavorite;
        await image.save();

        res.json({ success: true, isFavorite: image.isFavorite });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// PATCH /api/image/:id/public — toggle whether an image appears in the public gallery
export const togglePublic = async (req, res) => {
    try {
        const { userId } = req.body;
        const { id } = req.params;

        const image = await imageModel.findOne({ _id: id, userId });
        if (!image) {
            return res.json({ success: false, message: 'Image not found' });
        }

        image.isPublic = !image.isPublic;
        await image.save();

        res.json({ success: true, isPublic: image.isPublic });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// GET /api/image/gallery — public feed of images users have chosen to share (no auth required)
export const getGallery = async (req, res) => {
    try {
        const images = await imageModel.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .limit(60)
            .select('prompt imageUrl model createdAt');

        res.json({ success: true, images });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
