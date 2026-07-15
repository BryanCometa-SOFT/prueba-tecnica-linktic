<template>
  <q-dialog :model-value="show" @update:model-value="$emit('update:show', $event)" persistent>
    <q-card>
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon name="warning" color="negative" size="40px" />
        <div>
          <div class="text-h6">Eliminar método de pago</div>
          <div class="text-grey-7">
            Confirma que desea eliminar <strong>{{ item?.name }}</strong
            >?
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="$emit('update:show', false)" no-caps />
        <q-btn color="negative" label="Eliminar" :loading="loading" @click="$emit('confirm')" no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { PaymentMethod } from '@/core/types';

defineProps<{
  show: boolean;
  item: PaymentMethod | null;
  loading: boolean;
}>();

defineEmits<{
  'update:show': [value: boolean];
  confirm: [];
}>();
</script>
