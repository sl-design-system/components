import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type OptionGroup } from './option-group.js';

describe('sl-option-group', () => {
  let el: OptionGroup;

  beforeEach(async () => {
    el = await fixture(html`<sl-option-group></sl-option-group>`);
  });

  it('should have a group role', () => {
    expect(el).to.have.attribute('role', 'group');
  });
});
