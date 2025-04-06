import axios, { AxiosResponse } from 'axios'
import { LoginResponse, EventResponse, GetClientsResponse } from '../types/api'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080/api/v1', // 请替换为实际的API服务器地址
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
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
  getClientInfo(): Promise<GetClientsResponse> {
    return api.get('/get/clients')
  }
}
