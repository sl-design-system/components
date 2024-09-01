import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Combobox } from './combobox.js';

describe('sl-combobox', () => {
  let el: Combobox;

  beforeEach(async () => {
    el = await fixture(html`<sl-combobox></sl-combobox>`);
  });

  it('should have a combobox role', () => {
    expect(el).to.have.attribute('role', 'combobox');
  });
});
