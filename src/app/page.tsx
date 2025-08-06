'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import rawApi from '@/lib/rawApi'
import { ToastContainer, toast } from 'react-toastify'
import { motion } from 'framer-motion'
import 'react-toastify/dist/ReactToastify.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [tenants, setTenants] = useState<any[]>([])
  const [logoUrl, setLogoUrl] = useState<string>('')

  const router = useRouter()

  useEffect(() => {
    rawApi.get('/tenants')
      .then(res => {
        console.log('Tenants recebidos:', res.data)
        setTenants(res.data)
      })
      .catch(() => toast.error('Erro ao carregar academias'))
  }, [])

  useEffect(() => {
    const tenant = tenants.find(t => t.id === tenantId)
    setLogoUrl(tenant?.logoUrl ?? '')
  }, [tenantId, tenants])

  const handleLogin = async () => {
    if (!tenantId || !email || !password) {
      toast.error('Preencha todos os campos!')
      return
    }

    try {
      const res = await rawApi.post('/auth/signin', { email, password })

      const { access_token, refresh_token, tenant } = res.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('tenant_id', tenant.id)
      localStorage.setItem('tenant_name', tenant.name)
      localStorage.setItem('tenant_logo', tenant.logoUrl)

      toast.success(`Bem-vindo à ${tenant.name}!`)
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch {
      toast.error('Email ou senha inválidos!')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black relative overflow-hidden">
      <ToastContainer />
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        style={{
          backgroundImage: "url('/jiujitsu-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60" />

      <motion.div
        className="z-10 flex flex-col items-center justify-center bg-white/90 rounded-lg shadow-2xl p-8 w-full max-w-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Logo da Academia" className="w-24 h-24 rounded-full shadow-lg mb-4" />
        ) : (
          <div className="w-24 h-24 rounded-full shadow-lg mb-4 bg-gray-300 flex items-center justify-center">
            <span className="text-sm">Sem Logo</span>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4 text-black">Bem-vindo ao Portal</h1>

        <select
          className="border border-gray-400 p-2 mb-4 w-full text-black rounded"
          value={tenantId}
          onChange={e => setTenantId(e.target.value)}
        >
          <option value="">Selecione sua academia</option>
          {tenants.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <input
          className="border border-gray-400 p-2 mb-4 w-full text-black rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border border-gray-400 p-2 mb-4 w-full text-black rounded"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <motion.button
          className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 w-full rounded font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
        >
          Entrar
        </motion.button>
      </motion.div>
    </div>
  )
}