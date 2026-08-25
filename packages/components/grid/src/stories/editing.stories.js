import { getPeople } from '@sl-design-system/example-data';
import { html } from 'lit';
import '../../register.js';
const personLabel = ({ firstName, lastName }) => `${firstName} ${lastName}`;
export default {
  title: 'Grid/Editing',
  loaders: [async () => ({ people: (await getPeople()).people })],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
};
export const TextField = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-text-field-column
        path="address.zip"
        .formControlLabel=${personLabel}></sl-grid-text-field-column>
    </sl-grid>
  `
};
export const Select = {
  render: (_, { loaded: { people } }) => html`
    <sl-grid .items=${people}>
      <sl-grid-column path="firstName"></sl-grid-column>
      <sl-grid-column path="lastName"></sl-grid-column>
      <sl-grid-select-column
        .options=${['Available', 'Busy']}
        .formControlLabel=${personLabel}
        path="status"></sl-grid-select-column>
    </sl-grid>
  `
};
//# sourceMappingURL=editing.stories.js.map
