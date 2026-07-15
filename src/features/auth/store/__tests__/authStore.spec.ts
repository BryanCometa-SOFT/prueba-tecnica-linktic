// Tests del store de autenticación: flujo de login, manejo de errores y logout
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../authStore';

jest.mock('@/core/api/auth', () => ({
  login: jest.fn(),
  logout: jest.fn(),
  getStoredSession: jest.fn(),
}));

jest.mock('@/shared/utils/notify', () => ({
  notify: jest.fn(),
}));

import { login as mockLogin } from '@/core/api/auth';

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('login guarda usuario y token al autenticar', async () => {
    jest.mocked(mockLogin).mockResolvedValue({
      user: { id: 'u-1', name: 'Test', email: 'test@test.com', role: 'admin' },
      token: 'tok-123',
    });
    const store = useAuthStore();
    await store.login({ email: 'test@test.com', password: 'pass' });
    expect(store.user!.email).toBe('test@test.com');
    expect(store.token).toBe('tok-123');
    expect(store.isAuthenticated).toBe(true);
  });

  it('login maneja errores correctamente', async () => {
    jest.mocked(mockLogin).mockRejectedValue(new Error('Credenciales invalidas'));
    const store = useAuthStore();
    await store.login({ email: 'bad@test.com', password: 'wrong' });
    expect(store.isAuthenticated).toBe(false);
    expect(store.error).toBe('Credenciales invalidas');
  });

  it('logout limpia el estado del usuario', async () => {
    jest.mocked(mockLogin).mockResolvedValue({
      user: { id: 'u-1', name: 'T', email: 'a@b.com', role: 'admin' },
      token: 'tok-1',
    });
    const store = useAuthStore();
    await store.login({ email: 'a@b.com', password: 'p' });
    await store.logout();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
  });
});
