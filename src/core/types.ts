// Tipos compartidos

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
