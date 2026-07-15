// Helper de notificaciones globales usando Quasar Notify
import { Notify } from 'quasar';

export function notifyError(message: string): void {
  Notify.create({ type: 'negative', message, position: 'top-right', timeout: 4000 });
}

export function notifySuccess(message: string): void {
  Notify.create({ type: 'positive', message, position: 'top-right', timeout: 3000 });
}
