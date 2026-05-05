import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getOllamaStatus = () => api.get('/ollama/status').then(r => r.data)

export const analyzeShipment = (payload) =>
  api.post('/analyze', payload).then(r => r.data)

export const sendChat = (payload) =>
  api.post('/chat', payload).then(r => r.data)
