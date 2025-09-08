import React from 'react'
import { useGlobalcontext } from './ContextApi/MyContext'
import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';




const App = () => {
  const { mail, setMail } = useGlobalcontext()

  return (
    <>
      <Toaster />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />

      </Routes>
    </>
  )
}

export default App