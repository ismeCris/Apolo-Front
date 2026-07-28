import { useState } from 'react'
import Navbar from '../components/Navbar'
import Layout from '../components/Layout'
import CrudManager from '../components/cadastros/CrudManager'
import UsersManager from '../components/cadastros/UsersManager'

const TABS = [
  { key: 'usuarios', label: 'Usuários' },
  { key: 'empresas', label: 'Empresas' },
  { key: 'filiais',  label: 'Filiais' },
  { key: 'setores',  label: 'Setores' },
  { key: 'tipos',    label: 'Tipos' },
  { key: 'subtipos', label: 'Subtipos' },
]

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

        {tab === 'usuarios' && <UsersManager />}

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