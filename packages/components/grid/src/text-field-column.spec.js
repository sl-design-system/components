import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { waitForAriaForwarding, waitForGridToRenderData } from './utils.js';
describe('sl-grid-text-field-column', () => {
  let el;
  const personLabel = ({ firstName, lastName }) => `${firstName} ${lastName}`;
  beforeEach(async () => {
    el = await fixture(html`
      <sl-grid
        .items=${[
          { firstName: 'John', lastName: 'Doe', address: { zip: '12345' } },
          { firstName: 'Jane', lastName: 'Smith', address: { zip: '54321' } }
        ]}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-text-field-column
          path="address.zip"
          .formControlLabel=${personLabel}></sl-grid-text-field-column>
      </sl-grid>
    `);
    await waitForGridToRenderData(el);
  });
  it('should add an accessible name to the text field', async () => {
    const textField = el.renderRoot.querySelector('tbody tr:first-of-type sl-text-field');
    expect(textField).to.exist;
    await textField.updateComplete;
    await waitForAriaForwarding();
    expect(textField.input).to.have.attribute('aria-label', 'Zip John Doe');
  });
});
//# sourceMappingURL=text-field-column.spec.js.map
