import express from 'express'
import {
    generateImage,
    listModels,
    listTemplates,
    getHistory,
    getFavorites,
    toggleFavorite,
    togglePublic,
    getGallery
} from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

imageRouter.post('/generate-image', userAuth, generateImage)
imageRouter.get('/models', listModels)
imageRouter.get('/templates', listTemplates)
imageRouter.get('/history', userAuth, getHistory)
imageRouter.get('/favorites', userAuth, getFavorites)
imageRouter.patch('/:id/favorite', userAuth, toggleFavorite)
imageRouter.patch('/:id/public', userAuth, togglePublic)
imageRouter.get('/gallery', getGallery) // public route, no auth

export default imageRouter
