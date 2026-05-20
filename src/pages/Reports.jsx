import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import api from '../api/axios'

export default function Reports() {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    api.get('/tickets/').then(r => setTickets(r.data))
  }, [])

  const total    = tickets.length
  const byStatus = {
    open:        tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    waiting:     tickets.filter(t => t.status === 'waiting').length,
    resolved:    tickets.filter(t => t.status === 'resolved').length,
    closed:      tickets.filter(t => t.status === 'closed').length,
  }
  const byPriority = {
    low:    tickets.filter(t => t.priority === 'low').length,
    medium: tickets.filter(t => t.priority === 'medium').length,
    high:   tickets.filter(t => t.priority === 'high').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
  }

  const card = (label, value, color) => (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
      <p className="text-xs text-zinc-500 mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )

  return (
    <Layout>
      <Navbar />
      <div className="px-8 py-10">
        <h2 className="text-2xl font-semibold text-white mb-2">Relatórios</h2>
        <p className="text-zinc-500 text-sm mb-8">Visão geral dos chamados</p>

        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Por status</p>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {card('Total',        total,               'text-white')}
          {card('Abertos',      byStatus.open,       'text-indigo-400')}
          {card('Em andamento', byStatus.in_progress,'text-amber-400')}
          {card('Resolvidos',   byStatus.resolved,   'text-emerald-400')}
          {card('Fechados',     byStatus.closed,     'text-zinc-400')}
        </div>

        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Por prioridade</p>
        <div className="grid grid-cols-4 gap-4">
          {card('Baixa',   byPriority.low,    'text-zinc-400')}
          {card('Média',   byPriority.medium, 'text-blue-400')}
          {card('Alta',    byPriority.high,   'text-amber-400')}
          {card('Urgente', byPriority.urgent, 'text-red-400')}
        </div>
      </div>
    </Layout>
  )
}