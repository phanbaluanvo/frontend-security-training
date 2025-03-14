import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPages from '@/pages/admin/AdminPages';
import LoginPage from '@/pages/Login/LoginPage';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPages />} />
      </Routes>
    </Router>
  )
}

export default App
