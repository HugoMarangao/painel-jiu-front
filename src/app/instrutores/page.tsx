'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import api from '@/lib/axios'

export default function InstrutoresPage() {
  const router = useRouter()
  const [instrutores, setInstrutores] = useState<any[]>([])
  const [filtro, setFiltro] = useState('')
  const [pagina, setPagina] = useState(1)
  const porPagina = 6

  useEffect(() => {
    const fetchInstrutores = async () => {
      try {
        const res = await api.get('/instrutores')
        const tenantId = localStorage.getItem('tenant_id')

        const filtrados = res.data.filter(
          (instrutor: any) => instrutor.tenantId === tenantId
        )

        console.log('📦 Instrutores filtrados por tenant:', filtrados)
        setInstrutores(filtrados)
      } catch (err) {
        console.error('❌ Erro ao buscar instrutores:', err)
        toast.error('Erro ao buscar instrutores.')
      }
    }

    fetchInstrutores()
  }, [])

  const instrutoresFiltrados = instrutores.filter((instrutor) =>
    instrutor.nome.toLowerCase().includes(filtro.toLowerCase())
  )

  const totalPaginas = Math.ceil(instrutoresFiltrados.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const instrutoresPaginados = instrutoresFiltrados.slice(inicio, inicio + porPagina)

  console.log(`📑 Total páginas: ${totalPaginas}, Página atual: ${pagina}`)

  return (
    <div className="p-8 text-white">
      <motion.h1
        className="text-4xl font-extrabold mb-6 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Instrutores
      </motion.h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por nome..."
          className="bg-white/10 border border-white/20 px-4 py-2 rounded-md text-white placeholder-white"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <button
          onClick={() => router.push('/instrutores/novo')}
          className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded"
        >
          Novo Instrutor
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
        {instrutoresPaginados.map((instrutor) => (
          <motion.div
            key={instrutor.id}
            className="bg-white/10 p-4 rounded-lg shadow-lg backdrop-blur-md hover:scale-105 transition-transform cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push(`/instrutores/${instrutor.id}`)}
          >
            <h3 className="text-xl font-bold">{instrutor.nome}</h3>
            <p>Email: {instrutor.email || 'Não informado'}</p>
            <p>Telefone: {instrutor.telefone || 'Não informado'}</p>
          </motion.div>
        ))}
      </motion.div>

      {totalPaginas > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            disabled={pagina === 1}
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-white/20 text-white rounded disabled:opacity-30"
          >
            Anterior
          </button>
          <span>Página {pagina} de {totalPaginas}</span>
          <button
            disabled={pagina === totalPaginas}
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            className="px-3 py-1 bg-white/20 text-white rounded disabled:opacity-30"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}