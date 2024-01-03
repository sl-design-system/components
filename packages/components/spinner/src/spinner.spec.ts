import type { Spinner } from './spinner.js';
import { expect, fixture, should } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';

describe('sl-spinner', () => {
  let el: Spinner;

  beforeEach(async () => {
    el = await fixture(html`<sl-spinner></sl-spinner>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should have size medium and no variant by default', () => {
    expect(el).to.have.attribute('size','md');
    expect(el).not.to.have.attribute('variant');
  });
});
