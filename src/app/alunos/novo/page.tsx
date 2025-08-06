'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/axios'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'

export default function NovoAluno() {
  const router = useRouter()
  const [form, setForm] = useState({ nome: '', email: '', faixaAtual: '', telefone: '', observacoes: '' })

  const handleSubmit = async () => {
    try {
      await api.post('/alunos', form)
      toast.success('Aluno cadastrado com sucesso!')
      setTimeout(() => router.push('/alunos'), 1000)
    } catch {
      toast.error('Erro ao cadastrar aluno!')
    }
  }

  const fields = ['nome', 'email', 'faixaAtual', 'telefone', 'observacoes'] as const

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <ToastContainer />
      {/* Fundo impactante */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        style={{
          backgroundImage: "url('/jiujitsu-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <motion.div
        className="relative z-10 max-w-md mx-auto mt-20 bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold mb-6 text-center">Cadastrar Novo Aluno</h1>
        <div className="grid gap-4">
          {fields.map(field => (
            <motion.input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="border p-3 rounded bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              whileFocus={{ scale: 1.05 }}
            />
          ))}
          <motion.button
            className="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded font-bold shadow-md"
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