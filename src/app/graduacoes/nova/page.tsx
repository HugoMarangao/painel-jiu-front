'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '@/lib/axios'

export default function NovaGraduacaoPage() {
  const [alunos, setAlunos] = useState<any[]>([])
  const [alunoId, setAlunoId] = useState('')
  const [faixa, setFaixa] = useState('')
  const [grau, setGrau] = useState<number>(0)
  const [data, setData] = useState('')
  const [observacao, setObservacao] = useState('')
  const router = useRouter()

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null

  useEffect(() => {
    fetchAlunos()
  }, [])

  const fetchAlunos = async () => {
    try {
      const res = await api.get('/alunos')
      const resultado = Array.isArray(res.data) ? res.data : res.data.items ?? []
      const filtrados = resultado.filter((a: any) => a.tenantId === tenantId)
      setAlunos(filtrados)
    } catch (err) {
      console.error('Erro ao carregar alunos', err)
      toast.error('Erro ao buscar alunos')
      setAlunos([]) // fallback para evitar crash
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      await api.post('/graduacoes', {
        alunoId,
        faixa,
        grau,
        data,
        observacao,
      })

      toast.success('Graduação cadastrada com sucesso!')
      setTimeout(() => router.push('/graduacoes'), 1500)
    } catch (err) {
      console.error('Erro ao cadastrar graduação', err)
      toast.error('Erro ao cadastrar graduação')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Nova Graduação</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Aluno</label>
          <select
            value={alunoId}
            onChange={(e) => setAlunoId(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white"
            required
          >
            <option value="">Selecione um aluno</option>
            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Faixa</label>
          <input
            type="text"
            value={faixa}
            onChange={(e) => setFaixa(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Grau</label>
          <input
            type="number"
            value={grau}
            onChange={(e) => setGrau(Number(e.target.value))}
            className="w-full p-2 rounded bg-white/10 text-white"
            min={0}
            max={4}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Observação (opcional)</label>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="w-full p-2 rounded bg-white/10 text-white"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-800 p-2 rounded font-bold"
        >
          Cadastrar Graduação
        </button>
      </form>
    </div>
  )
}