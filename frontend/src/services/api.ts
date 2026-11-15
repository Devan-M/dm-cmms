// frontend/src/services/api.ts

import axios, { AxiosRequestConfig, Method } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Instância configurada do Axios para comunicação com o backend
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para anexar automaticamente o token JWT salvo no localStorage
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dm_cmms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de resposta para extrair mensagens de erro da API de forma padronizada
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensagem =
      error.response?.data?.mensagem ||
      error.response?.data?.error ||
      error.message ||
      'Ocorreu um erro na requisição';
    return Promise.reject(new Error(mensagem));
  }
);

interface RequestOptions extends AxiosRequestConfig {
  data?: any;
  method?: Method | string;
}

/**
 * Função utilitária para manter compatibilidade com as chamadas existentes
 * e suportar requisições genéricas usando Axios
 */
export async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', data, ...restConfig } = options;

  const response = await api.request<T>({
    url: endpoint,
    method: method as Method,
    data,
    ...restConfig,
  });

  return response.data;
}

export default api;
