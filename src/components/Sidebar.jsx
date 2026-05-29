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

// Recebendo os estados de controle vindos do Layout
export default function Sidebar({ isExpanded, setIsExpanded }) {
  const { user, logout } = useAuth()
  const { pathname }     = useLocation()

  const visible = links.filter(l => l.roles.includes(user?.role))

  return (
    <aside 
      className={`min-h-screen bg-[#111118] border-r border-[#1e1e2e] flex flex-col fixed left-0 top-0 z-40 transition-all duration-300
        ${isExpanded ? 'w-50' : 'w-20'}`} 
    >
      {/* Logo + Botão Toggle */}
      <div className="px-5 py-5 border-b border-[#1e1e2e] flex items-center justify-between min-h-[73px]">
        {isExpanded && (
          <div className="transition-opacity duration-200">
            <h1 className="text-xl font-bold text-white tracking-tight">Apollo</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Helpdesk</p>
          </div>
        )}
        
        {/* Botão de Encolher/Abrir */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1.5 rounded-lg bg-[#1a1a2e] text-zinc-500 hover:text-white transition-colors ${!isExpanded ? 'mx-auto' : ''}`}
        >
          {isExpanded ? '◀' : '☰'}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-x-hidden">
        {visible.map(link => {
          const active = pathname === link.to
          return (
            <Link 
              key={link.to} 
              to={link.to}
              title={!isExpanded ? link.label : ''} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative group
                ${active
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1a1a2e]'
                } ${!isExpanded ? 'justify-center px-0' : ''}`}
            >
              <span className="text-lg flex-shrink-0">{link.icon}</span>
              
              {/* Texto do Link: Esconde suavemente se não estiver expandido */}
              <span className={`transition-all duration-200 whitespace-nowrap
                ${isExpanded ? 'opacity-100 w-auto visible' : 'opacity-0 w-0 invisible'}`}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-[#1e1e2e] overflow-hidden">
        <div className="flex items-center gap-3 justify-center">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          
          {/* Dados do usuário e botão Sair: somem ao encolher */}
          {isExpanded && (
            <div className="flex-1 min-w-0 flex items-center justify-between transition-opacity duration-200">
              <div className="min-w-0 pr-2">
                <p className="text-sm text-white font-medium truncate">{user?.username}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.role}</p>
              </div>
              <button 
                onClick={() => { logout(); window.location.href = '/login' }}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex-shrink-0"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}