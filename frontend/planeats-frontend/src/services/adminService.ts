import { getAuthHeader } from './authService';
import type { Usuario } from '../interfaces/Usuario';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const ADMIN_BASE = `${API_BASE_URL}/api/admin/users`;

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

export async function listarTodosUsuarios(): Promise<Usuario[]> {
  const res = await fetch(ADMIN_BASE, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return parseOrThrow(res);
}

export async function buscarUsuarioPorId(id: number): Promise<Usuario> {
  const res = await fetch(`${ADMIN_BASE}/${id}`, {
    method: 'GET',
    headers: getAuthHeader(),
  });
  return parseOrThrow(res);
}

export async function deletarUsuario(id: number): Promise<void> {
  const res = await fetch(`${ADMIN_BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  
  if (!res.ok) {
    await parseOrThrow(res);
  }
}

export const adminService = {
  listarTodosUsuarios,
  buscarUsuarioPorId,
  deletarUsuario,
};