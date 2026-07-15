import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, logout as apiLogout, getStoredSession } from '@/core/api/auth';
import { notify } from '@/shared/utils/notify';
import type { User } from '@/core/types';

// Store de autenticacion: maneja sesion, login y logout
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  // Restaura sesion desde localStorage al iniciar la app
  function restoreSession() {
    const s = getStoredSession();
    if (s) {
      user.value = s.user;
      token.value = s.token;
    }
  }

  // Envia credenciales al servicio mock
  async function login(creds: { email: string; password: string }) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await apiLogin(creds.email, creds.password);
      user.value = res.user;
      token.value = res.token;
      notify('Sesion iniciada correctamente', 'positive');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      error.value = msg;
      notify(msg, 'negative');
    } finally {
      isLoading.value = false;
    }
  }

  // Cierra sesion y limpia estado
  async function logout() {
    await apiLogout();
    user.value = null;
    token.value = null;
    error.value = null;
    notify('Sesion cerrada', 'positive');
  }

  return { user, token, isLoading, error, isAuthenticated, restoreSession, login, logout };
});
