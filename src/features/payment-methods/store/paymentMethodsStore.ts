import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as api from '@/core/api/payments';
import { notify } from '@/shared/utils/notify';
import type { PaymentMethod } from '@/core/types';

// Store de métodos de pago: CRUD completo con datos mock
export const usePaymentMethodsStore = defineStore('paymentMethods', () => {
  const list = ref<PaymentMethod[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Carga la lista completa desde el mock
  async function fetchAll() {
    isLoading.value = true;
    error.value = null;
    try {
      list.value = await api.getAll();
    } catch {
      const msg = 'Error al cargar métodos de pago';
      error.value = msg;
      notify(msg, 'negative');
    } finally {
      isLoading.value = false;
    }
  }

  // Crea un nuevo método de pago
  async function create(data: { name: string; type: string; description?: string }) {
    isLoading.value = true;
    error.value = null;
    try {
      const nuevo = await api.create(data);
      list.value = [nuevo, ...list.value];
      notify('Método de pago creado', 'positive');
    } catch {
      const msg = 'Error al crear método de pago';
      error.value = msg;
      notify(msg, 'negative');
    } finally {
      isLoading.value = false;
    }
  }

  // Actualiza un método de pago existente
  async function update(id: string, cambios: Partial<PaymentMethod>) {
    isLoading.value = true;
    error.value = null;
    try {
      const actualizado = await api.update(id, cambios);
      if (actualizado) {
        const i = list.value.findIndex((p) => p.id === id);
        if (i !== -1) list.value[i] = actualizado;
      }
      notify('Método de pago actualizado', 'positive');
    } catch {
      const msg = 'Error al actualizar método de pago';
      error.value = msg;
      notify(msg, 'negative');
    } finally {
      isLoading.value = false;
    }
  }

  // Elimina un método de pago
  async function remove(id: string) {
    isLoading.value = true;
    error.value = null;
    try {
      await api.remove(id);
      list.value = list.value.filter((p) => p.id !== id);
      notify('Método de pago eliminado', 'positive');
    } catch {
      const msg = 'Error al eliminar método de pago';
      error.value = msg;
      notify(msg, 'negative');
    } finally {
      isLoading.value = false;
    }
  }

  async function toggleStatus(id: string) {
    const i = list.value.findIndex((p) => p.id === id);
    if (i === -1) return;
    const previous = list.value[i]!;
    const nuevoEstado = !previous.isActive;
    isLoading.value = true;
    error.value = null;
    list.value[i] = { ...previous, isActive: nuevoEstado };
    try {
      await api.toggleStatus(id);
      notify(`Método de pago ${nuevoEstado ? 'activado' : 'desactivado'}`, 'positive');
    } catch {
      list.value[i] = previous;
      notify('Error al cambiar estado', 'negative');
    } finally {
      isLoading.value = false;
    }
  }

  return { list, isLoading, error, fetchAll, create, update, remove, toggleStatus };
});
