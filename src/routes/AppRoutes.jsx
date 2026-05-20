import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login       from '../pages/Login'
import Dashboard   from '../pages/Dashboard'
import Tickets     from '../pages/Tickets'
import TicketDetail from '../pages/TicketDetail'

function Private({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-white p-8">Carregando...</div>
  return user ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"         element={<Login />} />
        <Route path="/"              element={<Private><Dashboard /></Private>} />
        <Route path="/tickets"       element={<Private><Tickets /></Private>} />
        <Route path="/tickets/:id"   element={<Private><TicketDetail /></Private>} />
      </Routes>
    </BrowserRouter>
  )
}