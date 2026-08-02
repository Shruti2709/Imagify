import React from 'react'
import { motion } from "motion/react"

// Shared card used by History, Favorites and Gallery pages.
const ImageCard = ({ image, showActions = false, isOwner = false, onToggleFavorite, onTogglePublic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow'
    >
      <img src={image.imageUrl} alt={image.prompt} className='w-full aspect-square object-cover' />
      <div className='p-3'>
        <p className='text-sm text-gray-700 dark:text-gray-200 line-clamp-2' title={image.prompt}>{image.prompt}</p>
        <div className='flex items-center justify-between mt-2'>
          <span className='text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'>{image.model || 'clipdrop'}</span>
          <a href={image.imageUrl} download className='text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300'>Download</a>
        </div>

        {showActions && isOwner && (
          <div className='flex gap-2 mt-3'>
            <button
              onClick={() => onToggleFavorite && onToggleFavorite(image._id)}
              className={`flex-1 text-xs py-1.5 rounded-full border transition-colors ${image.isFavorite ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}
            >
              {image.isFavorite ? '★ Favorited' : '☆ Favorite'}
            </button>
            <button
              onClick={() => onTogglePublic && onTogglePublic(image._id)}
              className={`flex-1 text-xs py-1.5 rounded-full border transition-colors ${image.isPublic ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}
            >
              {image.isPublic ? 'Public' : 'Make Public'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ImageCard
