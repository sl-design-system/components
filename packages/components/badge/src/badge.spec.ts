import type { badge } from './badge.js';
import { expect, fixture, should } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';

describe('dna-badge', () => {
  let el: badge;

  beforeEach(async () => {
    el = await fixture(html`<sl-badge>99+</sl-badge>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should have size medium and variant neutral by default', () => {
    expect(el).to.have.attribute('size','md');
    expect(el).to.have.attribute('variant','neutral');
  });

  it('should render the slotted content', () => {
    expect(el).to.have.text('99+');
  });

  it('should not render the slotted content for small size', async () => {
    el.size = "sm";
    await el.updateComplete;

    console.log(el.outerHTML);
    expect(el).to.have.text('');
  });
});
