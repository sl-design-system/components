import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Spinner } from './spinner.js';

describe('sl-spinner', () => {
  let el: Spinner;

  beforeEach(async () => {
    el = await fixture(html`<sl-spinner></sl-spinner>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should not have a default size', () => {
    expect(el).not.to.have.attribute('size');
  });

  it('should not have a default variant', () => {
    expect(el).not.to.have.attribute('variant');
  });
});
