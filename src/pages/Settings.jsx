import Layout from '../components/Layout'
import Navbar from '../components/Navbar'

export default function Settings() {
  return (
    <Layout>
      <Navbar />
      <div className="px-8 py-10">
        <h2 className="text-2xl font-semibold text-white mb-2">Configurações</h2>
        <p className="text-zinc-500 text-sm">Em breve.</p>
      </div>
    </Layout>
  )
}