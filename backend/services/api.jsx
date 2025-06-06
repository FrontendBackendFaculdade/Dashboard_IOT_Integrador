import axios from 'axios';

const API_URL = 'http://seu-ip-local:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const getRegistros = async () => {
  try {
    const response = await api.get('/registros');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    throw error;
  }
};

// Adicione mais funções conforme necessário

export default api;