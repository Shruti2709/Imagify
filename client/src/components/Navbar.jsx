import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

    const {user,setShowLogin,logout,credit,darkMode,toggleDarkMode}=useContext(AppContext)

    const navigate=useNavigate()
  return (
    <div className='flex items-center justify-between py-4 flex-wrap gap-y-2'>
      <Link to='/'>
      <img src={assets.logo} alt=""  className='w-28 sm:w-32 lg:w-40'/>
      </Link>

      {user && (
        <div className='hidden md:flex items-center gap-5 text-sm text-gray-600 dark:text-gray-300'>
            <Link to='/gallery' className='hover:text-blue-600 dark:hover:text-blue-400'>Gallery</Link>
            <Link to='/history' className='hover:text-blue-600 dark:hover:text-blue-400'>History</Link>
            <Link to='/favorites' className='hover:text-blue-600 dark:hover:text-blue-400'>Favorites</Link>
            <Link to='/profile' className='hover:text-blue-600 dark:hover:text-blue-400'>Dashboard</Link>
        </div>
      )}

      <div className='flex items-center gap-2 sm:gap-3'>

        <button
          onClick={toggleDarkMode}
          title='Toggle dark mode'
          className='w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-sm hover:scale-105 transition-transform'
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {user?
         <div className='flex items-center gap-2 sm:gap-3'>
            <button onClick={()=>navigate('/buy')} className='flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
                <img className='w-5' src={assets.credit_star} alt="" />
                <p className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-200'>Credits left: {credit}</p>
            </button>
            <p className='text-gray-600 dark:text-gray-300 mx-sm:hidden pl-4'>Hi, {user.name}</p>
            <div className='relative group'>
             <img src={assets.profile_icon} className='w-10 drop-shadow' alt="" />
             <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12 '>
                <ul className='list-none m-0 p-2 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-md border dark:border-gray-700 text-sm min-w-[140px]'>
                    <li onClick={()=>navigate('/profile')} className='py-1.5 px-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 md:hidden'>Dashboard</li>
                    <li onClick={()=>navigate('/history')} className='py-1.5 px-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 md:hidden'>History</li>
                    <li onClick={()=>navigate('/favorites')} className='py-1.5 px-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 md:hidden'>Favorites</li>
                    <li onClick={()=>navigate('/gallery')} className='py-1.5 px-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 md:hidden'>Gallery</li>
                    <li onClick={logout} className='py-1.5 px-2 cursor-pointer pr-10'>Logout</li>
                </ul>

             </div>
            </div>
           

        </div>:
         <div className='flex items-center gap-2 sm:gap-5'>
            <p onClick={()=>navigate('/buy')}className='cursor-pointer'>Pricing</p>
            <p onClick={()=>navigate('/gallery')} className='cursor-pointer'>Gallery</p>
            <button className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full' onClick={()=>setShowLogin(true)}> Login</button>
        </div>
        }
       
       
      </div>
    </div>
  )
}

export default Navbar
