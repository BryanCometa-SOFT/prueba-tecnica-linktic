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
    <q-table
      :rows="filteredRows"
      :columns="columns"
      row-key="id"
      :loading="store.isLoading"
      flat
      bordered
    >
      <!-- Columna estado con switch -->
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

      <!-- Columna tipo con etiqueta legible -->
      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          {{ getTypeLabel(props.row.type) }}
        </q-td>
      </template>

      <!-- Columna fecha formateada -->
      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>

      <!-- Columna acciones -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round icon="edit" color="primary" size="sm" @click="openEdit(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="delete"
            color="negative"
            size="sm"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- Dialog para crear/editar -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Editar' : 'Nuevo' }} Método de Pago</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="save" class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="Nombre"
              outlined
              dense
              :rules="[(v: string) => !!v || 'El nombre es requerido']"
            />
            <q-select
              v-model="form.type"
              label="Tipo"
              :options="typeOptions"
              outlined
              dense
              emit-value
              map-options
              :rules="[(v: any) => !!v || 'El tipo es requerido']"
            />
            <q-input v-model="form.description" label="Descripción (opcional)" outlined dense />
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" v-close-popup no-caps />
          <q-btn color="primary" label="Guardar" :loading="store.isLoading" @click="save" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de confirmación para eliminar -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center q-gutter-sm">
          <q-icon name="warning" color="negative" size="40px" />
          <div>
            <div class="text-h6">Eliminar método de pago</div>
            <div class="text-grey-7">
              Confirma que desea eliminar <strong>{{ deletingItem?.name }}</strong
              >?
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup no-caps />
          <q-btn
            color="negative"
            label="Eliminar"
            :loading="store.isLoading"
            @click="deleteItem"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { formatDate } from '@/shared/composables/useFormat';
import { usePaymentMethodsStore } from '../store/paymentMethodsStore';
import { PAYMENT_TYPES } from '@/core/api/payments';
import FilterPanel from '@/shared/components/FilterPanel.vue';
import type { PaymentMethod } from '@/core/types';
import type { FilterField } from '@/shared/components/FilterPanel.vue';

const store = usePaymentMethodsStore();

// Columnas de la tabla
const columns = [
  { name: 'name', label: 'Nombre', align: 'left' as const, field: 'name', sortable: true },
  { name: 'type', label: 'Tipo', align: 'left' as const, field: 'type', sortable: true },
  {
    name: 'isActive',
    label: 'Estado',
    align: 'center' as const,
    field: 'isActive',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: 'Creado',
    align: 'left' as const,
    field: 'createdAt',
    sortable: true,
  },
  { name: 'actions', label: 'Acciones', align: 'center' as const, field: 'actions' },
];

// Opciones para el select de tipos
const typeOptions = PAYMENT_TYPES.map((t) => ({ label: t.label, value: t.value }));

// Convierte el valor del tipo a su etiqueta
function getTypeLabel(type: string): string {
  return PAYMENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

// --- Filtros ---
interface FilterCriteria {
  name: string;
  type: string | null;
  isActive: boolean | null;
}

const filterCriteria = ref<FilterCriteria>({ name: '', type: null, isActive: null });

const filterFields: FilterField[] = [
  { key: 'name', label: 'Nombre', type: 'text' },
  {
    key: 'type',
    label: 'Tipo',
    type: 'select',
    options: typeOptions,
  },
  {
    key: 'isActive',
    label: 'Estado',
    type: 'boolean',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSearch(values: Record<string, any>) {
  filterCriteria.value = {
    name: values.name ?? '',
    type: values.type ?? null,
    isActive: values.isActive !== undefined ? values.isActive : null,
  };
}

function handleClear() {
  filterCriteria.value = { name: '', type: null, isActive: null };
}

// --- CRUD ---
const showDialog = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({ name: '', type: '', description: '' });

function openCreate() {
  isEditing.value = false;
  editingId.value = null;
  form.name = '';
  form.type = '';
  form.description = '';
  showDialog.value = true;
}

function openEdit(item: PaymentMethod) {
  isEditing.value = true;
  editingId.value = item.id;
  form.name = item.name;
  form.type = item.type;
  form.description = item.description ?? '';
  showDialog.value = true;
}

async function save() {
  if (isEditing.value && editingId.value) {
    await store.update(editingId.value, {
      name: form.name,
      type: form.type,
      description: form.description || null,
    });
  } else {
    const payload: { name: string; type: string; description?: string } = {
      name: form.name,
      type: form.type,
    };
    if (form.description) payload.description = form.description;
    await store.create(payload);
  }
  showDialog.value = false;
}

// --- Eliminar ---
const showDeleteConfirm = ref(false);
const deletingItem = ref<PaymentMethod | null>(null);

function confirmDelete(item: PaymentMethod) {
  deletingItem.value = item;
  showDeleteConfirm.value = true;
}

async function deleteItem() {
  if (deletingItem.value) {
    await store.remove(deletingItem.value.id);
    showDeleteConfirm.value = false;
    deletingItem.value = null;
  }
}

// Filas filtradas con AND entre criterios
const filteredRows = computed(() => {
  let result = store.list
  const c = filterCriteria.value

  if (c.name) {
    const q = c.name.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q))
  }

  if (c.type) {
    result = result.filter((p) => p.type === c.type)
  }

  if (c.isActive !== null) {
    result = result.filter((p) => p.isActive === c.isActive)
  }

  return result
})

onMounted(() => {
  void store.fetchAll();
});
</script>
