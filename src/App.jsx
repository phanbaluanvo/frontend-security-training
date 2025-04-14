import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPages from '@/pages/admin/AdminPages';
import LoginPage from '@/pages/Login/LoginPage';
import UserPages from '@/pages/main/UserPages';
import SignUpPage from './pages/Login/SignUpPage';
import LandingPage from './pages/main/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path="/admin/*" element={<AdminPages />} />
        <Route path='/*' element={<UserPages />} />
      </Routes>
    </Router>
  )
}

export default App
