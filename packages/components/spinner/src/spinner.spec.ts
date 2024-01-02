import type { Spinner } from './spinner.js';
import { expect, fixture, should } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';

describe('dna-spinner', () => {
  let el: Spinner;

  beforeEach(async () => {
    el = await fixture(html`<sl-spinner>99+</sl-spinner>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should have size medium and variant neutral by default', () => {
    expect(el).to.have.attribute('size','md');
    expect(el).to.have.attribute('variant','neutral');
  });

  it('should render the slotted content', () => {
    expect(el).shadowDom.to.have.text('99+');
    expect(el).shadowDom.to.equal(`<slot></slot>`);
  });

  it('should not render the slotted content for small size', async () => {
    el.setAttribute('size','sm');
    await el.updateComplete; 

    expect(el).shadowDom.to.equal(``);
  });
});
