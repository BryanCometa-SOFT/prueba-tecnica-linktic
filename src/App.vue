<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/store/authStore';

// Restaura la sesion si hay datos persistentes en localStorage
const authStore = useAuthStore();

onMounted(() => {
  authStore.restoreSession();
});
</script>
