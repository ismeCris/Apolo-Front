import { Link, useLocation } from 'react-router-dom'
import { 
  Menu, 
  ChevronLeft, 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Rocket,
  BarChart3, 
  User, 
  Settings,
  Plus,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/',            label: 'Início',         icon: LayoutDashboard, roles: ['admin', 'agent', 'user'] },
  { to: '/tickets',     label: 'Chamados',       icon: Ticket,          roles: ['admin', 'agent', 'user'] },
  { to: '/users',       label: 'Usuários',      icon: Users,           roles: ['admin'] },
  { to: '/reports',     label: 'Relatórios',    icon: BarChart3,       roles: ['admin', 'agent'] },
  { to: '/profile',     label: 'Perfil',        icon: User,            roles: ['admin', 'agent', 'user'] },
  { to: '/settings',    label: 'Configurações', icon: Settings,        roles: ['admin'] },
]

export default function Sidebar({ isExpanded, setIsExpanded }) {
  const { user, logout } = useAuth()
  const { pathname }     = useLocation()

  const visible = links.filter(l => l.roles.includes(user?.role))

  return (
    <aside 
      className={`min-h-screen bg-[#1e2230] border-r border-[#2d3248]/30 flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out font-sans
        ${isExpanded ? 'w-52' : 'w-12'}`} 
    >
   <div className="px-4 flex items-center h-[80px] shrink-0 border-b border-[#2d3248]/20 justify-between relative">
  
        {/* ÁREA DO LOGO */}
        <div className="flex items-center justify-center w-full h-full transition-all duration-200">
          {isExpanded ? (

            <div className="flex items-center gap-2 pl-1 transition-opacity duration-200">
              <h1 className="text-lg font-bold text-[#2d3248] tracking-wider uppercase">Apollo</h1>
            </div>
          ) : (
            // Quando recolhido: Mostra apenas o foguete perfeitamente centralizado
            <div className="flex items-center justify-center w-full transition-opacity duration-200">
              <img 
                src="/image.png" 
                alt="Logo Apollo" 
                className="w-12 h-12 object-contain" 
              />
            </div>
          )}
        </div>
        
        {/* BOTÃO FLUTUANTE - FIXO PARA FORA NA BORDA DIREITA */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute right-0 translate-x-1/2 p-1.5 rounded-full bg-[#282e42] border border-[#373e58] text-zinc-400 hover:text-white transition-all duration-200 shrink-0 z-50 shadow-md"
        >
          <ChevronLeft className={`w-6 h-6 transition-transform duration-200 ${!isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
              

      {/* Botão de Destaque "Novo Chamado" - Com paddings internos proporcionais */}
      <div className="px-4 mt-5 mb-3 shrink-0">
        <button 
          className={`w-full bg-[#7c16ff] hover:bg-[#6910e6] text-white font-medium rounded-lg flex items-center justify-center transition-all duration-200
            ${isExpanded ? 'h-10 px-4 gap-2 text-sm' : 'h-10 w-10 mx-auto p-0'}`}
          title="Novo Chamado"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {isExpanded && (
            <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-[13px]">
              Novo Chamado
            </span>
          )}
          {isExpanded && <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />}
        </button>
      </div>

      {/* Nav links - Aumentado o space-y para dar o respiro que faltava */}
      <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto overflow-x-hidden">
        {visible.map(link => {
          const active = pathname === link.to
          const Icon = link.icon

          return (
           <Link 
  key={link.to} 
  to={link.to}
  title={!isExpanded ? link.label : ''} 
  className={`flex items-center h-11 rounded-lg text-[13.5px] font-medium transition-all duration-150 relative group
    ${active
      ? 'bg-[#181b26] text-white border-l-2 border-[#7c16ff]'
      : 'text-[#94a3b8] hover:text-white hover:bg-[#232838]'
    } 
    ${!isExpanded 
      ? 'justify-center px-0 gap-0' // Quando fechada: tudo zerado e centralizado
      : 'px-3 gap-3'                // Quando aberta: espaçamento normal para o texto respirar
    }`}
>
              {/* Ícone Outline centralizado */}
              <Icon className={`w-[18px] h-[18px] shrink-0 stroke-[1.75] ${active ? 'text-[#7c16ff]' : ''}`} />
              
              {/* Texto do Link */}
              <span className={`transition-all duration-200 whitespace-nowrap overflow-hidden flex-1
                ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none'}`}
              >
                {link.label}
              </span>

              {/* Setinha lateral direita discreta (apenas se expandido) */}
              {isExpanded && (
                <ChevronDown className="w-3.5 h-3.5 opacity-20 group-hover:opacity-50 transition-opacity shrink-0" />
              )}

              {/* Tooltip flutuante para quando o menu estiver recolhido */}
              {!isExpanded && (
                <div className="absolute left-full rounded-md px-2.5 py-1.5 ml-4 bg-[#11131c] text-white text-xs font-medium invisible opacity-0 -translate-x-2 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 shadow-xl border border-[#2d3248] whitespace-nowrap pointer-events-none">
                  {link.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé do Usuário */}
      <div className="p-4 border-t border-[#2d3248]/20 bg-[#191c29]/30 shrink-0">
        <div className={`flex items-center gap-3 ${!isExpanded ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-[#2d3248] border border-[#3d4463] flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          
          {isExpanded && (
            <div className="flex-1 min-w-0 flex items-center justify-between transition-opacity duration-200">
              <div className="min-w-0 pr-2">
                <p className="text-xs text-[#e2e8f0] font-semibold truncate">{user?.username || 'Usuário'}</p>
                <p className="text-[11px] text-zinc-500 truncate capitalize">{user?.role || 'Agente'}</p>
              </div>
              <button 
                onClick={() => { logout(); window.location.href = '/login' }}
                className="text-[11px] text-zinc-400 hover:text-red-400 transition-colors shrink-0"
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