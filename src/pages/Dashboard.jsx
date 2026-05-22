import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TicketForm from '../components/TicketForm'
import Layout from '../components/Layout'
import api from '../api/axios'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
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

  // Dados dos Cards
  const total    = tickets.length
  const abertos  = tickets.filter(t => t.status === 'open').length
  const fechados = tickets.filter(t => ['closed', 'resolved'].includes(t.status)).length
  const novos    = tickets.filter(t => {
    const d = new Date(t.created_at)
    const hoje = new Date()
    return d.getDate() === hoje.getDate() && d.getMonth() === hoje.getMonth()
  }).length

  // Porcentagem para o gráfico de rosca
  const taxaResolucao = total ? Math.round((fechados / total) * 100) : 0
  const dadosPizza = [
    { name: 'Resolvidos', value: taxaResolucao },
    { name: 'Restante', value: 100 - taxaResolucao }
  ]

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
              {user?.role === 'user' ? 'Acompanhe seus chamados' : 'Painel de controle'}
            </p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            + Abrir chamado
          </button>
        </div>

        {/* Layout principal em 4 colunas */}
        <div className="grid grid-cols-4 gap-4 items-start">

          {/* COLUNA DA ESQUERDA (Ocupa 3 colunas do grid e agrupa os gráficos e mini cards) */}
          <div className="col-span-3 grid grid-cols-3 gap-4">
            
            {/* Gráfico área — chamados por mês (ocupa 3 colunas completas da sub-grade) */}
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

            {/* Gráfico barras — por atendente (ocupa 2 colunas da sub-grade) */}
            <div className="col-span-2 bg-[#111118] border border-[#1e1e2e] rounded-xl p-6 h-full">
              <h3 className="text-sm font-medium mb-1">Chamados por atendente</h3>
              <p className="text-xs text-zinc-500 mb-6">Distribuição de tickets assumidos</p>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={porAtendente()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                  <XAxis dataKey="nome" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* MINI CARDS: Agora organizados em uma ÚNICA coluna vertical ao lado do gráfico de barras */}
            <div className="col-span-1 flex flex-col gap-3">
              {[
                { label: 'Total de chamados', value: total,    color: 'text-white' },
                { label: 'Novos hoje',        value: novos,    color: 'text-indigo-400' },
                { label: 'Em aberto',         value: abertos,  color: 'text-amber-400' },
                { label: 'Resolvidos',        value: fechados, color: 'text-emerald-400' },
              ].map(card => (
                <div 
                  key={card.label} 
                  className="bg-[#111118] border border-[#1e1e2e] rounded-xl py-3.5 px-5 flex flex-col justify-center min-h-[66px]"
                >
                  <p className="text-[11px] text-zinc-500 mb-0.5">{card.label}</p>
                  <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

          </div>

              {/* COLUNA DA DIREITA: CARD LONGO */}
          <div className="col-span-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 flex flex-col h-full min-h-[580px]">
            <h3 className="text-sm font-medium text-center pt-2 text-zinc-200">Análise rápida</h3>
            <p className="text-center text-xs text-zinc-500 mb-4">Desempenho geral do sistema</p>

            {/* 4 MINI GRÁFICOS  */}
            <div className="flex flex-col gap-3 mt-6 flex-1 items-center justify-start">
              {[
                { 
                  label: 'Resolução', 
                  pct: taxaResolucao, 
                  corCirculo: 'stroke-emerald-400', 
                  corTexto: 'text-emerald-400' 
                },
                { 
                  label: 'Sem atendente', 
                  pct: total ? Math.round((tickets.filter(t => !t.assigned_to).length / total) * 100) : 0, 
                  corCirculo: 'stroke-amber-400', 
                  corTexto: 'text-amber-400' 
                },
                { 
                  label: 'Urgentes', 
                  pct: total ? Math.round((tickets.filter(t => t.priority === 'urgent').length / total) * 100) : 0, 
                  corCirculo: 'stroke-red-400', 
                  corTexto: 'text-red-400' 
                },
                { 
                  label: 'Aguardando', 
                  pct: total ? Math.round((tickets.filter(t => t.status === 'waiting').length / total) * 100) : 0, 
                  corCirculo: 'stroke-zinc-400', 
                  corTexto: 'text-zinc-400' 
                },
              ].map(item => {
                const raio = 18;
                const circunferencia = 2 * Math.PI * raio;
                const strokeDashoffset = circunferencia - (item.pct / 100) * circunferencia;

                return (
                  <div 
                    key={item.label} 
                    className="w-52 h-26 mx-auto bg-[#1a1a2e]/50 border border-[#27273a] rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200"
                  >
                    {/* Círculo de Progresso SVG */}
                    <div className="relative w-14 h-14 flex items-center justify-center mb-2">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r={raio} className="stroke-[#27273a] fill-transparent stroke-[3.5]" />
                        <circle 
                          cx="20" 
                          cy="20" 
                          r={raio} 
                          className={`fill-transparent stroke-[3.5] transition-all duration-500 ease-out ${item.corCirculo}`}
                          strokeDasharray={circunferencia}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-white">{item.pct}%</span>
                    </div>

                    {/* Nome do Indicador */}
                    <span className="text-xs text-zinc-400 font-medium tracking-tight line-clamp-1">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}