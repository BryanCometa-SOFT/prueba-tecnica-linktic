<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-md">Métodos de Pago</div>

    <!-- Panel de filtros reutilizable -->
    <FilterPanel :fields="filterFields" @search="handleSearch" @clear="handleClear" />

    <q-separator class="q-my-md" />

    <!-- Boton nuevo -->
    <q-btn
      label="Nuevo Método"
      color="primary"
      icon="add"
      class="q-mb-md"
      @click="openCreate"
      no-caps
    />

    <!-- Tabla de métodos de pago -->
    <q-table :rows="filteredRows" :columns="columns" row-key="id" :loading="store.isLoading" flat bordered>
      <template v-slot:body-cell-isActive="props">
        <q-td :props="props">
          <q-toggle
            :model-value="props.row.isActive"
            color="positive"
            :label="props.row.isActive ? 'Activo' : 'Inactivo'"
            @update:model-value="() => store.toggleStatus(props.row.id)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          {{ getTypeLabel(props.row.type) }}
        </q-td>
      </template>

      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" color="primary" size="sm" @click="openEdit(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn flat round icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)">
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog crear/editar -->
    <PaymentMethodDialog
      v-model:show="showDialog"
      :is-editing="isEditing"
      :item="editingItem"
      :loading="store.isLoading"
      @save="handleSave"
    />

    <!-- Dialog confirmación eliminar -->
    <ConfirmDeleteDialog
      v-model:show="showDeleteConfirm"
      :item="deletingItem"
      :loading="store.isLoading"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { formatDate } from '@/shared/composables/useFormat';
import { usePaymentMethodsStore } from '../store/paymentMethodsStore';
import { PAYMENT_TYPES } from '@/core/api/payments';
import FilterPanel from '@/shared/components/FilterPanel.vue';
import PaymentMethodDialog from '../components/PaymentMethodDialog.vue';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog.vue';
import type { PaymentMethod } from '@/core/types';
import type { FilterField, FilterValues } from '@/shared/components/FilterPanel.vue';

const store = usePaymentMethodsStore();

const columns = [
  { name: 'name', label: 'Nombre', align: 'left' as const, field: 'name', sortable: true },
  { name: 'type', label: 'Tipo', align: 'left' as const, field: 'type', sortable: true },
  { name: 'isActive', label: 'Estado', align: 'center' as const, field: 'isActive', sortable: true },
  { name: 'createdAt', label: 'Creado', align: 'left' as const, field: 'createdAt', sortable: true },
  { name: 'actions', label: 'Acciones', align: 'center' as const, field: 'actions' },
];

function getTypeLabel(type: string): string {
  return PAYMENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

// Filtros
interface FilterCriteria {
  name: string;
  type: string | null;
  isActive: boolean | null;
}

const filterCriteria = ref<FilterCriteria>({ name: '', type: null, isActive: null });

const filterFields: FilterField[] = [
  { key: 'name', label: 'Nombre', type: 'text' },
  { key: 'type', label: 'Tipo', type: 'select', options: PAYMENT_TYPES.map((t) => ({ label: t.label, value: t.value })) },
  { key: 'isActive', label: 'Estado', type: 'boolean' },
];

function handleSearch(values: FilterValues): void {
  filterCriteria.value = {
    name: (values.name as string) ?? '',
    type: (values.type as string | null) ?? null,
    isActive: values.isActive !== undefined ? (values.isActive as boolean | null) : null,
  };
}

function handleClear(): void {
  filterCriteria.value = { name: '', type: null, isActive: null };
}

// CRUD
const showDialog = ref(false);
const isEditing = ref(false);
const editingItem = ref<PaymentMethod | null>(null);

function openCreate(): void {
  isEditing.value = false;
  editingItem.value = null;
  showDialog.value = true;
}

function openEdit(item: PaymentMethod): void {
  isEditing.value = true;
  editingItem.value = item;
  showDialog.value = true;
}

async function handleSave(data: { name: string; type: string; description?: string }): Promise<void> {
  if (isEditing.value && editingItem.value) {
    await store.update(editingItem.value.id, data);
  } else {
    await store.create(data);
  }
  showDialog.value = false;
}

// Eliminar
const showDeleteConfirm = ref(false);
const deletingItem = ref<PaymentMethod | null>(null);

function confirmDelete(item: PaymentMethod): void {
  deletingItem.value = item;
  showDeleteConfirm.value = true;
}

async function handleDelete(): Promise<void> {
  if (deletingItem.value) {
    await store.remove(deletingItem.value.id);
    showDeleteConfirm.value = false;
    deletingItem.value = null;
  }
}

// Filas filtradas
const filteredRows = computed(() => {
  let result = store.list;
  const c = filterCriteria.value;

  if (c.name) {
    const q = c.name.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (c.type) result = result.filter((p) => p.type === c.type);
  if (c.isActive !== null) result = result.filter((p) => p.isActive === c.isActive);

  return result;
});

onMounted(() => {
  void store.fetchAll();
});
</script>
