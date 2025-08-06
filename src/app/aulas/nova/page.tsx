'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'
import api from '@/lib/axios'

export default function NovaAulaPage() {
  const router = useRouter()
  const [form, setForm] = useState({ titulo: '', data: '', instrutorId: '' })
  const [instrutores, setInstrutores] = useState<any[]>([])

  useEffect(() => {
    const tenantId = localStorage.getItem('tenant_id')
    if (!tenantId) return

    api
      .get('/instrutores')
      .then(res => {
        const filtrados = res.data.filter((instrutor: any) => instrutor.tenantId === tenantId)
        setInstrutores(filtrados)
      })
      .catch(() => toast.error('Erro ao carregar instrutores'))
  }, [])

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token')
    const tenantId = localStorage.getItem('tenant_id')

    if (!form.titulo || !form.data || !form.instrutorId) {
      toast.error('Preencha todos os campos!')
      return
    }

    const isoData = new Date(form.data).toISOString()

    try {
      await api.post('/aulas', {
        ...form,
        data: isoData,
      })

      toast.success('Aula cadastrada com sucesso!')
      setTimeout(() => router.push('/aulas'), 1000)
    } catch {
      toast.error('Erro ao cadastrar aula')
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <ToastContainer />
      {/* Vídeo futurista de fundo */}
      <video autoPlay loop muted className="absolute w-full h-full object-cover opacity-20">
        <source src="/jiujitsu-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute w-full h-full bg-black/60 backdrop-blur-md" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl font-extrabold mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          📅 Nova Aula de Jiu-Jitsu
        </motion.h1>

        <motion.div
          className="grid gap-4 w-full max-w-md bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-2xl"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
            placeholder="Título da Aula"
            className="border p-3 rounded text-black dark:bg-white/10 dark:text-white dark:placeholder-white"
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
          />
          <input
            type="datetime-local"
            className="border p-3 rounded text-black dark:bg-white/10 dark:text-white dark:placeholder-white"
            value={form.data}
            onChange={e => setForm({ ...form, data: e.target.value })}
          />
          <select
            className="border p-3 rounded text-black dark:bg-white/10 dark:text-white"
            value={form.instrutorId}
            onChange={e => setForm({ ...form, instrutorId: e.target.value })}
          >
            <option value="">Selecione o instrutor</option>
            {instrutores.map(instrutor => (
              <option key={instrutor.id} value={instrutor.id}>
                {instrutor.nome}
              </option>
            ))}
          </select>

          <motion.button
            className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
          >
            Cadastrar Aula
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}