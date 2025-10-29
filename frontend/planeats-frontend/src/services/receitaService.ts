import type { ReceitaRequest } from '../interfaces/ReceitaRequest';
import type { ReceitaResponse } from '../interfaces/ReceitaResponse';
import { getAuthHeader } from './authService';

const API_URL = 'http://localhost:8080/api/receitas';

async function parseOrThrow(res: Response) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return data;
}

export const receitaService = {
  gerarReceita: async (data: ReceitaRequest): Promise<ReceitaResponse> => {
    const res = await fetch(`${API_URL}/gerar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      const message = errorData?.error || errorData?.message || `${res.status} ${res.statusText}`;
      throw new Error(message);
    }
    return parseOrThrow(res);
  },

  listarMinhasReceitas: async (): Promise<ReceitaResponse[]> => {
    const res = await fetch(`${API_URL}/minhas`, {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
      },
    });
    return parseOrThrow(res);
  },

  buscarReceita: async (id: number): Promise<ReceitaResponse> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
      },
    });
    return parseOrThrow(res);
  },

  deletarReceita: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });
    return parseOrThrow(res);
  }
};