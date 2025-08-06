'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'
import api from '@/lib/axios'

export default function EditarAulaPage() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState({ titulo: '', data: '', instrutorId: '' })
  const [instrutores, setInstrutores] = useState<any[]>([])

  useEffect(() => {
    const tenantId = localStorage.getItem('tenant_id')

    // Carrega dados da aula
    api.get(`/aulas/${id}`)
      .then(res => {
        setForm({
          titulo: res.data.titulo,
          data: res.data.data.slice(0, 16),
          instrutorId: res.data.instrutorId ?? ''
        })
      })
      .catch(() => toast.error('Erro ao carregar aula'))

    // Carrega instrutores filtrando pelo tenant
    api.get('/instrutores')
      .then(res => {
        const filtrados = res.data.filter((i: any) => i.tenantId === tenantId)
        setInstrutores(filtrados)
      })
      .catch(() => toast.error('Erro ao carregar instrutores'))
  }, [id])

  const handleUpdate = async () => {
    if (!form.titulo || !form.data || !form.instrutorId) {
      toast.error('Preencha todos os campos!')
      return
    }

    try {
      await api.put(`/aulas/${id}`, {
        ...form,
        data: new Date(form.data).toISOString(),
      })
      toast.success('Aula atualizada com sucesso!')
      setTimeout(() => router.push('/aulas'), 1000)
    } catch {
      toast.error('Erro ao atualizar aula')
    }
  }

  return (
    <div className="p-8 text-white">
      <ToastContainer />
      <motion.h1
        className="text-3xl font-extrabold mb-6 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Editar Aula
      </motion.h1>

      <motion.div
        className="grid gap-4 max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <input
          placeholder="Título da Aula"
          className="border p-2 rounded text-black dark:bg-white/10 dark:text-white dark:placeholder-white"
          value={form.titulo}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
        />
        <input
          type="datetime-local"
          className="border p-2 rounded text-black dark:bg-white/10 dark:text-white dark:placeholder-white"
          value={form.data}
          onChange={e => setForm({ ...form, data: e.target.value })}
        />
        <select
          className="border p-2 rounded text-black dark:bg-white/10 dark:text-white"
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
          className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpdate}
        >
          Atualizar Aula
        </motion.button>
      </motion.div>
    </div>
  )
}