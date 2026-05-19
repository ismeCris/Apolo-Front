import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handle = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-[#1e1e2e] px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Apollo</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{user?.username}</span>
          <button onClick={handle} className="text-xs text-zinc-500 hover:text-white transition-colors">
            Sair
          </button>
        </div>
      </nav>

      <main className="px-8 py-10">
        <h2 className="text-2xl font-semibold mb-2">Olá, {user?.username} 👋</h2>
        <p className="text-zinc-500 text-sm mb-8">Bem-vindo ao Apollo Helpdesk.</p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Tickets abertos',    value: '0', color: 'text-indigo-400' },
            { label: 'Em andamento',        value: '0', color: 'text-amber-400'  },
            { label: 'Resolvidos',          value: '0', color: 'text-emerald-400'},
          ].map(card => (
            <div key={card.label} className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
              <p className="text-xs text-zinc-500 mb-2">{card.label}</p>
              <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate('/tickets')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Ver tickets
          </button>
        </div>
      </main>
    </div>
  )
}