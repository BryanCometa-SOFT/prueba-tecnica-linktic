// Tests del mock de pagos: verifica CRUD básico y toggle de estado
import {
  getAll,
  create,
  update,
  toggleStatus,
  __resetData,
} from '../payments';

beforeEach(() => {
  __resetData();
});

describe('payments API mock', () => {
  it('getAll retorna todos los métodos de pago', async () => {
    const result = await getAll();
    expect(result).toHaveLength(8);
    expect(result[0]!.name).toBe('Visa Corporativa');
  });

  it('create agrega un nuevo método al inicio', async () => {
    await create({ name: 'Efectivo', type: 'cash' });
    const all = await getAll();
    expect(all).toHaveLength(9);
    expect(all[0]!.name).toBe('Efectivo');
  });

  it('update modifica los campos de un método existente', async () => {
    const updated = await update('1', { name: 'Visa Actualizada' });
    expect(updated!.name).toBe('Visa Actualizada');
  });

  it('toggleStatus cambia isActive de true a false', async () => {
    const result = await toggleStatus('1');
    expect(result!.isActive).toBe(false);
  });
});
