import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const ctx = canvas.getContext('2d')
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.2,
      o: Math.random() * 0.5 + 0.15,
      speed: Math.random() * 0.006 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }))
    let frame
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        const opacity = s.o + Math.sin(t * s.speed + s.phase) * 0.25
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, opacity)})`
        ctx.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize) }
  }, [])

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
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans text-white selection:bg-purple-950 overflow-hidden"
      style={{ background: '#06070e' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poller+One&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .dm-sans { font-family: 'DM Sans', sans-serif; }
        .poller  { font-family: 'Poller One', serif; letter-spacing: 0.07em; }
        @keyframes rocket-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes flame-pulse {
          0%, 100% { transform: scaleY(1);    opacity: 0.9; }
          50%       { transform: scaleY(1.35); opacity: 1;   }
        }
        @keyframes astro-float {
          0%, 100% { transform: translateY(0px)   rotate(-1deg); }
          50%       { transform: translateY(-18px) rotate(1.5deg); }
        }
        .rocket-animate { animation: rocket-float 3s ease-in-out infinite; }
        .flame-animate  { animation: flame-pulse 0.4s ease-in-out infinite; transform-origin: top; }
        .astro-animate  { animation: astro-float 6s ease-in-out infinite; }
        .login-input {
          width: 100%;
          background: rgba(12,12,24,0.7);
          border: 1px solid rgba(50,45,90,0.8);
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 13px;
          color: white;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .login-input::placeholder { color: #3a3a55; }
        .login-input:focus {
          border-color: rgba(139,124,246,0.55);
          box-shadow: 0 0 0 3px rgba(139,124,246,0.09);
        }
        .btn-signin {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          background: white;
          color: #0a0a14;
          font-size: 14px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-signin:hover    { background: #e8e8f4; }
        .btn-signin:active   { transform: scale(0.98); }
        .btn-signin:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div
        className="relative flex items-center w-full"
        style={{
          zIndex: 2,
          maxWidth: '1170px', 
          margin: '0 auto',   
          minHeight: '800px',
        }}
      >

        {/*  ASTRONAUTA —  */}
        <div
          className="absolute pointer-events-none astro-animate"
          style={{
            left: '100px',    
            top: '15%',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        >
          <img
            src="/astro.png"
            alt=""
            style={{
              width: '600px',       
              maxWidth: '42vw',
              filter: 'drop-shadow(0 0 60px rgba(79,46,200,0.25))',
            }}
          />
        </div>

        {/* CARD DE LOGIN */}
        <div
          className="relative dm-sans flex flex-col justify-between"
          style={{
            marginLeft: 'auto', 
            zIndex: 2,
            width: '100%',
            maxWidth: '570px',   
            minHeight: '600px',
            borderRadius: '24px',
            background: 'rgba(9,9,20,0.88)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(80,60,180,0.18)',
            padding: '40px 25px',
          }}
        >
          <div>
            {/* Top bar */}
          <div className="flex justify-center mb-8">
             <div className="flex items-center gap-2">
                <div className="rocket-animate flex items-center">
                  <svg width="30" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C12 2 7 6 7 12C7 15.5 9 17 12 18C15 17 17 15.5 17 12C17 6 12 2 12 2Z" fill="url(#rg-login)" />
                    <path d="M7 12L4 15V17L7 15V12Z" fill="#4f46e5" />
                    <path d="M17 12L20 15V17L17 15V12Z" fill="#4f46e5" />
                    <circle cx="12" cy="9" r="1.5" fill="#0a0a0f" />
                    <path className="flame-animate" d="M10 18C10 21 12 23 12 23C12 23 14 21 14 18H10Z" fill="#f97316" />
                    <defs>
                      <linearGradient id="rg-login" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9a7bcf" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h1 className="poller text-base text-white pt-0.8">APOLLO</h1>
              </div>
            </div>
<div className="mb-8">
  <p className="text-center text-[18px] text-zinc-400 italic">
    Relate o problema, a Apollo lança a solução.
  </p>
</div>

<div className="flex items-center gap-3 my-8">
  <div className="flex-1 h-px bg-white/10"></div>
  <span className="text-xs text-zinc-500">Insira seus dados</span>
  <div className="flex-1 h-px bg-white/10"></div>
</div>

  
            <form onSubmit={handle} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">Login</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  className="login-input"
                  placeholder="Ex: admin"
                />
              </div>

                    
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-zinc-400">Senha</label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="login-input pr-10" 
                  placeholder="••••••••••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                  aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

             <div className="flex justify-end">
                <a
                  href="#"
                  className="relative right-2 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Esqueceu a senha?
                </a>
            </div>

              {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                disabled={loading}
                className="btn-signin !w-96"
              >
                {loading ? 'Acessando...' : 'Acessar'}
              </button>
            </div>
            </form>
          </div>

          
          <div className="text-center">
              <p className="text-[13px] text-zinc-600">Não tem conta? Contatde o setor de Ti ou o administrador do sistema</p>
              <a href="#" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
               
              </a>
          </div>
        </div>
        {/* FIM DO CARD */}

      </div>
      {/* FIM DO WRAPPER CENTRAL */}

    </div>
  )
}