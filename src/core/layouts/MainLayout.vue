<template>
  <!-- Layout principal de la aplicacion (requiere autenticacion) -->
  <q-layout view="hHh lpR fFf">
    <!-- Barra superior -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Abrir menu" @click="toggleDrawer" />

        <q-toolbar-title class="text-weight-medium"> Gestion de Pagos </q-toolbar-title>

        <!-- Informacion del usuario autenticado -->
        <q-chip
          v-if="authStore.user"
          dense
          outline
          text-color="white"
          icon="person"
          class="q-mr-md"
        >
          {{ authStore.user.name }}
        </q-chip>

        <!-- Boton de cierre de sesion -->
        <q-btn flat round icon="logout" @click="handleLogout" :loading="isLoggingOut">
          <q-tooltip>Cerrar sesion</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Drawer de navegacion lateral -->
    <q-drawer v-model="drawerOpen" show-if-above bordered :width="240">
      <q-list padding>
        <q-item-label header class="text-grey-8 text-weight-bold"> Menu Principal </q-item-label>

        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="payments" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Metodos de Pago</q-item-label>
            <q-item-label caption>Gestionar metodos de pago</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth/store/authStore';

const authStore = useAuthStore();
const router = useRouter();

const drawerOpen = ref(false);
const isLoggingOut = ref(false);

function toggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value;
}

// Cierra la sesion y redirige al login
async function handleLogout(): Promise<void> {
  isLoggingOut.value = true;
  try {
    await authStore.logout();
    void router.push({ name: 'login' });
  } finally {
    isLoggingOut.value = false;
  }
}
</script>
