import axios from 'axios'
import type { PredictionPayload, PredictionResult } from '../types'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
})

export const predictRisk = (payload: PredictionPayload) =>
  apiClient.post<PredictionResult>('/predict', payload)

export default apiClient
