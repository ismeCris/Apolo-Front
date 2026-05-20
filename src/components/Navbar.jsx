import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="w-full border-b border-[#1e1e2e] bg-[#111118] px-8 py-4 flex items-center justify-end">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm text-white font-medium text-right">{user?.username}</p>
          <p className="text-xs text-zinc-500 text-right">{user?.role}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
          {user?.username?.[0]?.toUpperCase()}
        </div>
      </div>
    </nav>
  )
}