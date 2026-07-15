# Prueba Técnica - Gestión de Pagos

Aplicación frontend desarrollada con Vue 3, Quasar Framework 2 y Pinia.

## Requisitos

- Node.js >= 22.12
- npm

## Instalación

```bash
npm install
```

## Ejecutar tests

```bash
# Una sola ejecución
npm test

# Modo watch
npm run test:watch
```

Los tests están escritos con **Jest 29 + ts-jest + @vue/vue3-jest** y se ubican en carpetas `__tests__` junto al código que prueban.

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:9000`.

## Credenciales de prueba

| Campo      | Valor             |
| ---------- | ----------------- |
| Correo     | admin@linktic.com |
| Contraseña | admin123          |

## Estructura del proyecto

```
src/
├── core/                    # Infraestructura global
│   ├── api/                 # Servicios mock (auth, payments)
│   ├── layouts/             # MainLayout con header y navegación
│   ├── pages/               # ErrorNotFound, HomePage
│   ├── plugins/             # Setup de Pinia
│   ├── router/              # Rutas y guard de navegación
│   └── types.ts             # Interfaces compartidas
├── features/
│   ├── auth/                # Login, store de autenticación
│   └── payment-methods/     # CRUD de métodos de pago
├── shared/
│   ├── components/          # FilterPanel reutilizable
│   ├── composables/         # useFormat (fechas, moneda)
│   └── utils/               # Notificaciones globales
├── App.vue
└── main.ts
```

## Supuestos y decisiones tecnicas

### Mock de datos

- Toda la data falsa esta centralizada en `src/core/api/`.
- No se requiere backend real. Los servicios simulan un delay de red (600ms).
- Los datos se almacenan en memoria durante la sesión y se restauran al estado original al recargar la página.

### Autenticación

- Sesión persistente en localStorage (token y usuario).
- Guard de navegación protege todas las rutas bajo MainLayout.
- Credenciales fijas validadas contra mock.

### Metodos de Pago

- 8 registros de ejemplo precargados.
- Tipos disponibles: Tarjeta de Crédito, Tarjeta de Débito, Transferencia Bancaria, Efectivo, Billetera Digital, Otro.
- CRUD completo: crear, editar, eliminar (con Confirmación), activar/desactivar.

### Componente de Filtros

- Componente genérico y reutilizable ubicado en `shared/components/`.
- Configurable mediante prop `fields` con tipo, etiqueta, opciones y validación.
- No tiene conocimiento del negocio que lo implementa.

### Notificaciones globales

- Usa el plugin Notify de Quasar (librería incluida, no requiere instalación adicional).
- Errores y confirmaciones se muestran como notificaciones emergentes.

### Formateo de fechas

- `shared/composables/useFormat.ts` exporta `formatDate` (formato YYYY-MM-DD HH:MM AM/PM).
- Aplicado a la columna "Creado" de la tabla de métodos de pago.

## Tipos de datos

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```
