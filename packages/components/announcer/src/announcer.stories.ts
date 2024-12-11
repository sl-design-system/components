import '@sl-design-system/button/register.js';
import { EventEmitter } from '@sl-design-system/shared';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { Announcer, SlAnnounceEvent, sendToAnnouncer } from './announcer.js';

type Props = Announcer;
type Story = StoryObj<Props>;

let counter = 0;
export default {
  title: 'Utilities/Announcer',
  tags: ['draft'],
  args: {},
  argTypes: {},
  render: () => {
    const sendWithEvent = (): void => {
      const liveEvent = new EventEmitter<SlAnnounceEvent>(document.body, 'sl-announce');
      liveEvent.emit({ message: `This is sent with an event ${counter++}` });
    };
    const sendWithFunction = (): void => {
      sendToAnnouncer(`This is sent with the API-function ${counter++}`, 'assertive');
    };
    return html`
      <p>
        The &lt;sl-announcer&gt;&lt;/sl-announcer&gt; is not in this file, it is in the template so there is only one
        instance of it that all components can use.
      </p>
      <sl-button @click=${sendWithEvent}>Event, polite</sl-button>
      <sl-button @click=${sendWithFunction}>Function, assertive</sl-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
