'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const limit = 6

  const fetchAlunos = async (searchTerm = '', pageNum = 1) => {
    try {
      const res = await api.get('/alunos', {
        params: {
          search: searchTerm,
          limit,
          skip: (pageNum - 1) * limit
        }
      })

      setAlunos(res.data.items)
      setTotalPages(Math.ceil(res.data.total / limit))
    } catch (err: any) {
      console.error('Erro ao buscar alunos', err)
      toast.error('Erro ao buscar alunos.')
    }
  }

  useEffect(() => {
    fetchAlunos(search, page)
  }, [page, search])

  const handleSearch = debounce((value: string) => {
    setSearch(value)
    setPage(1)
  }, 500)

  return (
    <div className="p-8 text-white">
      <motion.h1
        className="text-4xl font-extrabold mb-6 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Alunos
      </motion.h1>

      <div className="flex justify-between items-center mb-4">
        <input
          className="border p-2 rounded w-1/2 bg-white text-black placeholder-gray-500 dark:bg-white/10 dark:text-white dark:placeholder-white"
          placeholder="Buscar por nome, faixa ou telefone"
          onChange={e => handleSearch(e.target.value)}
        />

        <button
          className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded"
          onClick={() => router.push('/alunos/novo')}
        >
          Novo Aluno
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: { delayChildren: 0.3, staggerChildren: 0.1 } }
        }}
      >
        {alunos.map(aluno => (
          <motion.div
            key={aluno.id}
            className="bg-white/10 p-4 rounded-lg shadow-lg cursor-pointer backdrop-blur-md hover:scale-105 transition-transform"
            whileHover={{ scale: 1.1 }}
          >
            <h3 className="text-xl font-bold">{aluno.nome}</h3>
            <p>Faixa: {aluno.faixaAtual ?? 'N/A'}</p>
            <p>Telefone: {aluno.telefone ?? 'N/A'}</p>
            <div className="flex justify-between mt-2">
              <button
                className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-700"
                onClick={() => router.push(`/alunos/${aluno.id}/perfil`)}
              >
                Ver Perfil
              </button>
              <button
                className="bg-yellow-500 px-3 py-1 rounded text-sm hover:bg-yellow-700"
                onClick={() => router.push(`/alunos/${aluno.id}`)}
              >
                Editar
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-800 disabled:bg-gray-500"
        >
          Anterior
        </button>
        <span className="px-2">{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-800 disabled:bg-gray-500"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}