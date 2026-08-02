import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'

const Card = ({ label, value }) => (
  <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-6 text-center shadow-sm'>
    <p className='text-3xl font-semibold text-neutral-800 dark:text-white'>{value}</p>
    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{label}</p>
  </div>
)

const Admin = () => {
  const { getAdminAnalytics, user } = useContext(AppContext)
  const [analytics, setAnalytics] = useState(null)
  const [notAuthorized, setNotAuthorized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const data = await getAdminAnalytics()
      if (!data) {
        setNotAuthorized(true)
        return
      }
      setAnalytics(data)
    })()
  }, [])

  if (!user) {
    return <div className='min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-400'>Please log in to view this page.</div>
  }

  if (notAuthorized) {
    return (
      <div className='min-h-[70vh] flex flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400'>
        <p>You don't have access to the admin dashboard.</p>
        <button onClick={() => navigate('/')} className='px-6 py-2 rounded-full bg-zinc-800 text-white text-sm'>Go Home</button>
      </div>
    )
  }

  if (!analytics) {
    return <div className='min-h-[70vh] flex items-center justify-center text-gray-500 dark:text-gray-400'>Loading analytics...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='min-h-[70vh] py-10'
    >
      <h1 className='text-2xl sm:text-3xl font-semibold text-center mb-8 text-neutral-800 dark:text-white'>Admin Analytics Dashboard</h1>

      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8'>
        <Card label='Total Users' value={analytics.totalUsers} />
        <Card label='New Signups Today' value={analytics.newSignupsToday} />
        <Card label='Total Images Generated' value={analytics.totalImages} />
        <Card label='Images Generated Today' value={analytics.imagesToday} />
        <Card label='Public Gallery Images' value={analytics.publicImages} />
        <Card label='Total Transactions' value={analytics.totalTransactions} />
        <Card label='Total Credits Sold' value={analytics.totalCreditsSold} />
        <Card label='Total Revenue' value={`${analytics.totalRevenue} ${import.meta.env.VITE_CURRENCY || ''}`} />
      </div>

      <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-lg mx-auto'>
        <h2 className='font-medium text-neutral-800 dark:text-white mb-3'>Generations by Model</h2>
        {analytics.modelBreakdown.length === 0 && <p className='text-sm text-gray-500 dark:text-gray-400'>No data yet.</p>}
        {analytics.modelBreakdown.map(m => (
          <div key={m._id} className='flex justify-between text-sm py-1.5 border-b last:border-0 border-gray-100 dark:border-gray-700'>
            <span className='text-gray-600 dark:text-gray-300'>{m._id || 'unknown'}</span>
            <span className='font-medium text-neutral-800 dark:text-white'>{m.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default Admin
