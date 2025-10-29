import type { LoginRequest } from '../interfaces/LoginRequest';
import type { LoginResponse } from '../interfaces/LoginResponse';
import type { RegisterRequest } from '../interfaces/RegisterRequest';
import type { Usuario } from '../interfaces/Usuario';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const AUTH_BASE = `${API_BASE_URL}/api/auth`;

const TOKEN_KEY = 'authToken';



function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeader(): Record<string, string> | undefined {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

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

export async function signup(payload: RegisterRequest) {
  const res = await fetch(`${AUTH_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return parseOrThrow(res); // retorna o usuário criado (DTO sem senha)
}

export async function signin(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_BASE}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data: LoginResponse = await parseOrThrow(res);

  // guarda apenas o token, Authorization monta o "Bearer " automaticamente
  if (data?.token) setToken(data.token);

  return data;
}

export async function logout(): Promise<void> {
  try {
    const res = await fetch(`${AUTH_BASE}/logout`, {
      method: 'POST',
      headers: authHeader(),
    });
    

    // Mesmo se der 400/401, limpar o token local
    if (!res.ok) await parseOrThrow(res);
    
  } finally {
    clearToken();
  }
}

export async function getCurrentUser(): Promise<Usuario | null> {
  const token = getToken();
  if (!token) return null;
  
  const res = await fetch(`${AUTH_BASE}/myinfo`, {
    method: 'GET',
    headers: authHeader(),
  });
  return parseOrThrow(res);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getAuthHeader(): Record<string, string> {
  return authHeader() ?? {};
}

export const authService = {
  signup,
  signin,
  logout,
  isAuthenticated,
  getAuthHeader,
  getToken,
  setToken,
  clearToken,
  getCurrentUser
};