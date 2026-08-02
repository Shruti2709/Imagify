import { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext()

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const [credit, setCredit] = useState(false)

  // Multiple AI model support: which model the generator should use
  const [selectedModel, setSelectedModel] = useState('clipdrop')
  const [availableModels, setAvailableModels] = useState([])

  // Dark mode, persisted across sessions
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  const loadCreditsData = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/credits', {
        headers: { token }
      })

      if (data.success) {
        setCredit(data.credits)
        setUser(data.user)
        if (data.dailyBonusApplied) {
          toast.success(`+${data.dailyBonusAmount} free daily credits added!`)
        }
      }


    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const loadAvailableModels = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/image/models')
      if (data.success) {
        setAvailableModels(data.models)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/image/generate-image', {
        prompt, model: selectedModel
      }, {
        headers: { token }
      })
      if (data.success) {
        loadCreditsData()
        return { resultImage: data.resultImage, imageId: data.imageId }
      } else {
        toast.error(data.message)
        loadCreditsData()
        if (data.creditBalance === 0) {
          navigate('/buy')
        }
      }
    } catch (error) {

      toast.error(error.message)

    }


  }

  // --- History / Favorites / Gallery -------------------------------------

  const getHistory = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/image/history', { headers: { token } })
      if (data.success) return data.images
      toast.error(data.message)
      return []
    } catch (error) {
      toast.error(error.message)
      return []
    }
  }

  const getFavorites = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/image/favorites', { headers: { token } })
      if (data.success) return data.images
      toast.error(data.message)
      return []
    } catch (error) {
      toast.error(error.message)
      return []
    }
  }

  const getGallery = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/image/gallery')
      if (data.success) return data.images
      return []
    } catch (error) {
      toast.error(error.message)
      return []
    }
  }

  const getTemplates = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/image/templates')
      if (data.success) return data.templates
      return []
    } catch (error) {
      console.log(error)
      return []
    }
  }

  const toggleFavorite = async (imageId) => {
    try {
      const { data } = await axios.patch(backendUrl + `/api/image/${imageId}/favorite`, {}, { headers: { token } })
      if (data.success) return data.isFavorite
    } catch (error) {
      toast.error(error.message)
    }
  }

  const togglePublic = async (imageId) => {
    try {
      const { data } = await axios.patch(backendUrl + `/api/image/${imageId}/public`, {}, { headers: { token } })
      if (data.success) return data.isPublic
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getProfile = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/profile', { headers: { token } })
      if (data.success) return data.profile
      return null
    } catch (error) {
      toast.error(error.message)
      return null
    }
  }

  const getAdminAnalytics = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/analytics', { headers: { token } })
      if (data.success) return data.analytics
      toast.error(data.message)
      return null
    } catch (error) {
      toast.error(error.message)
      return null
    }
  }

  const logout = () => {
    localStorage
      .removeItem('token')
    setToken('')
    setUser(null)
  }

  useEffect(() => {
    if (token) {
      loadCreditsData()
    }

  }, [token])

  useEffect(() => {
    loadAvailableModels()
  }, [])

  const value = {
    user, setUser,
    showLogin, setShowLogin, backendUrl, token, setToken, credit, setCredit, loadCreditsData, logout, generateImage,
    selectedModel, setSelectedModel, availableModels,
    darkMode, toggleDarkMode,
    getHistory, getFavorites, getGallery, getTemplates, toggleFavorite, togglePublic, getProfile, getAdminAnalytics
  }
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
export default AppContextProvider;
