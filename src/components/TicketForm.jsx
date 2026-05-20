import { useState } from 'react'
import api from '../api/axios'

export default function TicketForm({ onClose, onCreated }) {
  const [form, setForm]     = useState({ title: '', description: '', priority: 'medium' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await api.post('/tickets/', form)
      onCreated(r.data)
      onClose()
    } catch {
      setError('Erro ao abrir chamado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-lg font-semibold text-white mb-6">Abrir novo chamado</h2>

        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Título</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="Descreva o problema resumidamente"
              required
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Descrição</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Detalhe o problema..."
              required
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Prioridade</label>
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-[#2a2a3e] text-zinc-400 hover:text-white rounded-lg py-2.5 text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50">
              {loading ? 'Abrindo...' : 'Abrir chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}