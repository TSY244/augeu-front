import axios, { AxiosResponse } from 'axios'
import { LoginResponse, EventResponse, GetClientsResponse } from '../types/api'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1', // 直接使用完整后端地址
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(config => {
  // 从cookie获取token
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('Authorization='))
    ?.split('=')[1]
  
  // 调试模式特殊处理
  const debugMode = localStorage.getItem('debugMode') === 'true'
  if (debugMode) {
    const debugToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('Authorization='))
      ?.split('=')[1]
    if (debugToken) {
      config.headers.Authorization = debugToken
    }
    return config
  }

  // 正常模式使用登录返回的JWT
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 登录成功时保存JWT到cookie
    if (response.config.url?.includes('/login') && response.data?.jwt) {
      document.cookie = `Authorization=${response.data.jwt}; path=/; max-age=86400` // 1天有效期
    }
    return response.data
  },
  error => {
    if (error.response?.status === 401) {
      // 清除认证信息
      document.cookie = 'Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      localStorage.removeItem('debugMode')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default {
  login(credentials: { name: string; password: string; secrete: string }): Promise<LoginResponse> {
    return api.post('/login', credentials)
  },
  getEvents<T>(type: string, query: object): Promise<EventResponse<T>> {
    return api.post(`/get/${type}Event`, query)
  },
  async getClientInfo(): Promise<GetClientsResponse> {
    try {
      console.log('Current cookies:', document.cookie) // 调试cookie
      const response = await api.get('/get/clients', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': localStorage.getItem('token')
        }
      })
      console.log('API Response:', response) // 调试响应
      if (!response.data.clients) {
        throw new Error('Invalid response format: missing clients field')
      }
      return response.data
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }
}
