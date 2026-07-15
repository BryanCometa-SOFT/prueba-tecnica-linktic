// Servicio mock de autenticacion
import type { User } from '@/core/types';

const MOCK_EMAIL = 'admin@linktic.com';
const MOCK_PASSWORD = 'admin123';
const MOCK_USER: User = { id: 'u-001', name: 'Administrador', email: MOCK_EMAIL, role: 'admin' };

// Recupera sesion del localStorage si existe
export function getStoredSession(): { token: string; user: User } | null {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (!token || !user) return null;
  return { token, user: JSON.parse(user) as User };
}

// Valida credenciales contra mock y persiste sesion
export async function login(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  await new Promise((r) => setTimeout(r, 600));
  if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
    throw new Error('Credenciales invalidas');
  }
  const token = 'tok-' + Date.now();
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(MOCK_USER));
  return { user: MOCK_USER, token };
}

// Limpia sesion de localStorage
export async function logout(): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
