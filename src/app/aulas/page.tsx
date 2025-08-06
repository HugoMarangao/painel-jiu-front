'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '@/lib/axios'

export default function AulasPage() {
  const [aulas, setAulas] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const limit = 6

  const fetchAulas = async (searchTerm = '', pageNum = 1) => {
  try {
    const res = await api.get('/aulas', {
      params: { search: searchTerm, limit, skip: (pageNum - 1) * limit }
    })

    setAulas(Array.isArray(res.data) ? res.data : res.data.items)
    setTotalPages(Math.ceil((res.data.total ?? res.data.length) / limit))

  } catch (err) {
    console.error('Erro ao buscar aulas', err)
    toast.error('Erro ao carregar aulas')
  }
}

  useEffect(() => {
    fetchAulas(search, page)
  }, [search, page])

  const handleSearch = debounce((value: string) => {
    setSearch(value)
    setPage(1)
  }, 500)

  return (
    <div className="p-8 text-white">
      <ToastContainer />
      <motion.h1
        className="text-4xl font-extrabold mb-6 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Aulas
      </motion.h1>

      <div className="flex justify-between items-center mb-4">
        <input
          className="border p-2 rounded w-1/2
                     bg-white text-black placeholder-gray-500
                     dark:bg-white/10 dark:text-white dark:placeholder-white"
          placeholder="Buscar por título ou instrutor"
          onChange={e => handleSearch(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded"
          onClick={() => router.push('/aulas/nova')}
        >
          Nova Aula
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
        {aulas && aulas.length > 0 ? (
          aulas.map(aula => (
            <motion.div
              key={aula.id}
              className="bg-white/10 p-4 rounded-lg shadow-lg cursor-pointer backdrop-blur-md hover:scale-105 transition-transform"
              whileHover={{ scale: 1.1 }}
              
            >
              <h3 className="text-xl font-bold">{aula.titulo}</h3>
              <p>Data: {new Date(aula.data).toLocaleDateString()}</p>
              <p>Instrutor: {aula.instrutor?.nome ?? 'N/A'}</p><div className="flex justify-between items-center">
              <button
                className="text-white underline"
                onClick={() => router.push(`/aulas/${aula.id}`)}
              >
                Editar Aula
              </button>
              <button
                className="text-green-400 underline"
                onClick={() => router.push(`/aulas/${aula.id}/presencas`)}
              >
                Ver Presenças
              </button>
            </div>

            </motion.div>
          ))
        ) : (
          <p className="text-center w-full col-span-3">Nenhuma aula cadastrada ainda.</p>
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
