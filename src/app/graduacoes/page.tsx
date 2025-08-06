'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '@/lib/axios'

export default function GraduacoesPage() {
  const [graduacoes, setGraduacoes] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const limit = 6

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null

  const fetchGraduacoes = async (searchTerm = '', pageNum = 1) => {
    try {
      const res = await api.get('/graduacoes', {
        params: {
          search: searchTerm,
          skip: (pageNum - 1) * limit,
          limit,
        },
      })

      const allItems = res.data.items ?? res.data
      const graduacoesFiltradas = allItems.filter((g: any) => g.tenantId === tenantId)

      setGraduacoes(graduacoesFiltradas)
      setTotalPages(Math.ceil((res.data.total ?? graduacoesFiltradas.length) / limit))
    } catch (err) {
      console.error('Erro ao buscar graduações:', err)
      toast.error('Erro ao carregar graduações')
    }
  }

  useEffect(() => {
    fetchGraduacoes(search, page)
  }, [search, page])

  const handleSearch = debounce((value: string) => {
    setSearch(value)
    setPage(1)
  }, 500)

  return (
    <div className="p-8 text-white">
      <ToastContainer />
      <motion.h1
        className="text-4xl font-bold text-center mb-6"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Progressão de Faixas
      </motion.h1>

      <div className="flex justify-between items-center mb-6">
        <input
          className="border p-2 rounded w-1/2 bg-white text-black placeholder-gray-500 dark:bg-white/10 dark:text-white dark:placeholder-white"
          placeholder="Buscar por aluno ou faixa"
          onChange={e => handleSearch(e.target.value)}
        />
        <button
          className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded"
          onClick={() => router.push('/graduacoes/nova')}
        >
          Nova Graduação
        </button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { delayChildren: 0.3, staggerChildren: 0.1 },
          },
        }}
      >
        {graduacoes.length > 0 ? (
          graduacoes.map((grad: any) => (
            <motion.div
              key={grad.id}
              className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-md cursor-pointer hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push(`/graduacoes/${grad.id}/edit`)}
            >
              <h3 className="text-xl font-bold">{grad.aluno?.nome ?? 'Aluno N/A'}</h3>
              <p>Faixa: {grad.faixa}</p>
              <p>Grau: {grad.grau}</p>
              <p>Data: {new Date(grad.data).toLocaleDateString()}</p>
              {grad.observacao && <p>Obs: {grad.observacao}</p>}
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-3">Nenhuma graduação encontrada.</p>
        )}
      </motion.div>

      {/* Paginação */}
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