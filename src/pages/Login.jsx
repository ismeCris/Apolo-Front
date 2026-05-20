import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch {
      setError('Usuário ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      
      {/* Centralização Única de CSS: Importação da Fonte + Animações */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poller+One&display=swap');

        .fonte-star-wars {
          font-family: 'Poller One', serif !important;
          letter-spacing: 0.05em;
        }
        @keyframes flutuar {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @keyframes propulsao {
          0%, 100% { transform: scaleY(1); opacity: 0.9; }
          50% { transform: scaleY(1.3); opacity: 1; }
        }
        .animacao-foguete {
          animation: flutuar 3s ease-in-out infinite;
        }
        .fogo-propulsor {
          animation: propulsao 0.4s ease-in-out infinite;
          transform-origin: top;
        }
      `}</style>

      <div className="w-full max-w-md bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 shadow-2xl">

        {/* Header: Foguete e Título lado a lado */}
        <div className="mb-5 flex flex-col items-center gap-1">
          
          <div className="flex items-center gap-2 mb-1">
            {/* Logo do Foguete Apollo (SVG dimensionado para o texto) */}
            <div className="animacao-foguete flex items-center justify-center">
              <svg 
                width="50" 
                height="100" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 2C12 2 7 6 7 12C7 15.5 9 17 12 18C15 17 17 15.5 17 12C17 6 12 2 12 2Z" 
                  fill="url(#gradiente-foguete)"
                />
                <path d="M7 12L4 15V17L7 15V12Z" fill="#4f46e5" />
                <path d="M17 12L20 15V17L17 15V12Z" fill="#4f46e5" />
                <circle cx="12" cy="9" r="2" fill="#0a0a0f" />
                <path 
                  className="fogo-propulsor" 
                  d="M10 18C10 21 12 23 12 23C12 23 14 21 14 18H10Z" 
                  fill="#f97316" 
                />
                <defs>
                  <linearGradient id="gradiente-foguete" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#9a7bcf" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Escrita estilizada com Poller One */}
            <h1 className="text-3xl font-bold text-white tracking-tight fonte-star-wars mt-1">
              APOLLO
            </h1>
          </div>

          <p className="text-sm text-zinc-500 max-w-xs text-center leading-relaxed ">
            Relate o problema, a Apollo lança a solução.
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handle} className="space-y-4">
          
          {/* BLOCO USUÁRIO */}
          <div className="w-full text-left">
            <label className="text-xs text-zinc-400 mb-1.5 block font-medium">
              Usuário
            </label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="usuário"
            />
          </div>

          {/* BLOCO SENHA */}
          <div className="w-full text-left">
            <label className="text-xs text-zinc-400 mb-2.5 block font-medium">
              Senha
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-left font-medium">{error}</p>}
          
          {/* BOTÃO COM AS PROPORÇÕES AJUSTADAS */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2.5 text-sm font-semibold rounded-lg text-white transition-all duration-200"
            style={{
              backgroundColor: '#4f509b', 
              backgroundImage: 'linear-gradient(135deg, #9a7bcf 0%, #4f46e5 100%)', 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.3)', 
            }}
          >
            {loading ? 'Sincronizando com a base...' : 'Iniciar Decolagem'}
          </button>
        </form>
      </div>
    </div>
  )
}