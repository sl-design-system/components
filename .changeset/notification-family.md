---
'@sl-design-system/notification': minor
'@sl-design-system/locales': patch
---

Add new notification components: `<sl-notification>`, `<sl-notification-stack>`, `<sl-notification-button>`, `<sl-notification-manager>` and `<sl-notification-list>`, plus the `Notification` store.

```ts
import { Notification } from '@sl-design-system/notification';

Notification.add({ label: '“Fractions – week 3” published', variant: 'success' });
```

Includes Dutch, Spanish, Italian and Polish translations of the notification texts.
