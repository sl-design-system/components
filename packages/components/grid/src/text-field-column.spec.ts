import { type TextField } from '@sl-design-system/text-field';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type Grid } from './grid.js';
import { waitForAriaForwarding, waitForGridToRenderData } from './utils.js';

type Person = { firstName: string; lastName: string; address: { zip: string } };

describe('sl-grid-text-field-column', () => {
  let el: Grid;
  const personLabel = ({ firstName, lastName }: Person): string => `${firstName} ${lastName}`;

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
    const textField = el.renderRoot.querySelector<TextField>(
      'tbody tr:first-of-type sl-text-field'
    );

    expect(textField).to.exist;
    await textField!.updateComplete;
    await waitForAriaForwarding();

    expect(textField!.input).to.have.attribute('aria-label', 'Zip John Doe');
  });
});
