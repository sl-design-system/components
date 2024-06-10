import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Badge } from './badge.js';

describe('sl-badge', () => {
  let el: Badge;

  beforeEach(async () => {
    el = await fixture(html`<sl-badge>99+</sl-badge>`);
  });

  it('should have subtle emphasis, medium size and neutral variant by default', () => {
    expect(el.emphasis).to.equal('subtle');
    expect(el).to.have.attribute('emphasis', 'subtle');

    expect(el.size).to.equal('md');
    expect(el).to.have.attribute('size', 'md');

    expect(el.variant).to.equal('neutral');
    expect(el).to.have.attribute('variant', 'neutral');
  });
});
