import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const STATUS_COLORS = {
  open:        'bg-indigo-500/10 text-indigo-400',
  in_progress: 'bg-amber-500/10  text-amber-400',
  waiting:     'bg-zinc-500/10   text-zinc-400',
  resolved:    'bg-emerald-500/10 text-emerald-400',
  closed:      'bg-red-500/10    text-red-400',
}

const PRIORITY_COLORS = {
  low:    'text-zinc-400',
  medium: 'text-blue-400',
  high:   'text-amber-400',
  urgent: 'text-red-400',
}

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/tickets/').then(r => setTickets(r.data))
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-[#1e1e2e] px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight cursor-pointer" onClick={() => navigate('/')}>Apollo</h1>
      </nav>

      <main className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Tickets</h2>
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
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-zinc-600 py-10">Nenhum ticket encontrado.</td>
                </tr>
              )}
              {tickets.map(t => (
                <tr key={t.id} className="border-b border-[#1e1e2e] hover:bg-[#1a1a2e] transition-colors">
                  <td className="px-6 py-4 text-zinc-500">#{t.id}</td>
                  <td className="px-6 py-4 font-medium">{t.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${STATUS_COLORS[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-medium ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</td>
                  <td className="px-6 py-4 text-zinc-400">{t.created_by_username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}