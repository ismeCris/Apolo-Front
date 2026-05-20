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
      {/* Injeção de CSS Puro para as animaçao */}
      <style>{`
        @keyframes flutuar {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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

      <div className="w-full max-w-md bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">

        {/* Header com a Logo Animada */}
        <div className="mb-8 text-center flex flex-col items-center">
          
          {/* Logo do Foguete Apollo (SVG + CSS) */}
          <div className="animacao-foguete mb-3">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corpo do Foguete */}
              <path 
                d="M12 2C12 2 7 6 7 12C7 15.5 9 17 12 18C15 17 17 15.5 17 12C17 6 12 2 12 2Z" 
                fill="url(#gradiente-foguete)"
              />
              {/* Asas/Alerons Laterais */}
              <path d="M7 12L4 15V17L7 15V12Z" fill="#4f46e5" />
              <path d="M17 12L20 15V17L17 15V12Z" fill="#4f46e5" />
              {/* Janela da Cabine */}
              <circle cx="12" cy="9" r="2" fill="#0a0a0f" />
              
              {/* Fogo da Propulsão (Animado) */}
              <path 
                className="fogo-propulsor" 
                d="M10 18C10 21 12 23 12 23C12 23 14 21 14 18H10Z" 
                fill="#f97316" 
              />

              {/* Definição do Gradiente da Logo combinando com seu botão */}
              <defs>
                <linearGradient id="gradiente-foguete" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9a7bcf" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight">Apollo</h1>
          <p className="text-sm text-zinc-500 mt-2 max-w-xs leading-relaxed">
            Relate o problema, a Apollo lança a solução.
          </p>
        </div>
              {/*USUÁRIO */}
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Usuário</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 "
              placeholder="usuário"
            />
          </div>
            {/* SENHA */}
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Senha</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>
            {/*BOTAO */}
          {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '8px 0px', 
                  backgroundColor: '#4f509b', 
                  backgroundImage: 'linear-gradient(135deg, #9a7bcf 0%, #4f46e5 100%)', 
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.4)', 
                  transition: 'all 0.2s ease-in-out',
                }}
              >
            {loading ? 'Sincronizando com a base...' : 'Iniciar Decolagem'}
          </button>
        </form>
      </div>
    </div>
  )
}