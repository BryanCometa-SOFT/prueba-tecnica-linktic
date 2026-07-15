<template>
  <div class="login-page bg-grey-2">
    <q-card class="login-card" flat bordered>
      <q-card-section class="text-center q-pt-xl">
        <q-icon name="payments" size="48px" color="primary" />
        <h4 class="text-weight-medium q-mt-md q-mb-sm">Gestión de Pagos</h4>
        <p class="text-grey-7">Ingrese sus credenciales</p>
      </q-card-section>

      <!-- Credenciales de prueba -->
      <q-card-section class="q-pt-none q-pb-md text-center q-gutter-xs">
        <q-banner class="bg-grey-3 text-grey-8 rounded-borders" dense>
          <div class="text-caption">
            Usuario de prueba: <strong>admin@linktic.com</strong>
            <span class="text-grey-5"> / </span>
            <strong>admin123</strong>
          </div>
        </q-banner>
      </q-card-section>

      <q-card-section class="q-px-xl q-pb-xl">
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="form.email"
            label="Correo"
            type="email"
            outlined
            dense
            :rules="[(v) => !!v || 'Requerido']"
          />
          <q-input
            v-model="form.password"
            label="Contrasena"
            type="password"
            outlined
            dense
            :rules="[(v) => !!v || 'Requerida']"
          />
          <q-banner v-if="authStore.error" class="bg-negative text-white" rounded>
            <div class="row items-center q-gutter-sm">
              <q-icon name="warning" />
              <span>{{ authStore.error }}</span>
            </div>
          </q-banner>
          <q-btn
            type="submit"
            label="Ingresar"
            color="primary"
            class="full-width"
            size="lg"
            :loading="authStore.isLoading"
            no-caps
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({ email: '', password: '' });

// Si ya hay sesion, redirige al inicio
onMounted(() => {
  if (authStore.isAuthenticated) void router.push('/');
});

// Login: si el store no reporta error, redirige
async function handleLogin(): Promise<void> {
  await authStore.login(form);
  if (authStore.isAuthenticated) {
    void router.push('/');
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.login-card {
  width: 100%;
  max-width: 420px;
}
</style>
