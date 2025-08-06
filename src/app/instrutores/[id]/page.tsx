'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'

export default function EditarInstrutorPage() {
  const router = useRouter()
  const { id } = useParams()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    faixa: '',
    especialidades: '',
  })

  useEffect(() => {
    const fetchInstrutor = async () => {
      try {
        const res = await api.get(`/instrutores/${id}`)
        setForm(res.data)
      } catch (err) {
        toast.error('Erro ao carregar instrutor')
        console.error('❌ Erro:', err)
      }
    }
    fetchInstrutor()
  }, [id])

  const handleUpdate = async () => {
    try {
      console.log('🧪 Atualizando instrutor com ID:', id)
      console.log('🔗 URL:', `/instrutores/${id}`)
      console.log('📦 Payload:', form)

      const token = localStorage.getItem('access_token')
      const tenantId = localStorage.getItem('tenant_id')
      console.log('🔐 Token:', token)
      console.log('🏢 Tenant ID:', tenantId)
      await api.put(`/instrutores/${id}`, form)
      toast.success('Instrutor atualizado!')
    } catch (err) {
      toast.error('Erro ao atualizar!')
      console.error('❌ Erro ao atualizar:', err)
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm('Tem certeza que deseja excluir este instrutor?')
    if (!confirm) return

    try {
      await api.delete(`/instrutores/${id}`)
      toast.success('Instrutor deletado!')
      setTimeout(() => router.push('/instrutores'), 1000)
    } catch (err) {
      toast.error('Erro ao deletar!')
      console.error('❌ Erro ao deletar:', err)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <ToastContainer />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        style={{
          backgroundImage: "url('/jiujitsu-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <motion.div
        className="relative z-10 max-w-md mx-auto mt-20 bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center">Editar Instrutor</h1>
        <div className="grid gap-4">
          {['nome', 'email', 'telefone', 'faixa', 'especialidades'].map((field) => (
            <motion.input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border p-3 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              whileFocus={{ scale: 1.05 }}
            />
          ))}

          <div className="flex justify-between gap-4">
            <motion.button
              className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold shadow-md w-1/2"
              onClick={handleUpdate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Atualizar
            </motion.button>

            <motion.button
              className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded font-bold shadow-md w-1/2"
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Excluir
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}