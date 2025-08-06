'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'
import api from '@/lib/axios'

export default function PresencasPage() {
  const { id: aulaId } = useParams()
  const router = useRouter()
  const [alunos, setAlunos] = useState<any[]>([])
  const [presencas, setPresencas] = useState<Set<string>>(new Set())

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null

  useEffect(() => {
    if (!aulaId || !tenantId) return

    const fetchData = async () => {
      try {
        const [alunosRes, presencasRes] = await Promise.all([
          api.get('/alunos'),
          api.get('/presencas'),
        ])

        const listaAlunos = alunosRes.data?.items?.filter((a: any) => a.tenantId === tenantId) || []
        setAlunos(listaAlunos)

        const presencasAula = (presencasRes.data || [])
          .filter((p: any) => p.aulaId === aulaId)
          .map((p: any) => p.alunoId)

        setPresencas(new Set(presencasAula))
      } catch (err) {
        console.error('Erro ao carregar dados', err)
        toast.error('Erro ao carregar dados')
      }
    }

    fetchData()
  }, [aulaId, tenantId])

  const togglePresenca = async (alunoId: string) => {
    const presente = presencas.has(alunoId)

    try {
      if (presente) {
        const res = await api.get('/presencas')
        const presencaParaRemover = res.data.find((p: any) => p.aulaId === aulaId && p.alunoId === alunoId)

        if (presencaParaRemover) {
          await api.delete(`/presencas/${presencaParaRemover.id}`)
        }

        const novaSet = new Set(presencas)
        novaSet.delete(alunoId)
        setPresencas(novaSet)
        toast.success('Presença removida')
      } else {
        await api.post('/presencas', { alunoId, aulaId })

        const novaSet = new Set(presencas)
        novaSet.add(alunoId)
        setPresencas(novaSet)
        toast.success('Presença marcada')
      }
    } catch {
      toast.error('Erro ao atualizar presença')
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
        Presenças da Aula
      </motion.h1>

      <motion.div
        className="grid gap-4 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {alunos.length === 0 ? (
          <p className="text-center">Nenhum aluno encontrado.</p>
        ) : (
          alunos.map((aluno: any) => (
            <motion.div
              key={aluno.id}
              className={`flex justify-between items-center p-4 rounded shadow ${
                presencas.has(aluno.id) ? 'bg-green-600' : 'bg-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <span>{aluno.nome}</span>
              <button
                onClick={() => togglePresenca(aluno.id)}
                className="bg-black/20 px-3 py-1 rounded hover:bg-black/40"
              >
                {presencas.has(aluno.id) ? 'Remover' : 'Marcar'}
              </button>
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="mt-6 text-center">
        <button
          className="bg-blue-600 hover:bg-blue-800 px-6 py-2 rounded"
          onClick={() => router.push('/aulas')}
        >
          Voltar para Aulas
        </button>
      </div>
    </div>
  )
}