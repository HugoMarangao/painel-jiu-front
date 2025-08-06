'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Alunos', path: '/alunos' },
  { label: 'Instrutores', path: '/instrutores' },
  { label: 'Aulas', path: '/aulas' },
  { label: 'Relatórios', path: '/relatorios' },
  { label: 'Superadmin', path: '/superadmin' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [tenantLogo, setTenantLogo] = useState<string | null>(null)
  const [tenantName, setTenantName] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const logo = localStorage.getItem('tenant_logo')
    const name = localStorage.getItem('tenant_name')
    setTenantLogo(logo)
    setTenantName(name)
  }, [])

  // if (tenantLogo === null || tenantName === null) {
  //   // Pode exibir um spinner ou só um placeholder
  //   return <div className="text-center p-8 text-white">Carregando...</div>
  // }

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setOpen(false)}
        />
      )}

      <motion.div
        className={`fixed top-0 left-0 h-full bg-black/80 backdrop-blur-md z-20 p-4 w-64 shadow-lg transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } transition-transform`}
        animate={{ x: open ? 0 : -300 }}
      >
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            {tenantLogo ? (
              <img src={tenantLogo} className="w-10 h-10 rounded-full mr-2" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500 mr-2" />
            )}
            <h2 className="font-bold">{tenantName}</h2>
          </div>
          <button onClick={() => setOpen(false)} className="text-2xl font-bold">×</button>
        </div>
        <nav>
          {menuItems.map(item => (
            <div
              key={item.path}
              className={`cursor-pointer p-2 rounded hover:bg-white/20 ${
                pathname === item.path ? 'bg-white/20' : ''
              }`}
              onClick={() => {
                router.push(item.path)
                setOpen(false)
              }}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </motion.div>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-black/70 p-4 shadow-md">
          <button onClick={() => setOpen(!open)} className="text-2xl font-bold">☰</button>
          <h1 className="text-xl font-bold">{tenantName}</h1>
          <button
            className="bg-red-600 hover:bg-red-800 px-4 py-1 rounded"
            onClick={() => {
              localStorage.clear()
              router.push('/')
            }}
          >
            Sair
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
