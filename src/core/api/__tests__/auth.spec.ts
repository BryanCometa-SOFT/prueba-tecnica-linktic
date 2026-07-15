// Tests del mock de autenticación: login válido, login inválido y logout
import { login, logout } from '../auth';

beforeEach(() => {
  localStorage.clear();
});

describe('auth API mock', () => {
  it('login retorna usuario y token con credenciales válidas', async () => {
    const result = await login('admin@linktic.com', 'admin123');
    expect(result.user.email).toBe('admin@linktic.com');
    expect(result.token).toContain('tok-');
  });

  it('login lanza error con credenciales inválidas', async () => {
    await expect(login('wrong@email.com', 'admin123')).rejects.toThrow(
      'Credenciales invalidas',
    );
  });

  it('logout limpia localStorage', async () => {
    await login('admin@linktic.com', 'admin123');
    await logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
