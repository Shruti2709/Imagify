import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    model: {
        type: String,
        default: 'clipdrop'
    },
    imageUrl: {
        type: String,
        required: true
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const imageModel = mongoose.models.image || mongoose.model("image", imageSchema);

export default imageModel;
