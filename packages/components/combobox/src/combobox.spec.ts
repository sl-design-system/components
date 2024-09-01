import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Combobox } from './combobox.js';

describe('sl-combobox', () => {
  let el: Combobox;

  beforeEach(async () => {
    el = await fixture(html`<sl-combobox></sl-combobox>`);
  });

  it('should have an input with role combobox', () => {
    const input = el.querySelector('input[slot="input"]');

    expect(input).to.exist;
    expect(input).to.have.attribute('role', 'combobox');
  });
});
