import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TicketForm from '../components/TicketForm'
import Layout from '../components/Layout'
import api from '../api/axios'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

export default function Dashboard() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [tickets, setTickets]   = useState([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    api.get('/tickets/').then(r => setTickets(r.data))
  }, [])

  // Cards
  const total    = tickets.length
  const abertos  = tickets.filter(t => t.status === 'open').length
  const fechados = tickets.filter(t => ['closed', 'resolved'].includes(t.status)).length
  const novos    = tickets.filter(t => {
    const d = new Date(t.created_at)
    const hoje = new Date()
    return d.getDate() === hoje.getDate() && d.getMonth() === hoje.getMonth()
  }).length

  // Gráfico 1 — chamados por mês
  const porMes = () => {
    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    const contagem = Array(12).fill(0)
    tickets.forEach(t => {
      const m = new Date(t.created_at).getMonth()
      contagem[m]++
    })
    return meses.map((m, i) => ({ mes: m, chamados: contagem[i] }))
  }

  // Gráfico 2 — chamados por atendente
  const porAtendente = () => {
    const map = {}
    tickets.forEach(t => {
      const nome = t.assigned_to_username || 'Sem atendente'
      map[nome] = (map[nome] || 0) + 1
    })
    return Object.entries(map).map(([nome, total]) => ({ nome, total }))
  }

  const tooltipStyle = {
    backgroundColor: '#111118',
    border: '1px solid #1e1e2e',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '12px',
  }

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

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Olá, {user?.username} 👋</h2>
            <p className="text-zinc-500 text-sm mt-1">
              {user?.role === 'user' ? 'Acompanhe seus chamados' : 'Painel de atendimento'}
            </p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            + Abrir chamado
          </button>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-4 gap-4">

          {/* Gráfico área — chamados por mês (ocupa 3 colunas) */}
          <div className="col-span-3 bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
            <h3 className="text-sm font-medium mb-1">Chamados por mês</h3>
            <p className="text-xs text-zinc-500 mb-6">Volume de chamados abertos ao longo do ano</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={porMes()}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="mes" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="chamados" stroke="#6366f1" fill="url(#grad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Painel lateral — análise rápida (1 coluna) */}
          <div className="col-span-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-medium">Análise rápida</h3>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { label: 'Taxa de resolução', value: total ? Math.round((fechados/total)*100) + '%' : '0%', color: 'text-emerald-400' },
                { label: 'Sem atendente',     value: tickets.filter(t => !t.assigned_to).length, color: 'text-amber-400' },
                { label: 'Urgentes',          value: tickets.filter(t => t.priority === 'urgent').length, color: 'text-red-400' },
                { label: 'Aguardando',        value: tickets.filter(t => t.status === 'waiting').length, color: 'text-zinc-400' },
              ].map(item => (
                <div key={item.label} className="bg-[#1a1a2e] rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">{item.label}</span>
                  <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico barras — por atendente (ocupa 2 colunas) */}
          <div className="col-span-2 bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
            <h3 className="text-sm font-medium mb-1">Chamados por atendente</h3>
            <p className="text-xs text-zinc-500 mb-6">Distribuição de tickets assumidos</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={porAtendente()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="nome" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="total" fill="#8b5cf6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cards de resumo (2 colunas = 4 cards) */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {[
              { label: 'Total de chamados', value: total,    color: 'text-white',         bg: '' },
              { label: 'Novos hoje',        value: novos,    color: 'text-indigo-400',    bg: '' },
              { label: 'Em aberto',         value: abertos,  color: 'text-amber-400',     bg: '' },
              { label: 'Resolvidos',        value: fechados, color: 'text-emerald-400',   bg: '' },
            ].map(card => (
              <div key={card.label} className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
                <p className="text-xs text-zinc-500 mb-2">{card.label}</p>
                <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  )
}