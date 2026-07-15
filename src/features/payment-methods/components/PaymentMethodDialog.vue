<template>
  <q-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" persistent>
    <q-card style="min-width: 450px">
      <q-card-section>
        <div class="text-h6">{{ isEditing ? 'Editar' : 'Nuevo' }} Método de Pago</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="$emit('save', { ...form })" class="q-gutter-md">
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
            :rules="[(v: string | null) => !!v || 'El tipo es requerido']"
          />
          <q-input v-model="form.description" label="Descripción (opcional)" outlined dense />
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" @click="$emit('update:show', false)" no-caps />
        <q-btn color="primary" label="Guardar" :loading="loading" @click="submit" no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { PAYMENT_TYPES } from '@/core/api/payments';
import type { PaymentMethod } from '@/core/types';

const props = defineProps<{
  show: boolean;
  isEditing: boolean;
  item: PaymentMethod | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  'update:show': [value: boolean];
  save: [data: { name: string; type: string; description?: string }];
}>();

const typeOptions = PAYMENT_TYPES.map((t) => ({ label: t.label, value: t.value }));

const form = reactive({ name: '', type: '', description: '' });

function resetForm(): void {
  if (props.isEditing && props.item) {
    form.name = props.item.name;
    form.type = props.item.type;
    form.description = props.item.description ?? '';
  } else {
    form.name = '';
    form.type = '';
    form.description = '';
  }
}

watch(
  () => props.show,
  (open) => {
    if (open) resetForm();
  },
);

function submit(): void {
  emit('save', { ...form });
}
</script>
