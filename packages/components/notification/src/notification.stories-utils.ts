/* eslint-disable lit/prefer-static-styles -- stories render plain templates, like *.stories.ts */
import { type TemplateResult, html } from 'lit';
import {
  Notification,
  type NotificationOptions,
  NotificationStore,
  type NotificationVariant
} from './notification-store.js';

/** Example messages per variant, used by the stories. */
export const MESSAGES: Record<NotificationVariant, NotificationOptions[]> = {
  info: [
    {
      label: '“Fractions – week 3” saved as draft',
      description: 'Only you can see it until you publish.'
    },
    {
      label: 'Lesplanner has been updated',
      description: 'Reload to use the new version. Your work is saved.'
    }
  ],
  success: [
    { label: '“Fractions – week 3” published', description: 'Students in 2B can now see it.' },
    { label: 'Grades for 2B synced', description: '24 results sent to the student administration.' }
  ],
  warning: [
    {
      label: 'Connection is unstable',
      description: 'Your answers are saved locally until you’re back online.'
    },
    {
      label: '3 students couldn’t be imported',
      description: 'Fixing it means choosing per student.',
      action: { label: 'View import', href: '#import' }
    }
  ],
  error: [
    {
      label: 'Class report couldn’t be generated',
      description: 'Something went wrong while exporting 2B’s results.',
      action: { label: 'View report', href: '#report' }
    },
    {
      label: 'Grades for 2B weren’t sent',
      description: 'The student administration didn’t respond.'
    }
  ]
};

const VARIANTS: NotificationVariant[] = ['error', 'success', 'info', 'warning'];

const counts: Record<NotificationVariant, number> = { info: 0, success: 0, warning: 0, error: 0 };

/** Adds the next example message of the given variant to the store. */
export const add = (
  variant: NotificationVariant,
  store: NotificationStore = Notification.store
): Notification => {
  const list = MESSAGES[variant];

  return store.add({ ...list[counts[variant]++ % list.length], variant });
};

/**
 * Creates a store with a history: `unread` notifications that still need attention, and `read` ones
 * that have been seen. None of them are on screen.
 */
export const createStore = ({ read = 0, unread = 0 } = {}): NotificationStore => {
  const store = new NotificationStore();

  // Keep the whole history, so large unread counts aren't cut off at the default limit
  store.limit = Math.max(store.limit, read + unread);

  for (let i = 0; i < read; i++) {
    add(VARIANTS[i % VARIANTS.length], store).dismiss('user');
  }

  for (let i = 0; i < unread; i++) {
    add(VARIANTS[i % VARIANTS.length], store).dismiss('api');
  }

  return store;
};

/** Styles shared by the stories. */
export const styles = html`
  <style>
    .app-header {
      align-items: center;
      background: var(--sl-elevation-surface-raised-default);
      border: 1px solid var(--sl-color-border-plain);
      border-radius: var(--sl-size-borderRadius-default);
      display: flex;
      gap: 0.5rem;
      padding: 0.5rem 1rem 0.5rem 1.5rem;
    }
    .app-header strong {
      flex: 1;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-block: 1.5rem;
    }
    dialog {
      border: 0;
      border-radius: var(--sl-size-borderRadius-default);
      max-inline-size: 400px;
      padding: 1.5rem;
    }
  </style>
`;

/** An app header with a notification button, and the manager it opens. */
export const renderAppHeader = (
  id: string,
  store: NotificationStore = Notification.store
): TemplateResult => html`
  <header class="app-header">
    <strong>Lesplanner</strong>
    <sl-notification-button .store=${store} manager=${id}></sl-notification-button>
  </header>
  <sl-notification-manager .store=${store} id=${id}></sl-notification-manager>
`;

/** Buttons that add notifications to the store, plus a modal dialog to try the stack above it. */
export const renderControls = (store: NotificationStore = Notification.store): TemplateResult => {
  const openDialog = (event: Event & { target: HTMLElement }): void => {
    event.target.closest('.controls')?.parentElement?.querySelector('dialog')?.showModal();
  };

  const closeDialog = (event: Event & { target: HTMLElement }): void => {
    event.target.closest('dialog')?.close();
  };

  return html`
    <div class="controls">
      <sl-button @click=${() => add('info', store)}>add({ variant: 'info' })</sl-button>
      <sl-button @click=${() => add('success', store)}>add({ variant: 'success' })</sl-button>
      <sl-button @click=${() => add('warning', store)}>add({ variant: 'warning' })</sl-button>
      <sl-button @click=${() => add('error', store)}>add({ variant: 'error' })</sl-button>
      <sl-button @click=${openDialog}>dialog.showModal()</sl-button>
      <sl-button @click=${() => store.clear()} fill="ghost">clear()</sl-button>
    </div>
    <dialog aria-label="Publish assignment">
      <h2>Publish assignment?</h2>
      <p>Notifications sent from here appear above this dialog, and can still be used.</p>
      <div class="controls">
        <sl-button @click=${closeDialog} fill="ghost">Cancel</sl-button>
        <sl-button @click=${() => add('info', store)}>Save draft</sl-button>
        <sl-button
          @click=${(event: Event & { target: HTMLElement }) => {
            closeDialog(event);
            add('success', store);
          }}
          variant="primary"
          >Publish</sl-button
        >
      </div>
    </dialog>
  `;
};
