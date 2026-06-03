import axios from 'axios'

const API_PORT = import.meta.env.VITE_API_PORT || '5001'
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost'
const axiosInstance = axios.create({
  baseURL: `${API_HOST}:${API_PORT}/api`,
  withCredentials: true,
})

export default axiosInstance
