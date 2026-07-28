import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Layout from '../components/Layout'
import CrudManager from '../components/cadastros/CrudManager'
import api from '../api/axios'

const TABS = [
  { key: 'usuarios', label: 'Usuários' },
  { key: 'empresas', label: 'Empresas' },
  { key: 'filiais',  label: 'Filiais' },
  { key: 'setores',  label: 'Setores' },
  { key: 'tipos',    label: 'Tipos' },
  { key: 'subtipos', label: 'Subtipos' },
]

const ROLE_LABELS = { admin: 'Admin', agent: 'Atendente', user: 'Usuário' }
const ROLE_COLORS = {
  admin: 'bg-purple-500/10 text-purple-400',
  agent: 'bg-blue-500/10  text-blue-400',
  user:  'bg-zinc-500/10  text-zinc-400',
}
const emptyForm = {
  username: '', first_name: '', last_name: '',
  email: '', password: '', phone: '',
  department: '', company: '', role: 'user'
}

function UsersTab() {
  const [users, setUsers]       = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(emptyForm)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    api.get('/users/').then(r => setUsers(r.data))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  const openEdit = (u) => {
    setEditing(u)
    setForm({ ...emptyForm, ...u, password: '' })
    setError('')
    setShowForm(true)
  }

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form }
      if (editing && !payload.password) delete payload.password

      if (editing) {
        const r = await api.patch(`/users/${editing.id}/`, payload)
        setUsers(prev => prev.map(u => u.id === editing.id ? r.data : u))
      } else {
        const r = await api.post('/users/', payload)
        setUsers(prev => [...prev, r.data])
      }
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : 'Erro ao salvar usuário.')
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
    <div>
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-6">{editing ? 'Editar usuário' : 'Novo usuário'}</h2>
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
                <label className="text-xs text-zinc-400 mb-1 block">
                  Senha {editing && <span className="text-zinc-600">(deixe em branco para manter)</span>}
                </label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="mínimo 6 caracteres" required={!editing} />
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
              {error && <p className="text-red-400 text-xs break-words">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-[#2a2a3e] text-zinc-400 hover:text-white rounded-lg py-2.5 text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50">
                  {loading ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="text-zinc-500 text-xs">{users.length} usuário(s)</span>
        <button onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
          + Novo usuário
        </button>
      </div>

      <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e2e] text-zinc-500 text-xs">
              <th className="text-left px-5 py-3">Nome</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Perfil</th>
              <th className="text-left px-5 py-3">Setor</th>
              <th className="text-left px-5 py-3">Empresa</th>
              <th className="text-left px-5 py-3">Telefone</th>
              <th className="text-right px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={7} className="text-center text-zinc-600 py-8">Nenhum usuário encontrado.</td></tr>
            )}
            {users.map(u => (
              <tr key={u.id} className="border-b border-[#1e1e2e] hover:bg-[#1a1a2e] transition-colors">
                <td className="px-5 py-3 font-medium">{u.first_name} {u.last_name} <span className="text-zinc-500 text-xs">@{u.username}</span></td>
                <td className="px-5 py-3 text-zinc-400">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span>
                </td>
                <td className="px-5 py-3 text-zinc-400">{u.department || '—'}</td>
                <td className="px-5 py-3 text-zinc-400">{u.company || '—'}</td>
                <td className="px-5 py-3 text-zinc-400">{u.phone || '—'}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <button onClick={() => openEdit(u)} className="text-indigo-400 hover:text-indigo-300 text-xs mr-3">Editar</button>
                  <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300 text-xs">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Cadastros() {
  const [tab, setTab] = useState('usuarios')

  return (
    <Layout>
      <Navbar />
      <div className="px-8 py-8 text-white w-full">
        <h2 className="text-2xl font-semibold mb-1">Cadastros</h2>
        <p className="text-zinc-500 text-sm mb-6">Gerencie usuários, empresas, filiais, setores, tipos e subtipos</p>

        <div className="flex gap-2 mb-6 border-b border-[#1e1e2e]">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`text-sm px-4 py-2.5 -mb-px border-b-2 transition-colors font-medium
                ${tab === t.key ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'usuarios' && <UsersTab />}

        {tab === 'empresas' && (
          <CrudManager
            title="Empresas"
            endpoint="/cadastros/companies/"
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'cnpj', label: 'CNPJ' },
              { key: 'active', label: 'Ativa', render: i => i.active ? 'Sim' : 'Não' },
            ]}
            fields={[
              { name: 'name', label: 'Nome', required: true },
              { name: 'cnpj', label: 'CNPJ' },
              { name: 'active', label: 'Ativa', type: 'checkbox' },
            ]}
          />
        )}

        {tab === 'filiais' && (
          <CrudManager
            title="Filiais"
            endpoint="/cadastros/branches/"
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'company_name', label: 'Empresa' },
              { key: 'active', label: 'Ativa', render: i => i.active ? 'Sim' : 'Não' },
            ]}
            fields={[
              { name: 'name', label: 'Nome', required: true },
              { name: 'company', label: 'Empresa', type: 'select', required: true, optionsEndpoint: '/cadastros/companies/' },
              { name: 'active', label: 'Ativa', type: 'checkbox' },
            ]}
          />
        )}

        {tab === 'setores' && (
          <CrudManager
            title="Setores"
            endpoint="/cadastros/sectors/"
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'active', label: 'Ativo', render: i => i.active ? 'Sim' : 'Não' },
            ]}
            fields={[
              { name: 'name', label: 'Nome', required: true },
              { name: 'active', label: 'Ativo', type: 'checkbox' },
            ]}
          />
        )}

        {tab === 'tipos' && (
          <CrudManager
            title="Tipos"
            endpoint="/cadastros/ticket-types/"
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'active', label: 'Ativo', render: i => i.active ? 'Sim' : 'Não' },
            ]}
            fields={[
              { name: 'name', label: 'Nome', required: true },
              { name: 'active', label: 'Ativo', type: 'checkbox' },
            ]}
          />
        )}

        {tab === 'subtipos' && (
          <CrudManager
            title="Subtipos"
            endpoint="/cadastros/ticket-subtypes/"
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'ticket_type_name', label: 'Tipo' },
              { key: 'active', label: 'Ativo', render: i => i.active ? 'Sim' : 'Não' },
            ]}
            fields={[
              { name: 'name', label: 'Nome', required: true },
              { name: 'ticket_type', label: 'Tipo do chamado', type: 'select', required: true, optionsEndpoint: '/cadastros/ticket-types/' },
              { name: 'active', label: 'Ativo', type: 'checkbox' },
            ]}
          />
        )}
      </div>
    </Layout>
  )
}