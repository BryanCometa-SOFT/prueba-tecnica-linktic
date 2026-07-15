// Servicio mock de metodos de pago
import type { PaymentMethod } from '@/core/types';

// Catalogo de tipos de metodo de pago
export const PAYMENT_TYPES = [
  { value: 'credit_card', label: 'Tarjeta de Credito' },
  { value: 'debit_card', label: 'Tarjeta de Debito' },
  { value: 'bank_transfer', label: 'Transferencia Bancaria' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'digital_wallet', label: 'Billetera Digital' },
  { value: 'other', label: 'Otro' },
];

// Datos de ejemplo
let data: PaymentMethod[] = [
  {
    id: '1',
    name: 'Visa Corporativa',
    type: 'credit_card',
    description: 'Tarjeta corporativa',
    isActive: true,
    createdAt: '2025-01-15',
    updatedAt: '2025-06-20',
  },
  {
    id: '2',
    name: 'Mastercard Premium',
    type: 'credit_card',
    description: 'Tarjeta ejecutiva',
    isActive: true,
    createdAt: '2025-02-10',
    updatedAt: '2025-05-15',
  },
  {
    id: '3',
    name: 'Cuenta Principal',
    type: 'bank_transfer',
    description: null,
    isActive: false,
    createdAt: '2025-03-05',
    updatedAt: '2025-07-01',
  },
  {
    id: '4',
    name: 'Efectivo',
    type: 'cash',
    description: null,
    isActive: true,
    createdAt: '2025-03-20',
    updatedAt: '2025-03-20',
  },
  {
    id: '5',
    name: 'Nequi',
    type: 'digital_wallet',
    description: 'Billetera digital',
    isActive: true,
    createdAt: '2025-04-01',
    updatedAt: '2025-06-28',
  },
  {
    id: '6',
    name: 'Daviplata',
    type: 'digital_wallet',
    description: null,
    isActive: false,
    createdAt: '2025-04-15',
    updatedAt: '2025-06-10',
  },
  {
    id: '7',
    name: 'American Express',
    type: 'credit_card',
    description: 'Viajes internacionales',
    isActive: true,
    createdAt: '2025-05-01',
    updatedAt: '2025-07-10',
  },
  {
    id: '8',
    name: 'Transferencia Secundaria',
    type: 'bank_transfer',
    description: null,
    isActive: true,
    createdAt: '2025-05-20',
    updatedAt: '2025-05-20',
  },
];

// Simula delay de red
function delay(ms = 600) {
  return new Promise((r) => setTimeout(r, ms));
}

// Obtiene todos los metodos de pago
export async function getAll(): Promise<PaymentMethod[]> {
  await delay();
  return [...data];
}

// Obtiene un metodo de pago por id
export async function getById(id: string): Promise<PaymentMethod | null> {
  await delay();
  return data.find((p) => p.id === id) ?? null;
}

// Crea un nuevo metodo de pago
export async function create(item: {
  name: string;
  type: string;
  description?: string;
}): Promise<PaymentMethod> {
  await delay();
  const now = new Date().toISOString();
  const nuevo: PaymentMethod = {
    id: String(Date.now()),
    name: item.name,
    type: item.type,
    description: item.description ?? null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  data = [nuevo, ...data];
  return nuevo;
}

// Actualiza un metodo de pago existente
export async function update(
  id: string,
  cambios: Partial<PaymentMethod>,
): Promise<PaymentMethod | null> {
  await delay();
  const i = data.findIndex((p) => p.id === id);
  if (i === -1) return null;
  const old = data[i]!;
  data[i] = {
    ...old,
    ...cambios,
    id: old.id,
    createdAt: old.createdAt,
    updatedAt: new Date().toISOString(),
  };
  return data[i];
}

// Elimina un metodo de pago por id
export async function remove(id: string): Promise<void> {
  await delay();
  data = data.filter((p) => p.id !== id);
}

// Activa o desactiva un metodo de pago
export async function toggleStatus(id: string): Promise<PaymentMethod | null> {
  await delay();
  const i = data.findIndex((p) => p.id === id);
  if (i === -1) return null;
  const old = data[i]!;
  data[i] = { ...old, isActive: !old.isActive, updatedAt: new Date().toISOString() };
  return data[i];
}
