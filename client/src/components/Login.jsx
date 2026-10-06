import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react"
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Login')

  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === 'Login') {
        const { data } = await axios.post(backendUrl + '/api/user/login', {
          email, password
        })

        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', {
          name, email, password
        })

        if (data.success) {
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token', data.token)
          setShowLogin(false)
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Reset') {
        const { data } = await axios.post(backendUrl + '/api/user/reset-password', {
          email, newPassword: password
        })

        if (data.success) {
          toast.success(data.message || 'Password reset successfully! Please login.')
          setState('Login')
          setPassword('')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      if (errorMsg === 'Network Error') {
        toast.error(`Network Error: Unable to connect to backend server. Please verify backend is running.`)
      } else {
        toast.error(errorMsg)
      }
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        action=""
        className='relative bg-white p-10 rounded-xl text-slate-500 w-full max-w-sm mx-4'
      >
        <h1 className='text-2xl font-medium text-neutral-700 text-center'>
          {state === 'Login' ? 'Login' : state === 'Sign Up' ? 'Create Account' : 'Reset Password'}
        </h1>
        <p className='text-sm text-center mt-1'>
          {state === 'Login'
            ? 'Welcome back! Please sign in to continue'
            : state === 'Sign Up'
              ? 'Create an account to start generating AI images'
              : 'Enter your email and new password to reset'}
        </p>

        {state === 'Sign Up' && (
          <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
            <img src={assets.profile_icon} alt="" width={20} />
            <input
              onChange={e => setName(e.target.value)}
              value={name}
              type="text"
              placeholder='Full Name'
              required
              className='outline-none text-sm w-full'
            />
          </div>
        )}

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.email_icon} alt="" width={20} />
          <input
            onChange={e => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder='Email id'
            required
            className='outline-none text-sm w-full'
          />
        </div>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.lock_icon} alt="" width={20} />
          <input
            onChange={e => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder={state === 'Reset' ? 'New Password' : 'Password'}
            required
            className='outline-none text-sm w-full'
          />
        </div>

        {state === 'Login' && (
          <p
            className='text-sm text-blue-600 my-4 cursor-pointer hover:underline'
            onClick={() => { setState('Reset'); setPassword(''); }}
          >
            Forgot password?
          </p>
        )}

        <button className='bg-blue-600 w-full text-white py-2 rounded-full mt-4 hover:bg-blue-700 transition-colors'>
          {state === 'Login' ? 'Login' : state === 'Sign Up' ? 'Create Account' : 'Reset Password'}
        </button>

        {state === 'Login' && (
          <p className='mt-5 text-center text-sm'>
            Don't have an account? <span className='text-blue-600 cursor-pointer hover:underline font-medium' onClick={() => { setState('Sign Up'); setPassword(''); }}>Sign Up</span>
          </p>
        )}

        {state === 'Sign Up' && (
          <p className='mt-5 text-center text-sm'>
            Already have an account? <span className='text-blue-600 cursor-pointer hover:underline font-medium' onClick={() => { setState('Login'); setPassword(''); }}>Login</span>
          </p>
        )}

        {state === 'Reset' && (
          <p className='mt-5 text-center text-sm'>
            Remembered your password? <span className='text-blue-600 cursor-pointer hover:underline font-medium' onClick={() => { setState('Login'); setPassword(''); }}>Login</span>
          </p>
        )}

        <img
          src={assets.cross_icon}
          alt=""
          className='absolute top-5 right-5 cursor-pointer'
          onClick={() => setShowLogin(false)}
        />

      </motion.form>
    </div>
  )
}

export default Login
