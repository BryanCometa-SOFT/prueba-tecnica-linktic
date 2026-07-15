<template>
  <!-- Componente de filtros reutilizable y agnostico -->
  <div class="filter-panel">
    <div class="row q-gutter-sm items-start">
      <template v-for="field in fields" :key="field.key">
        <!-- Campo de texto -->
        <q-input
          v-if="field.type === 'text'"
          v-model="values[field.key]"
          :label="field.label"
          outlined
          dense
          clearable
          class="filter-field"
          :class="{ 'filter-field-required': field.required }"
          :rules="field.required ? [(v: string) => !!v || `${field.label} es requerido`] : []"
          :disable="loading"
          @keydown.enter="emitSearch"
        />

        <!-- Campo seleccion -->
        <q-select
          v-else-if="field.type === 'select'"
          v-model="values[field.key]"
          :label="field.label"
          :options="field.options ?? []"
          outlined
          dense
          clearable
          emit-value
          map-options
          class="filter-field"
          :rules="field.required ? [(v: string | null) => !!v || `${field.label} es requerido`] : []"
          :disable="loading"
        />

        <!-- Campo fecha -->
        <q-input
          v-else-if="field.type === 'date'"
          v-model="values[field.key]"
          :label="field.label"
          outlined
          dense
          clearable
          type="date"
          class="filter-field"
          :disable="loading"
        />

        <!-- Campo booleano -->
        <q-select
          v-else-if="field.type === 'boolean'"
          v-model="values[field.key]"
          :label="field.label"
          :options="booleanOptions"
          outlined
          dense
          clearable
          emit-value
          map-options
          class="filter-field"
          :disable="loading"
        />
      </template>
    </div>

    <!-- Mensaje de error de validacion -->
    <div v-if="validationError" class="q-mt-sm">
      <q-banner class="bg-warning text-white rounded-borders" dense>
        <div class="row items-center q-gutter-sm">
          <q-icon name="warning" />
          <span>{{ validationError }}</span>
        </div>
      </q-banner>
    </div>

    <!-- Acciones -->
    <div class="row q-gutter-sm q-mt-md">
      <q-btn
        label="Buscar"
        color="primary"
        icon="search"
        :loading="loading"
        @click="emitSearch"
        no-caps
      />
      <q-btn
        label="Limpiar"
        color="grey"
        outline
        icon="clear"
        :disable="loading"
        @click="emitClear"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'boolean';
  required?: boolean;
  options?: { label: string; value: string | boolean | number }[];
}

export type FilterValues = Record<string, string | boolean | null>;

const props = defineProps<{
  fields: FilterField[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  search: [values: FilterValues];
  clear: [];
}>();

const validationError = ref<string | null>(null);

const booleanOptions = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
];

// Quasar v-model no acepta boolean, usamos any como contenedor dinámico
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const values: Record<string, any> = reactive(
  Object.fromEntries(props.fields.map((f) => [f.key, null])),
);

function emitSearch(): void {
  validationError.value = null;

  for (const field of props.fields) {
    if (field.required && !values[field.key]) {
      validationError.value = `${field.label} es requerido`;
      return;
    }
  }

  const filled: FilterValues = {};
  for (const field of props.fields) {
    const val = values[field.key];
    if (val !== null && val !== undefined && val !== '') {
      filled[field.key] = val as string | boolean | null;
    }
  }

  emit('search', filled);
}

// Limpia todos los campos y emite evento
function emitClear(): void {
  validationError.value = null;
  for (const field of props.fields) {
    values[field.key] = null;
  }
  emit('clear');
}
</script>

<style scoped>
.filter-panel {
  width: 100%;
}

.filter-field {
  min-width: 200px;
}

.filter-field-required :deep(.q-field__label)::after {
  content: ' *';
  color: var(--q-negative);
}
</style>
