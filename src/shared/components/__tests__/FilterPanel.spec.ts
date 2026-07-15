// Tests del FilterPanel: renderizado, emisión de eventos y validación de campos
import { mount } from '@vue/test-utils';
import FilterPanel, { type FilterField } from '../FilterPanel.vue';

const textField: FilterField = { key: 'name', label: 'Nombre', type: 'text' };
const selectField: FilterField = {
  key: 'type',
  label: 'Tipo',
  type: 'select',
  options: [
    { label: 'Credit', value: 'credit_card' },
    { label: 'Cash', value: 'cash' },
  ],
};

function createWrapper(props: { fields: FilterField[]; loading?: boolean }) {
  return mount(FilterPanel, {
    props,
    global: {
      stubs: {
        'q-input': {
          template:
            '<div><label>{{ label }}</label><input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
          props: ['modelValue', 'label', 'outlined', 'dense', 'clearable', 'disable', 'rules', 'type'],
          emits: ['update:modelValue'],
        },
        'q-select': {
          template: '<div><label>{{ label }}</label><select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option></select></div>',
          props: ['modelValue', 'label', 'options', 'outlined', 'dense', 'clearable', 'emit-value', 'map-options', 'disable', 'rules'],
          emits: ['update:modelValue'],
        },
        'q-btn': {
          template: '<button :disabled="disable" @click="$emit(\'click\')"><slot /></button>',
          props: ['label', 'color', 'icon', 'loading', 'disable', 'outline'],
          emits: ['click'],
        },
        'q-banner': {
          template: '<div><slot /></div>',
        },
        'q-icon': {
          template: '<span><slot /></span>',
        },
        'q-separator': true,
      },
    },
  });
}

describe('FilterPanel', () => {
  it('renderiza todos los tipos de campo', () => {
    const dateField: FilterField = { key: 'date', label: 'Fecha', type: 'date' };
    const wrapper = createWrapper({ fields: [textField, selectField, dateField] });
    expect(wrapper.text()).toContain('Nombre');
    expect(wrapper.text()).toContain('Tipo');
    expect(wrapper.text()).toContain('Fecha');
  });

  it('emite search solo con valores llenos', async () => {
    const wrapper = createWrapper({ fields: [textField, selectField] });
    const input = wrapper.find('input');
    await input.setValue('Visa');
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('search')![0]![0]).toEqual({ name: 'Visa' });
  });

  it('muestra error de validación en campo requerido vacío', async () => {
    const requiredField = { ...textField, required: true };
    const wrapper = createWrapper({ fields: [requiredField] });
    await wrapper.find('button').trigger('click');
    expect(wrapper.text()).toContain('Nombre es requerido');
  });
});
