import '@sl-design-system/button/register.js';
import { EventEmitter } from '@sl-design-system/shared';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { Notification, SlLiveEvent } from './notification.js';

type Props = Notification;
type Story = StoryObj<Props>;

let counter = 0;
export default {
  title: 'Utilities/Notification',
  tags: ['draft'],
  args: {},
  argTypes: {},
  render: () => {
    const sendWithEvent = (): void => {
      const liveEvent = new EventEmitter<SlLiveEvent>(document.body, 'sl-live-event');
      liveEvent.emit({ message: `This is sent with an event ${counter++}` });
    };
    const sendWithFunction = (): void => {
      Notification.notify(`This is sent with the API-function ${counter++}`, 'assertive');
    };
    return html` <sl-button @click=${sendWithEvent}>Event, polite</sl-button>
      <sl-button @click=${sendWithFunction}>Function, assertive</sl-button>
      <sl-live-aria></sl-live-aria>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
