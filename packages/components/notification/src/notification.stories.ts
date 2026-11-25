import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, render } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { ref } from 'lit/directives/ref.js';
import { type NotificationElement } from './notification.js';
import './register.js';

type Props = Pick<NotificationElement, 'description' | 'duration' | 'label' | 'variant'>;
type Story = StoryObj<Props>;

/** Makes every render of the Basic story a fresh notification, so its timer starts over. */
let basicKey = 0;

export default {
  title: 'Feedback & status/Notification/Notification',
  args: {
    label: 'Lesplanner has been updated',
    description: 'Reload to use the new version. Your work is saved.',
    duration: 'auto',
    variant: 'info'
  },
  argTypes: {
    duration: {
      control: {
        type: 'select',
        labels: {
          auto: 'auto (based on the text)',
          0: '0 (until dismissed)',
          3000: '3000 ms',
          10000: '10000 ms'
        }
      },
      options: ['auto', 0, 3000, 10000]
    },
    variant: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error']
    }
  },
  render: ({ description, duration, label, variant }) => {
    // A notification doesn't remove itself and its timer doesn't run again once it has closed;
    // the stack takes care of that. Here, render a new one on every change of the controls, and
    // offer to show it again after it has closed.
    const show = (container: HTMLElement): void => {
      const onClose = (): void => {
        render(
          html`
            <p>The notification has closed.</p>
            <sl-button @click=${() => show(container)}>Show again</sl-button>
          `,
          container
        );
      };

      render(
        keyed(
          basicKey++,
          html`
            <sl-notification
              @sl-close=${onClose}
              .duration=${duration}
              .label=${label}
              .description=${description}
              .variant=${variant}
              style="max-inline-size: 380px"></sl-notification>
          `
        ),
        container
      );
    };

    return html`<div ${ref(el => el && show(el as HTMLElement))}></div>`;
  }
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
