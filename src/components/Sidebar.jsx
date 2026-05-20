import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/',            label: 'Dashboard',    icon: '⊞', roles: ['admin', 'agent', 'user'] },
  { to: '/tickets',     label: 'Tickets',      icon: '🎫', roles: ['admin', 'agent', 'user'] },
  { to: '/users',       label: 'Usuários',     icon: '👥', roles: ['admin'] },
  { to: '/reports',     label: 'Relatórios',   icon: '📊', roles: ['admin', 'agent'] },
  { to: '/profile',     label: 'Perfil',       icon: '👤', roles: ['admin', 'agent', 'user'] },
  { to: '/settings',    label: 'Configurações', icon: '⚙️', roles: ['admin'] },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { pathname }     = useLocation()

  const visible = links.filter(l => l.roles.includes(user?.role))

  return (
    <aside className="w-60 min-h-screen bg-[#111118] border-r border-[#1e1e2e] flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-[#1e1e2e]">
        <h1 className="text-xl font-bold text-white tracking-tight">Apollo</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Helpdesk</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visible.map(link => {
          const active = pathname === link.to
          return (
            <Link key={link.to} to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${active
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1a1a2e]'
                }`}>
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-[#1e1e2e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user?.username}</p>
            <p className="text-xs text-zinc-500">{user?.role}</p>
          </div>
          <button onClick={() => { logout(); window.location.href = '/login' }}
            className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
            Sair
          </button>
        </div>
      </div>
    </aside>
  )
}