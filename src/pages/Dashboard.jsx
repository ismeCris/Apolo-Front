import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TicketForm from '../components/TicketForm'
import api from '../api/axios'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets]   = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    api.get('/tickets/').then(r => setTickets(r.data))
  }, [])

  const counts = {
    open:        tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved:    tickets.filter(t => t.status === 'resolved').length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      {showForm && (
        <TicketForm
          onClose={() => setShowForm(false)}
          onCreated={t => setTickets(prev => [t, ...prev])}
        />
      )}

      <main className="px-8 py-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Olá, {user?.username} 👋</h2>
            <p className="text-zinc-500 text-sm mt-1">
              {user?.role === 'user' ? 'Acompanhe seus chamados' : 'Painel de atendimento'}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            + Abrir chamado
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Abertos',       value: counts.open,        color: 'text-indigo-400'  },
            { label: 'Em andamento',  value: counts.in_progress, color: 'text-amber-400'   },
            { label: 'Resolvidos',    value: counts.resolved,    color: 'text-emerald-400' },
          ].map(card => (
            <div key={card.label} className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
              <p className="text-xs text-zinc-500 mb-2">{card.label}</p>
              <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
            <h3 className="text-sm font-medium">Chamados recentes</h3>
            <button onClick={() => navigate('/tickets')} className="text-xs text-indigo-400 hover:text-indigo-300">
              Ver todos →
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-zinc-500 text-xs">
                <th className="text-left px-6 py-3">#</th>
                <th className="text-left px-6 py-3">Título</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {tickets.slice(0, 5).map(t => (
                <tr key={t.id}
                  onClick={() => navigate(`/tickets/${t.id}`)}
                  className="border-b border-[#1e1e2e] hover:bg-[#1a1a2e] transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-zinc-500">#{t.id}</td>
                  <td className="px-6 py-4 font-medium">{t.title}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={t.priority} />
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan={4} className="text-center text-zinc-600 py-10">Nenhum chamado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    open:        'bg-indigo-500/10 text-indigo-400',
    in_progress: 'bg-amber-500/10  text-amber-400',
    waiting:     'bg-zinc-500/10   text-zinc-400',
    resolved:    'bg-emerald-500/10 text-emerald-400',
    closed:      'bg-red-500/10    text-red-400',
  }
  const labels = {
    open: 'Aberto', in_progress: 'Em andamento',
    waiting: 'Aguardando', resolved: 'Resolvido', closed: 'Fechado'
  }
  return <span className={`px-2 py-1 rounded-md text-xs font-medium ${map[status]}`}>{labels[status]}</span>
}

function PriorityBadge({ priority }) {
  const map = {
    low: 'text-zinc-400', medium: 'text-blue-400',
    high: 'text-amber-400', urgent: 'text-red-400'
  }
  const labels = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' }
  return <span className={`text-xs font-medium ${map[priority]}`}>{labels[priority]}</span>
}