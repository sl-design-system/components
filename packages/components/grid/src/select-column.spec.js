import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { waitForAriaForwarding, waitForGridToRenderData } from './utils.js';
describe('sl-grid-select-column', () => {
  let el;
  const personLabel = ({ firstName, lastName }) => `${firstName} ${lastName}`;
  beforeEach(async () => {
    el = await fixture(html`
      <sl-grid
        .items=${[
          { firstName: 'John', lastName: 'Doe', status: 'Available' },
          { firstName: 'Jane', lastName: 'Smith', status: 'Busy' }
        ]}>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-select-column
          .options=${['Available', 'Busy']}
          .formControlLabel=${personLabel}
          path="status"></sl-grid-select-column>
      </sl-grid>
    `);
    await waitForGridToRenderData(el);
  });
  it('should add an accessible name to the select button', async () => {
    const select = el.renderRoot.querySelector('tbody tr:first-of-type sl-select');
    expect(select).to.exist;
    await select.updateComplete;
    await waitForAriaForwarding();
    expect(select.button).to.have.attribute('aria-label', 'Status John Doe');
  });
});
//# sourceMappingURL=select-column.spec.js.map
