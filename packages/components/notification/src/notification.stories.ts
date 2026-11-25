import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import { type NotificationStack } from './notification-stack.js';
import { Notification, type NotificationOptions } from './notification-store.js';
import { type NotificationElement } from './notification.js';
import './register.js';

type Props = Pick<NotificationElement, 'description' | 'duration' | 'label' | 'variant'> &
  Pick<NotificationStack, 'maxVisible' | 'position'>;
type Story = StoryObj<Props>;

const MESSAGES: Record<'info' | 'success' | 'warning' | 'error', NotificationOptions[]> = {
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
      description: 'The student administration didn’t respond.',
      action: { label: 'Try again', handler: () => add('success') }
    }
  ]
};

const counts = { info: 0, success: 0, warning: 0, error: 0 };

const add = (variant: keyof typeof MESSAGES): void => {
  const list = MESSAGES[variant];

  Notification.add({ ...list[counts[variant]++ % list.length], variant });
};

export default {
  title: 'Feedback & status/Notification',
  args: {
    label: 'Lesplanner has been updated',
    description: 'Reload to use the new version. Your work is saved.',
    variant: 'info'
  },
  argTypes: {
    duration: {
      control: 'number'
    },
    maxVisible: {
      table: { disable: true }
    },
    position: {
      table: { disable: true }
    },
    variant: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error']
    }
  },
  render: ({ description, duration, label, variant }) => html`
    <sl-notification
      .duration=${duration ?? 0}
      .label=${label}
      .description=${description}
      .variant=${variant}
      style="max-inline-size: 380px"></sl-notification>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Variants: Story = {
  render: () => html`
    <style>
      .variants {
        display: grid;
        gap: 1rem;
        max-inline-size: 380px;
      }
    </style>
    <div class="variants">
      <sl-notification
        label="Lesplanner has been updated"
        description="Reload to use the new version. Your work is saved."
        duration="600000"></sl-notification>
      <sl-notification
        label="“Fractions – week 3” published"
        description="Students in 2B can now see it."
        duration="600000"
        variant="success"></sl-notification>
      <sl-notification
        label="Connection is unstable"
        description="Your answers are saved locally until you’re back online."
        duration="600000"
        variant="warning"></sl-notification>
      <sl-notification
        .action=${{ label: 'Try again', handler: () => {} }}
        label="Class report couldn’t be generated"
        description="Something went wrong while exporting 2B’s results."
        variant="error"></sl-notification>
    </div>
  `
};

export const SlottedAction: Story = {
  render: () => html`
    <sl-notification
      label="3 students couldn’t be imported"
      style="max-inline-size: 380px"
      variant="warning">
      <span slot="description">Fixing it means choosing per student.</span>
      <a href="#import" slot="actions">View import</a>
    </sl-notification>
  `
};

const renderApp = (content?: TemplateResult): TemplateResult => html`
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
  <header class="app-header">
    <strong>Lesplanner</strong>
    <sl-notification-button manager="inbox"></sl-notification-button>
  </header>
  <sl-notification-manager id="inbox"></sl-notification-manager>
  ${content}
`;

export const Playground: Story = {
  render: () => {
    const openDialog = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('div')?.parentElement?.querySelector('dialog')?.showModal();
    };

    const closeDialog = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('dialog')?.close();
    };

    return renderApp(html`
      <div class="controls">
        <sl-button @click=${() => add('info')}>add({ variant: 'info' })</sl-button>
        <sl-button @click=${() => add('success')}>add({ variant: 'success' })</sl-button>
        <sl-button @click=${() => add('warning')}>add({ variant: 'warning' })</sl-button>
        <sl-button @click=${() => add('error')}>add({ variant: 'error' })</sl-button>
        <sl-button @click=${openDialog}>dialog.showModal()</sl-button>
        <sl-button @click=${() => Notification.clear()} fill="ghost"
          >Notification.clear()</sl-button
        >
      </div>
      <p>
        Send several: they pile up; hover, Tab in or click the edges to expand. Press F8 to jump to
        the newest notification. Errors and notifications with an action stay until dismissed.
      </p>
      <dialog aria-label="Publish assignment">
        <h2>Publish assignment?</h2>
        <p>Notifications sent from here appear above this dialog, and can still be used.</p>
        <div class="controls">
          <sl-button @click=${closeDialog} fill="ghost">Cancel</sl-button>
          <sl-button @click=${() => add('info')}>Save draft</sl-button>
          <sl-button
            @click=${(event: Event & { target: HTMLElement }) => {
              closeDialog(event);
              add('success');
            }}
            variant="primary"
            >Publish</sl-button
          >
        </div>
      </dialog>
    `);
  }
};

export const Manager: Story = {
  render: () => {
    if (!Notification.all.length) {
      add('info');
      add('success');
      add('error');
      add('warning');
      Notification.all.slice(2).forEach(n => n.dismiss('user'));
    }

    return renderApp(html`<p>Use the bell to open the manager.</p>`);
  }
};

export const List: Story = {
  render: () => {
    if (!Notification.all.length) {
      add('info');
      add('success');
      add('error');
    }

    return html`
      <sl-notification-list
        style="border: 1px solid var(--sl-color-border-plain); max-inline-size: 400px"></sl-notification-list>
    `;
  }
};
