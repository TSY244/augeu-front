import axios, { AxiosResponse } from 'axios'
import { LoginResponse, EventResponse, GetClientsResponse, ClientInfo } from '../types/api'

const api = axios.create({
  baseURL: '/api/v1', //
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(config => {
  // 从 cookie 或 debugMode 取 token（假设 token 存储在 cookie 的 Authorization 字段）
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  let authToken = '';

  authToken = token || '';
  console.log('authToken', authToken);

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 登录成功时保存JWT到cookie
    if (response.config.url?.includes('/login') && response.data?.jwt) {
      document.cookie = `token=${response.data.jwt}; path=/; max-age=86400` // 1天有效期
    }
    return response
  },
  error => {
    if (error.response?.status === 401) {
      // 清除认证信息
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
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
      const response = await api.get<GetClientsResponse> ('/get/clients', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        }
      })

      console.debug('[API Debug] 完整响应对象:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      console.log('API Response:', response) // 调试响应
      console.log('Response Data:', response.data)
      if (!Array.isArray(response.data.clients)) { // ✅ 校验数据字段
        throw new Error('Invalid response format: clients is not an array');
      }
      // response.data.clients.forEach((client: ClientInfo) => {
      //   if (!client.uuid || !client.ip || !Array.isArray(client.ip)) {
      //     throw new Error('Invalid client data: missing required fields');
      //   }
      // })
  
      return response.data
    } catch (error) {
      console.error('API请求失败:', error)
      throw error
    }
  }
}
