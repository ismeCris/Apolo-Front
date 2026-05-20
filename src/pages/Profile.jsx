import { useState } from 'react'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Profile() {
  const { user } = useAuth()
  const [form, setForm]       = useState({ first_name: user?.first_name || '', last_name: user?.last_name || '', email: user?.email || '', phone: user?.phone || '', department: user?.department || '', company: user?.company || '' })
  const [success, setSuccess] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    await api.patch(`/users/${user.id}/`, form)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <Layout>
      <Navbar />
      <div className="px-8 py-10 max-w-2xl">
        <h2 className="text-2xl font-semibold text-white mb-2">Meu perfil</h2>
        <p className="text-zinc-500 text-sm mb-8">Atualize suas informações pessoais</p>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6">
          <form onSubmit={handle} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Nome</label>
                <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Sobrenome</label>
                <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Telefone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Setor</label>
                <input value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Empresa</label>
                <input value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                  className="w-full bg-[#1a1a2e] border border-[#2a2a3e] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            {success && <p className="text-emerald-400 text-xs">Perfil atualizado!</p>}

            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
              Salvar alterações
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}