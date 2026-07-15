// Tests del store de métodos de pago: fetchAll, create, remove y toggleStatus
import { setActivePinia, createPinia } from 'pinia';
import { usePaymentMethodsStore } from '../paymentMethodsStore';
import type { PaymentMethod } from '@/core/types';

jest.mock('@/core/api/payments', () => ({
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  toggleStatus: jest.fn(),
}));

jest.mock('@/shared/utils/notify', () => ({
  notify: jest.fn(),
}));

import { getAll as mockGetAll, create as mockCreate, toggleStatus as mockToggleStatus } from '@/core/api/payments';

const makeItem = (overrides: Partial<PaymentMethod> = {}): PaymentMethod => ({
  id: '1',
  name: 'Test',
  type: 'cash',
  description: null,
  isActive: true,
  createdAt: '2025-01-01T00:00:00',
  updatedAt: '2025-01-01T00:00:00',
  ...overrides,
});

describe('paymentMethodsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    jest.clearAllMocks();
  });

  it('fetchAll carga la lista de métodos', async () => {
    jest.mocked(mockGetAll).mockResolvedValue([makeItem()]);
    const store = usePaymentMethodsStore();
    await store.fetchAll();
    expect(store.list).toHaveLength(1);
    expect(store.isLoading).toBe(false);
  });

  it('create agrega un método al inicio de la lista', async () => {
    jest.mocked(mockGetAll).mockResolvedValue([makeItem({ id: '0' })]);
    jest.mocked(mockCreate).mockResolvedValue(makeItem({ id: 'new', name: 'Nuevo' }));
    const store = usePaymentMethodsStore();
    await store.fetchAll();
    await store.create({ name: 'Nuevo', type: 'cash' });
    expect(store.list[0]!.name).toBe('Nuevo');
    expect(store.list).toHaveLength(2);
  });

  it('remove elimina un método de la lista', async () => {
    jest.mocked(mockGetAll).mockResolvedValue([makeItem({ id: '1' }), makeItem({ id: '2' })]);
    const store = usePaymentMethodsStore();
    await store.fetchAll();
    await store.remove('1');
    expect(store.list).toHaveLength(1);
    expect(store.list[0]!.id).toBe('2');
  });

  it('toggleStatus cambia el estado optimistically', async () => {
    jest.mocked(mockGetAll).mockResolvedValue([makeItem({ id: '1', isActive: true })]);
    jest.mocked(mockToggleStatus).mockResolvedValue(makeItem({ id: '1', isActive: false }));
    const store = usePaymentMethodsStore();
    await store.fetchAll();
    await store.toggleStatus('1');
    expect(store.list[0]!.isActive).toBe(false);
  });
});
