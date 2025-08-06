'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '@/lib/axios'

export default function EditGraduacaoPage() {
  const router = useRouter()
  const { id } = useParams()

  const [form, setForm] = useState({
    faixa: '',
    grau: 0,
    data: '',
    observacao: '',
  })

  useEffect(() => {
    const fetchGraduacao = async () => {
      try {
        const res = await api.get(`/graduacoes/${id}`)
        const { faixa, grau, data, observacao } = res.data
        setForm({
          faixa,
          grau,
          data: data?.slice(0, 10) || '',
          observacao: observacao || '',
        })
      } catch {
        toast.error('Erro ao carregar graduação')
      }
    }

    fetchGraduacao()
  }, [id])

  const handleSubmit = async () => {
    try {
      await api.put(`/graduacoes/${id}`, form)
      toast.success('Graduação atualizada com sucesso!')
      setTimeout(() => router.push('/graduacoes'), 1500)
    } catch {
      toast.error('Erro ao atualizar graduação')
    }
  }

  return (
    <motion.div
      className="p-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ToastContainer />
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Editar Graduação
      </motion.h1>

      <div className="grid gap-5 bg-white/10 p-6 rounded-xl shadow-lg backdrop-blur-sm">
        <input
          type="text"
          placeholder="Faixa"
          className="p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.faixa}
          onChange={(e) => setForm({ ...form, faixa: e.target.value })}
        />
        <input
          type="number"
          placeholder="Grau"
          className="p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.grau}
          onChange={(e) => setForm({ ...form, grau: Number(e.target.value) })}
        />
        <input
          type="date"
          className="p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.data}
          onChange={(e) => setForm({ ...form, data: e.target.value })}
        />
        <textarea
          placeholder="Observações"
          className="p-3 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={form.observacao}
          onChange={(e) => setForm({ ...form, observacao: e.target.value })}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition"
        >
          Salvar Alterações
        </motion.button>
      </div>
    </motion.div>
  )
}