import { Notify } from 'quasar';

type NotifyType = 'positive' | 'negative' | 'warning' | 'info' | 'ongoing';

export function notify(message: string, type: NotifyType = 'info'): void {
  Notify.create({
    type,
    message,
    position: 'top-right',
    timeout: type === 'negative' ? 4000 : 3000,
  });
}
