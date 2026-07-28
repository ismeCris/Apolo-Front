import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const TICKET_TYPES = [
  { value: 'suporte_geral',  label: 'Suporte Geral' },
  { value: 'liberar_tela',   label: 'Liberar Tela' },
  { value: 'reset_senha',    label: 'Reset de Senha' },
  { value: 'acesso_sistema', label: 'Acesso a Sistema' },
  { value: 'outro',          label: 'Outro' },
]

const inputClass =
  'w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm ' +
  'placeholder:text-zinc-600 transition-colors ' +
  'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'

const labelClass = 'text-[11px] font-semibold uppercase tracking-wide text-zinc-500 mb-1.5 block'

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wide whitespace-nowrap">
        {children}
      </h3>
      <div className="h-px bg-[#1e1e2e] flex-1" />
    </div>
  )
}

export default function TicketForm({ onClose, onCreated }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    ticket_type: 'suporte_geral',
    customer_sector: '',
    company: '',
    branch: '',
    due_date: '',
    deadline_justification: '',
    screen_name: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      const payload = { ...form }
      if (payload.ticket_type !== 'liberar_tela') delete payload.screen_name
      if (!payload.due_date) {
        delete payload.due_date
        delete payload.deadline_justification
      }

      const r = await api.post('/tickets/', payload)
      onCreated(r.data)
      onClose()
    } catch (err) {
      if (err.response?.data && typeof err.response.data === 'object') {
        setFieldErrors(err.response.data)
      }
      setError('Erro ao abrir chamado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header fixo */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#1e1e2e] flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Abrir novo chamado</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Preencha as informações abaixo</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-[#1a1a2e] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Corpo com scroll */}
        <form id="ticket-form" onSubmit={handle} className="overflow-y-auto px-8 py-6 space-y-5">

          {/* Aberto por / Data — automáticos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Aberto por</label>
              <input
                value={user?.username || ''}
                disabled
                className="w-full bg-[#0c0c14] border border-[#1e1e2e] text-zinc-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className={labelClass}>Data/hora</label>
              <input
                value={new Date().toLocaleString('pt-BR')}
                disabled
                className="w-full bg-[#0c0c14] border border-[#1e1e2e] text-zinc-500 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <SectionTitle>Cliente</SectionTitle>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Empresa</label>
              <input
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
                placeholder="Nome da empresa"
                className={inputClass}
                required
              />
              {fieldErrors.company && <p className="text-red-400 text-xs mt-1">{fieldErrors.company}</p>}
            </div>
            <div>
              <label className={labelClass}>Filial</label>
              <input
                value={form.branch}
                onChange={e => setForm({ ...form, branch: e.target.value })}
                placeholder="Ex: Matriz, Filial 02..."
                className={inputClass}
                required
              />
              {fieldErrors.branch && <p className="text-red-400 text-xs mt-1">{fieldErrors.branch}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Setor do cliente</label>
            <input
              value={form.customer_sector}
              onChange={e => setForm({ ...form, customer_sector: e.target.value })}
              placeholder="Ex: Financeiro, TI, RH..."
              className={inputClass}
            />
          </div>

          <SectionTitle>Detalhes do chamado</SectionTitle>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipo do chamado / Assunto</label>
              <select
                value={form.ticket_type}
                onChange={e => setForm({ ...form, ticket_type: e.target.value })}
                className={inputClass + ' appearance-none bg-[url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%23888" stroke-width="1.5" d="M5 8l5 5 5-5"/></svg>\')] bg-no-repeat bg-[right_1rem_center]'}
              >
                {TICKET_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Prioridade</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className={inputClass + ' appearance-none bg-[url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%23888" stroke-width="1.5" d="M5 8l5 5 5-5"/></svg>\')] bg-no-repeat bg-[right_1rem_center]'}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          {/* Campo condicional */}
          {form.ticket_type === 'liberar_tela' && (
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-lg p-4">
              <label className={labelClass}>Tela a ser liberada</label>
              <input
                value={form.screen_name}
                onChange={e => setForm({ ...form, screen_name: e.target.value })}
                placeholder="Ex: Tela de Faturamento"
                className={inputClass}
                required
              />
              {fieldErrors.screen_name && <p className="text-red-400 text-xs mt-1">{fieldErrors.screen_name}</p>}
            </div>
          )}

          <div>
            <label className={labelClass}>Título</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Descreva o problema resumidamente"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="Detalhe o problema..."
              className={inputClass + ' resize-none'}
              required
            />
          </div>

          <SectionTitle>Prazo</SectionTitle>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Previsão de conclusão</label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
                className={inputClass + ' [color-scheme:dark]'}
              />
            </div>
          </div>

          {form.due_date && (
            <div>
              <label className={labelClass}>Justifique o prazo</label>
              <textarea
                value={form.deadline_justification}
                onChange={e => setForm({ ...form, deadline_justification: e.target.value })}
                rows={2}
                placeholder="Por que esse chamado precisa ficar pronto até essa data?"
                className={inputClass + ' resize-none'}
                required
              />
              {fieldErrors.deadline_justification && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.deadline_justification}</p>
              )}
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </form>

        {/* Footer fixo */}
        <div className="flex gap-3 px-8 py-5 border-t border-[#1e1e2e] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-[#2a2a3e] text-zinc-400 hover:text-white hover:border-[#3a3a4e] rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="ticket-form"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Abrindo...' : 'Abrir chamado'}
          </button>
        </div>
      </div>
    </div>
  )
}