// Tests de formateo: fechas y moneda en null/undefined/válidos
import { formatDate, formatCurrency } from '../useFormat';

describe('formatDate', () => {
  it('formatea una fecha ISO válida', () => {
    expect(formatDate('2025-06-20T14:45:00')).toBe('2025-06-20 2:45 PM');
  });

  it('retorna "-" para valores nulos', () => {
    expect(formatDate(null)).toBe('-');
    expect(formatDate(undefined)).toBe('-');
  });
});

describe('formatCurrency', () => {
  it('formatea un número con símbolo de moneda', () => {
    expect(formatCurrency(1234567)).toContain('$');
  });
});
