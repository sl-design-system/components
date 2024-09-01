import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Option } from './option.js';

describe('sl-option', () => {
  let el: Option;

  beforeEach(async () => {
    el = await fixture(html`<sl-option>Option</sl-option>`);
  });

  it('should have an option role', () => {
    expect(el).to.have.attribute('role', 'option');
  });
});
