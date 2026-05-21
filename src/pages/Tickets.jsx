import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TicketForm from '../components/TicketForm'
import Layout from '../components/Layout'
import api from '../api/axios'

const STATUS_LABELS = { open: 'Aberto', in_progress: 'Em andamento', waiting: 'Aguardando', resolved: 'Resolvido', closed: 'Fechado' }
const STATUS_COLORS = {
  open:        'bg-indigo-500/10 text-indigo-400',
  in_progress: 'bg-amber-500/10  text-amber-400',
  waiting:     'bg-zinc-500/10   text-zinc-400',
  resolved:    'bg-emerald-500/10 text-emerald-400',
  closed:      'bg-red-500/10    text-red-400',
}
const PRIORITY_LABELS = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' }
const PRIORITY_COLORS = { low: 'text-zinc-400', medium: 'text-blue-400', high: 'text-amber-400', urgent: 'text-red-400' }

export default function Tickets() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [tickets, setTickets]   = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter]     = useState('all')

  useEffect(() => {
    api.get('/tickets/').then(r => setTickets(r.data))
  }, [])

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)

  return (
    <Layout>
      <Navbar />

      {showForm && (
        <TicketForm
          onClose={() => setShowForm(false)}
          onCreated={t => setTickets(prev => [t, ...prev])}
        />
      )}

      <div className="px-8 py-8 text-white w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Tickets</h2>
            <p className="text-zinc-500 text-sm mt-1">{tickets.length} chamados encontrados</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            + Abrir chamado
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all',         label: 'Todos'         },
            { key: 'open',        label: 'Abertos'       },
            { key: 'in_progress', label: 'Em andamento'  },
            { key: 'waiting',     label: 'Aguardando'    },
            { key: 'resolved',    label: 'Resolvidos'    },
            { key: 'closed',      label: 'Fechados'      },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium
                ${filter === f.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#1a1a2e] text-zinc-400 hover:text-white'}`}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-zinc-500 text-xs">
                <th className="text-left px-6 py-3">#</th>
                <th className="text-left px-6 py-3">Título</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Prioridade</th>
                <th className="text-left px-6 py-3">Criado por</th>
                <th className="text-left px-6 py-3">Atribuído a</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center text-zinc-600 py-10">Nenhum chamado encontrado.</td></tr>
              )}
              {filtered.map(t => (
                <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)}
                  className="border-b border-[#1e1e2e] hover:bg-[#1a1a2e] transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-zinc-500">#{t.id}</td>
                  <td className="px-6 py-4 font-medium">{t.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${STATUS_COLORS[t.status]}`}>
                      {STATUS_LABELS[t.status]}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-xs font-medium ${PRIORITY_COLORS[t.priority]}`}>
                    {PRIORITY_LABELS[t.priority]}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{t.created_by_username}</td>
                  <td className="px-6 py-4 text-zinc-400">{t.assigned_to_username || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}