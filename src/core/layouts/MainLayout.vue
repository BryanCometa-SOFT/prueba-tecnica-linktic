<template>
  <!-- Layout principal de la aplicacion -->
  <q-layout view="hHh lpR fFf">
    <!-- Barra superior -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Abrir menu" @click="toggleDrawer" />

        <q-toolbar-title class="text-weight-medium"> Gestion de Pagos </q-toolbar-title>

        <q-space />

        <q-btn flat round icon="logout" label="Salir" @click="handleLogout" no-caps />
      </q-toolbar>
    </q-header>

    <!-- Drawer de navegacion lateral -->
    <q-drawer v-model="drawerOpen" show-if-above bordered :width="240">
      <q-list padding>
        <q-item-label header class="text-grey-8 text-weight-bold"> Menu Principal </q-item-label>

        <q-item clickable v-ripple to="/">
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

// Estado del drawer lateral
const drawerOpen = ref(false);

const router = useRouter();

// Alterna la visibilidad del drawer
function toggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value;
}

// Cierra la sesion y redirige al login
function handleLogout(): void {
  // TODO: Implementar cierre de sesion en Fase 2
  void router.push('/login');
}
</script>
