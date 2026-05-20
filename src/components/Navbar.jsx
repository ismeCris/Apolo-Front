import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handle = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-[#1e1e2e] bg-[#111118] px-8 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-white tracking-tight">Apollo</Link>
      <div className="flex items-center gap-6">
        <Link to="/"        className="text-sm text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
        <Link to="/tickets" className="text-sm text-zinc-400 hover:text-white transition-colors">Tickets</Link>
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-[#1e1e2e]">
          <div>
            <p className="text-sm text-white font-medium">{user?.username}</p>
            <p className="text-xs text-zinc-500">{user?.role}</p>
          </div>
          <button onClick={handle} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">Sair</button>
        </div>
      </div>
    </nav>
  )
}