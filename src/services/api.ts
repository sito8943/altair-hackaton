import axios from "axios";
import type { PredictionPayload, PredictionResult } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://laurinda-unterrified-magali.ngrok-free.dev/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

const toSnakeCase = (key: string) =>
  key.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);

const serializePayload = (payload: PredictionPayload) => {
  const serialized: Record<string, string> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    const normalizedKey = key.includes("_") ? key : toSnakeCase(key);
    serialized[normalizedKey] = `${value}`;
  });
  return serialized;
};

export const predictRisk = (payload: PredictionPayload) =>
  apiClient.post<PredictionResult>("/predict", serializePayload(payload));

export const checkApiHealth = () =>
  apiClient.get<{ status: string }>("/health");

export default apiClient;
