import { NotificationButton } from './notification-button.js';
import { NotificationList } from './notification-list.js';
import { NotificationManager } from './notification-manager.js';
import { NotificationStack } from './notification-stack.js';
import { NotificationElement } from './notification.js';

customElements.define('sl-notification', NotificationElement);
customElements.define('sl-notification-button', NotificationButton);
customElements.define('sl-notification-list', NotificationList);
customElements.define('sl-notification-manager', NotificationManager);
customElements.define('sl-notification-stack', NotificationStack);
