import { getAuthHeader } from './authService';
import type { Ingrediente } from '../interfaces/Ingrediente'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const INGREDIENTE_BASE = `${API_BASE_URL}/api/ingredientes`;

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

export async function criarIngrediente(nome: string): Promise<Ingrediente> {
  const res = await fetch(INGREDIENTE_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ nome }),
  });
  return parseOrThrow(res);
}

export async function listarIngredientes(): Promise<Ingrediente[]> {
  const res = await fetch(INGREDIENTE_BASE, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return parseOrThrow(res);
}

export async function deletarIngrediente(id: number): Promise<void> {
  const res = await fetch(`${INGREDIENTE_BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  await parseOrThrow(res);
}

export const ingredienteService = {
  criarIngrediente,
  listarIngredientes,
  deletarIngrediente,
};