import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react"
import { Link } from 'react-router-dom'

const StatCard = ({ label, value }) => (
  <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-5 text-center shadow-sm'>
    <p className='text-2xl font-semibold text-neutral-800 dark:text-white'>{value}</p>
    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{label}</p>
  </div>
)

const Profile = () => {
  const { getProfile, darkMode, toggleDarkMode } = useContext(AppContext)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    (async () => {
      const data = await getProfile()
      setProfile(data)
    })()
  }, [])

  if (!profile) {
    return <div className='min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-400'>Loading profile...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='min-h-[70vh] py-10 max-w-3xl mx-auto'
    >
      <h1 className='text-2xl sm:text-3xl font-semibold text-center mb-8 text-neutral-800 dark:text-white'>Your Dashboard</h1>

      <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:justify-between'>
        <div>
          <p className='text-lg font-medium text-neutral-800 dark:text-white'>{profile.name}</p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{profile.email}</p>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Member since {new Date(profile.memberSince).toLocaleDateString()}</p>
        </div>

        <button
          onClick={toggleDarkMode}
          className='px-5 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm text-neutral-700 dark:text-gray-200 hover:scale-105 transition-transform'
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
        <StatCard label='Credits Left' value={profile.creditBalance} />
        <StatCard label='Images Generated' value={profile.totalImages} />
        <StatCard label='Favorites' value={profile.favoritesCount} />
        <StatCard label='Public Images' value={profile.publicCount} />
      </div>

      <div className='flex flex-wrap justify-center gap-3'>
        <Link to='/history' className='px-6 py-2.5 rounded-full bg-zinc-800 text-white text-sm hover:scale-105 transition-transform'>View History</Link>
        <Link to='/favorites' className='px-6 py-2.5 rounded-full bg-zinc-800 text-white text-sm hover:scale-105 transition-transform'>View Favorites</Link>
        <Link to='/gallery' className='px-6 py-2.5 rounded-full bg-zinc-800 text-white text-sm hover:scale-105 transition-transform'>Public Gallery</Link>
        {profile.isAdmin && (
          <Link to='/admin' className='px-6 py-2.5 rounded-full bg-purple-700 text-white text-sm hover:scale-105 transition-transform'>Admin Dashboard</Link>
        )}
      </div>
    </motion.div>
  )
}

export default Profile
