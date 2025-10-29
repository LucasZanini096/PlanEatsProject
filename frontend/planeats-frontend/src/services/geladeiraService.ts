import { getAuthHeader } from './authService';
import type { ItemGeladeira } from '../interfaces/ItemGeladeira';
import type { AdicionarIngrediente } from '../interfaces/AdicionarIngrediente';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const GELADEIRA_BASE = `${API_BASE_URL}/api/geladeira`;

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

// ...existing code...

export async function adicionarIngrediente(
  dto: AdicionarIngrediente
): Promise<ItemGeladeira> {
  const res = await fetch(GELADEIRA_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // ADICIONAR ESTA LINHA
      ...getAuthHeader(),
    },
    body: JSON.stringify(dto),
  });
  console.log('Response status:', res.status);
  return parseOrThrow(res);
}

// ...existing code...

export async function minhaGeladeira(): Promise<ItemGeladeira[]> {
  const res = await fetch(`${GELADEIRA_BASE}/minha`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  
  console.log('Response status:', res.status);
  const data = await parseOrThrow(res);
  console.log('Dados recebidos:', data);
  return data;
}

export async function listarPorUsuario(usuarioId: number): Promise<ItemGeladeira[]> {
  const res = await fetch(`${GELADEIRA_BASE}/usuario/${usuarioId}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return parseOrThrow(res);
}

export async function incrementarQuantidade(
  geladeiraId: number
): Promise<ItemGeladeira> {
  const res = await fetch(`${GELADEIRA_BASE}/${geladeiraId}/incrementar`, {
    method: 'PATCH',
    headers: getAuthHeader(),
  });
  return parseOrThrow(res);
}

export async function decrementarQuantidade(
  geladeiraId: number
): Promise<ItemGeladeira | string> {
  const res = await fetch(`${GELADEIRA_BASE}/${geladeiraId}/decrementar`, {
    method: 'PATCH',
    headers: getAuthHeader(),
  });
  return parseOrThrow(res);
}

export async function removerIngrediente(geladeiraId: number): Promise<void> {
  const res = await fetch(`${GELADEIRA_BASE}/${geladeiraId}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  return parseOrThrow(res);
}

export const geladeiraService = {
  adicionarIngrediente,
  minhaGeladeira,
  listarPorUsuario,
  incrementarQuantidade,
  decrementarQuantidade,
  removerIngrediente,
};