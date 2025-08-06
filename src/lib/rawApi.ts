import axios from 'axios'

const rawApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
})

// 🔒 Apenas para chamadas SEM token
export const login = (email: string, password: string) =>
  rawApi.post('/auth/signin', { email, password })

export default rawApi