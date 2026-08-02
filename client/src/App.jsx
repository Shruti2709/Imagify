import React from 'react'

import {Routes, Route} from 'react-router-dom'
import{ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import History from './pages/History'
import Favorites from './pages/Favorites'
import Gallery from './pages/Gallery'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import { useContext } from 'react'

const App = () => {

  const{showLogin}=useContext(AppContext)
  return (
   <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 dark:text-gray-100'>
    <ToastContainer position='bottom-right'/>
    <Navbar/>
    {showLogin && <Login/>}
      <Routes>
        <Route path='/' element={ <Home/>}/>
        <Route path='/result' element={ <Result/>}/>
        <Route path='/buy' element={ <BuyCredit/>}/>
        <Route path='/history' element={ <History/>}/>
        <Route path='/favorites' element={ <Favorites/>}/>
        <Route path='/gallery' element={ <Gallery/>}/>
        <Route path='/profile' element={ <Profile/>}/>
        <Route path='/admin' element={ <Admin/>}/>

      </Routes>
      <Footer/>
      
    </div>
  )
}

export default App
