import '@sl-design-system/button/register.js';
import { EventEmitter } from '@sl-design-system/shared';
import { html } from 'lit';
import '../register.js';
import { announce } from './announce.js';
let counter = 0;
export default {
  title: 'Utilities/Announcer',
  args: {},
  argTypes: {},
  render: () => {
    const sendWithEvent = () => {
      const liveEvent = new EventEmitter(document.body, 'sl-announce');
      liveEvent.emit({ message: `This is sent with an event ${counter++}` });
    };
    const sendWithFunction = () => {
      announce(`This is sent with the API-function ${counter++}`, 'assertive');
    };
    return html`
      <p>
        The &lt;sl-announcer&gt;&lt;/sl-announcer&gt; is not in this file, it is in the template so
        there is only one instance of it that all components can use.
      </p>
      <sl-button @click=${sendWithEvent}>Event, polite</sl-button>
      <sl-button @click=${sendWithFunction}>Function, assertive</sl-button>
    `;
  }
};
export const Basic = {};
//# sourceMappingURL=announcer.stories.js.map
