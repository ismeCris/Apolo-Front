import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login       from '../pages/Login'
import Dashboard   from '../pages/Dashboard'
import Tickets     from '../pages/Tickets'
import TicketDetail from '../pages/TicketDetail'
import Users from '../pages/Users'
import Profile  from '../pages/Profile'
import Reports  from '../pages/Reports'
import Settings from '../pages/Settings'


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
        <Route path="/users"         element={<Private><Users /></Private>} />
        <Route path="/tickets"       element={<Private><Tickets /></Private>} />
        <Route path="/tickets/:id"   element={<Private><TicketDetail /></Private>} />
        <Route path="/profile"       element={<Private><Profile /></Private>} />
        <Route path="/reports"       element={<Private><Reports /></Private>} />
        <Route path="/settings"      element={<Private><Settings /></Private>} />
                
      </Routes>
    </BrowserRouter>
  )
}