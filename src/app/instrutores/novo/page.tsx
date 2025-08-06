'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function NovoInstrutorPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    faixa: '',
    especialidades: '',
  })

  const handleSubmit = async () => {
    try {
      await api.post('/instrutores', form)
      toast.success('Instrutor cadastrado com sucesso!')
      setTimeout(() => router.push('/instrutores'), 1000)
    } catch (err) {
      console.error('❌ Erro ao cadastrar instrutor:', err)
      toast.error('Erro ao cadastrar instrutor!')
    }
  }

  const fields = ['nome', 'email', 'telefone', 'faixa', 'especialidades'] as const

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
        <h1 className="text-3xl font-extrabold mb-6 text-center">Cadastrar Instrutor</h1>
        <div className="grid gap-4">
          {fields.map((field) => (
            <motion.input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border p-3 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              whileFocus={{ scale: 1.05 }}
            />
          ))}
          <motion.button
            className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold shadow-md"
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cadastrar
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}