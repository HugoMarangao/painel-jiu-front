import axios from 'axios'

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
})

// ✅ Interceptor para adicionar token e tenant nos headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  const tenantId = localStorage.getItem('tenant_id')

  if (token) config.headers['Authorization'] = `Bearer ${token}`
  if (tenantId) config.headers['x-tenant-id'] = tenantId

  return config
})

// ✅ Interceptor para refresh token automático
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token
              resolve(api(originalRequest))
            },
            reject: (err: any) => reject(err),
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refresh_token = localStorage.getItem('refresh_token')
        const access_token = localStorage.getItem('access_token')
        const userId = JSON.parse(atob(access_token!.split('.')[1])).sub

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/refresh`,
          { userId, refresh_token }
        )

        const newAccessToken = res.data.access_token
        localStorage.setItem('access_token', newAccessToken)
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken
        processQueue(null, newAccessToken)

        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        localStorage.clear()
        window.location.href = '/'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api