'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Dashboard() {
  const [tenant, setTenant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const tenantId = localStorage.getItem('tenant_id')
    if (!tenantId) {
      router.push('/')
      return
    }

    api.get(`/tenants/${tenantId}`)
      .then(res => setTenant(res.data))
      .catch(() => toast.error('Erro ao carregar dados da academia'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <span className="animate-pulse text-lg">Carregando Portal...</span>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <ToastContainer />
      <video autoPlay loop muted className="absolute w-full h-full object-cover opacity-20">
        <source src="/jiujitsu-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute w-full h-full bg-black/60 backdrop-blur-md" />

      <header className="z-10 fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-lg shadow-lg">
        <div className="flex items-center gap-3">
          {tenant?.logoUrl ? (
            <img src={tenant.logoUrl} className="w-12 h-12 rounded-full border-2 border-white" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-sm">N/A</div>
          )}
          <h1 className="text-2xl font-extrabold">{tenant?.name ?? 'Academia'}</h1>
        </div>
        <button
          className="bg-red-600 hover:bg-red-800 px-4 py-2 rounded font-semibold shadow-md"
          onClick={() => { localStorage.clear(); router.push('/'); }}
        >
          Sair
        </button>
      </header>

      <main className="z-10 relative pt-24 px-8">
        <motion.h2
          className="text-4xl font-extrabold mb-6 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Bem-vindo ao Portal do Jiu-Jitsu
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Aulas', desc: 'Gerencie e visualize as aulas', path: '/aulas' },
            { label: 'Alunos', desc: 'Cadastro e acompanhamento de alunos', path: '/alunos' },
            { label: 'Gradução', desc: 'faixas e grau do aluno', path: '/graduacoes' },
            { label: 'Instrutores', desc: 'Gestão de instrutores e turmas', path: '/instrutores' },
            { label: 'Relatórios', desc: 'Insights e gráficos de desempenho', path: '/relatorios' },
{ label: 'Configurações', desc: 'Administre as preferências da academia e integração com WhatsApp', path: '/configuracoes' }          ].map(item => (
            <motion.div
              key={item.path}
              className="bg-white/10 rounded-xl shadow-lg p-6 cursor-pointer hover:scale-105 transition-transform backdrop-blur-md"
              onClick={() => router.push(item.path)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-bold mb-2">{item.label}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}