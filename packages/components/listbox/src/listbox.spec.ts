import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Listbox } from './listbox.js';

describe('sl-listbox', () => {
  let el: Listbox;

  beforeEach(async () => {
    el = await fixture(html`<sl-listbox></sl-listbox>`);
  });

  it('should have a role of listbox', () => {
    expect(el).to.have.attribute('role', 'listbox');
  });
});
