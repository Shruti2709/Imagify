import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import ImageCard from '../components/ImageCard'
import { motion } from "motion/react"

const Gallery = () => {
  const { getGallery } = useContext(AppContext)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const data = await getGallery()
      setImages(data)
      setLoading(false)
    })()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='min-h-[70vh] py-10'
    >
      <h1 className='text-2xl sm:text-3xl font-semibold text-center mb-2 text-neutral-800 dark:text-white'>Public Gallery</h1>
      <p className='text-center text-gray-500 dark:text-gray-400 mb-8 text-sm'>Images the community has chosen to share publicly</p>

      {loading && <p className='text-center text-gray-500 dark:text-gray-400'>Loading...</p>}
      {!loading && images.length === 0 && (
        <p className='text-center text-gray-500 dark:text-gray-400'>No public images yet — be the first to share one!</p>
      )}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
        {images.map(img => (
          <ImageCard key={img._id} image={img} />
        ))}
      </div>
    </motion.div>
  )
}

export default Gallery
