// src/lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://apisite.pzdev.com.br/api',
  withCredentials: true, // manda os cookies
})

export default api
