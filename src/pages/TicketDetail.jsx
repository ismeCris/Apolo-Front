import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const STATUS_LABELS = {
  open: 'Aberto', in_progress: 'Em andamento',
  waiting: 'Aguardando', resolved: 'Resolvido', closed: 'Fechado'
}

const STATUS_COLORS = {
  open:        'bg-indigo-500/10 text-indigo-400',
  in_progress: 'bg-amber-500/10  text-amber-400',
  waiting:     'bg-zinc-500/10   text-zinc-400',
  resolved:    'bg-emerald-500/10 text-emerald-400',
  closed:      'bg-red-500/10    text-red-400',
}

export default function TicketDetail() {
  const { id }       = useParams()
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const [ticket, setTicket]     = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent]   = useState('')
  const [sending, setSending]   = useState(false)

  useEffect(() => {
    api.get(`/tickets/${id}/`).then(r => setTicket(r.data))
    api.get(`/tickets/${id}/comments/`).then(r => setComments(r.data))
  }, [id])

  const sendComment = async () => {
    if (!content.trim()) return
    setSending(true)
    const r = await api.post(`/tickets/${id}/comments/`, { content })
    setComments(prev => [...prev, r.data])
    setContent('')
    setSending(false)
  }

  const assign = async () => {
    const r = await api.patch(`/tickets/${id}/assign/`)
    setTicket(r.data)
  }

  const changeStatus = async (status) => {
    const r = await api.patch(`/tickets/${id}/status/`, { status })
    setTicket(r.data)
  }

  if (!ticket) return <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">Carregando...</div>

  const isAgent = user?.role === 'agent' || user?.role === 'admin'
  const isOwner = ticket.created_by === user?.id

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />
      <main className="px-8 py-10 max-w-4xl mx-auto">

        {/* Header */}
        <button onClick={() => navigate('/tickets')} className="text-xs text-zinc-500 hover:text-white mb-6 block">← Voltar</button>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">#{ticket.id}</p>
              <h2 className="text-xl font-semibold">{ticket.title}</h2>
              <p className="text-sm text-zinc-400 mt-1">Aberto por <span className="text-white">{ticket.created_by_username}</span></p>
            </div>
            <span className={`px-3 py-1 rounded-md text-xs font-medium ${STATUS_COLORS[ticket.status]}`}>
              {STATUS_LABELS[ticket.status]}
            </span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">{ticket.description}</p>

          {/* Ações do atendente */}
          {isAgent && (
            <div className="mt-6 pt-6 border-t border-[#1e1e2e] flex flex-wrap gap-3">
              {!ticket.assigned_to && (
                <button onClick={assign}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg transition-colors">
                  Assumir chamado
                </button>
              )}
              {ticket.assigned_to && (
                <p className="text-xs text-zinc-500 self-center">Atribuído a <span className="text-white">{ticket.assigned_to_username}</span></p>
              )}
              <select
                value={ticket.status}
                onChange={e => changeStatus(e.target.value)}
                className="bg-[#1a1a2e] border border-[#2a2a3e] text-white text-xs rounded-lg px-3 py-2 focus:outline-none">
                <option value="open">Aberto</option>
                <option value="in_progress">Em andamento</option>
                <option value="waiting">Aguardando</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
          )}

          {/* Usuário pode fechar o próprio chamado */}
          {!isAgent && isOwner && ticket.status !== 'closed' && (
            <div className="mt-6 pt-6 border-t border-[#1e1e2e]">
              <button onClick={() => changeStatus('closed')}
                className="border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs px-4 py-2 rounded-lg transition-colors">
                Fechar chamado
              </button>
            </div>
          )}
        </div>

        {/* Comentários */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
          <h3 className="text-sm font-medium mb-6">Comentários</h3>

          <div className="space-y-4 mb-6">
            {comments.length === 0 && (
              <p className="text-zinc-600 text-sm">Nenhum comentário ainda.</p>
            )}
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {c.author_username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{c.author_username}</span>
                    <span className="text-xs text-zinc-500">{c.author_role}</span>
                    <span className="text-xs text-zinc-600">{new Date(c.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-sm text-zinc-300">{c.content}</p>
                </div>
              </div>
            ))}
          </div>

          {ticket.status !== 'closed' && (
            <div className="flex gap-3">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={2}
                placeholder="Escreva um comentário..."
                className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button
                onClick={sendComment}
                disabled={sending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-5 rounded-lg transition-colors disabled:opacity-50">
                Enviar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}