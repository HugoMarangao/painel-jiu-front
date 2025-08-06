'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/axios'
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function PerfilAlunoPage() {
  const { id } = useParams()
  const [aluno, setAluno] = useState<any>(null)
  const [progresso, setProgresso] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alunoRes, progRes] = await Promise.all([
          api.get(`/alunos/${id}`),
          api.get(`/graduacoes/progresso/${id}`),
        ])

        setAluno(alunoRes.data)
        setProgresso(progRes.data)
      } catch (err) {
        console.error('Erro ao carregar dados do aluno:', err)
        toast.error('Erro ao carregar dados do aluno')
      }
    }

    fetchData()
  }, [id])

  if (!aluno || !progresso) return <div className="p-8 text-white">Carregando...</div>

  return (
    <div className="p-8 text-white relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <ToastContainer />
      <motion.h1
        className="text-4xl font-extrabold mb-6 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Perfil de {aluno.nome}
      </motion.h1>

      <div className="grid gap-6 max-w-3xl mx-auto">
        {/* Dados do aluno */}
        <div className="bg-white/10 p-6 rounded-xl shadow-md">
          <p><strong>Email:</strong> {aluno.email || 'Não informado'}</p>
          <p><strong>Faixa Atual:</strong> {aluno.faixaAtual || 'Não informada'}</p>
          <p><strong>Telefone:</strong> {aluno.telefone || 'Não informado'}</p>
          <p><strong>Observações:</strong> {aluno.observacoes || 'Nenhuma'}</p>
        </div>

        {/* Progresso na faixa */}
        <div className="bg-white/10 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4">Progresso na Faixa</h2>
          <p><strong>Faixa:</strong> {progresso.faixa || 'Não definida'}</p>
          <p><strong>Grau Atual:</strong> {progresso.grau ?? 0}</p>
          <p><strong>Percentual:</strong> {progresso.percentual ?? 0}%</p>

          <div className="w-full bg-gray-700 rounded h-4 mt-2">
            <div
              className="h-4 rounded bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: `${progresso.percentual ?? 0}%` }}
            />
          </div>
        </div>

        {/* Medalhas / Conquistas */}
        {Array.isArray(progresso.medalhas) && progresso.medalhas.length > 0 && (
          <div className="bg-white/10 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Conquistas</h2>
            <ul className="list-disc ml-5">
              {progresso.medalhas.map((m: string, i: number) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}