import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import Layout from '../components/Layout'

const ROLE_LABELS = { admin: 'Admin', agent: 'Atendente', user: 'Usuário' }
const ROLE_COLORS = {
  admin: 'bg-purple-500/10 text-purple-400',
  agent: 'bg-blue-500/10  text-blue-400',
  user:  'bg-zinc-500/10  text-zinc-400',
}

export default function Users() {
  const [users, setUsers]     = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    username: '', first_name: '', last_name: '',
    email: '', password: '', phone: '',
    department: '', company: '', role: 'user'
  })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/users/').then(r => setUsers(r.data))
  }, [])

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const r = await api.post('/users/', form)
      setUsers(prev => [...prev, r.data])
      setShowForm(false)
      setForm({ username: '', first_name: '', last_name: '', email: '', password: '', phone: '', department: '', company: '', role: 'user' })
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao criar usuário.')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Remover usuário?')) return
    await api.delete(`/users/${id}/`)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

 return (
  <Layout>
     <div className="px-8 py-10 text-white">
      <Navbar />

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-6">Novo usuário</h2>
            <form onSubmit={handle} className="space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Nome</label>
                  <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})}
                    className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Nome" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Sobrenome</label>
                  <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})}
                    className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Sobrenome" />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Usuário</label>
                <input value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="nome.usuario" required />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="email@empresa.com" required />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Senha</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="mínimo 6 caracteres" required />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Telefone (opcional)</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="(00) 00000-0000" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Setor</label>
                  <input value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="TI, RH, Financeiro..." />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Empresa</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                    className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Nome da empresa" />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Perfil</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                  <option value="user">Usuário</option>
                  <option value="agent">Atendente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-[#2a2a3e] text-zinc-400 hover:text-white rounded-lg py-2.5 text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50">
                  {loading ? 'Criando...' : 'Criar usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="px-8 py-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Usuários</h2>
            <p className="text-zinc-500 text-sm mt-1">Gerencie os usuários do sistema</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            + Novo usuário
          </button>
        </div>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-zinc-500 text-xs">
                <th className="text-left px-6 py-3">Nome</th>
                <th className="text-left px-6 py-3">Email</th>
                <th className="text-left px-6 py-3">Perfil</th>
                <th className="text-left px-6 py-3">Setor</th>
                <th className="text-left px-6 py-3">Empresa</th>
                <th className="text-left px-6 py-3">Telefone</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr><td colSpan={7} className="text-center text-zinc-600 py-10">Nenhum usuário encontrado.</td></tr>
              )}
              {users.map(u => (
                <tr key={u.id} className="border-b border-[#1e1e2e] hover:bg-[#1a1a2e] transition-colors">
                  <td className="px-6 py-4 font-medium">{u.first_name} {u.last_name} <span className="text-zinc-500 text-xs">@{u.username}</span></td>
                  <td className="px-6 py-4 text-zinc-400">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{u.department || '—'}</td>
                  <td className="px-6 py-4 text-zinc-400">{u.company || '—'}</td>
                  <td className="px-6 py-4 text-zinc-400">{u.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => deleteUser(u.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
     </Layout>
  )
}