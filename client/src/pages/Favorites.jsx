import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import ImageCard from '../components/ImageCard'
import { motion } from "motion/react"

const Favorites = () => {
  const { getFavorites, toggleFavorite, togglePublic } = useContext(AppContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await getFavorites()
    setImages(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFavorite = async (id) => {
    await toggleFavorite(id)
    // Unfavoriting removes it from this list entirely
    setImages(prev => prev.filter(img => img._id !== id))
  }

  const handlePublic = async (id) => {
    const isPublic = await togglePublic(id)
    setImages(prev => prev.map(img => img._id === id ? { ...img, isPublic } : img))
  }

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='min-h-[70vh] py-10'
    >
      <h1 className='text-2xl sm:text-3xl font-semibold text-center mb-8 text-neutral-800 dark:text-white'>Favorite Collections</h1>

      {loading && <p className='text-center text-gray-500 dark:text-gray-400'>Loading...</p>}
      {!loading && images.length === 0 && (
        <p className='text-center text-gray-500 dark:text-gray-400'>No favorites yet — star an image from your history to save it here.</p>
      )}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {images.map(img => (
          <ImageCard
            key={img._id}
            image={img}
            showActions
            isOwner
            onToggleFavorite={handleFavorite}
            onTogglePublic={handlePublic}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default Favorites
