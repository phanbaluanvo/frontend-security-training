import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPages from '@/pages/admin/AdminPages';
import LoginPage from '@/pages/Login/LoginPage';

import UserPages from '@/pages/user/UserPages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPages />} />
        <Route path='/*' element={<UserPages />} />
      </Routes>
    </Router>
  )
}

export default App
