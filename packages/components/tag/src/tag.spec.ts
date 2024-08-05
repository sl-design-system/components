import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Tag } from './tag.js';

describe('sl-spinner', () => {
  let el: Tag;

  beforeEach(async () => {
    el = await fixture(html`<sl-tag label="my label"></sl-tag>`);
  });

  it('should have medium size by default', () => {
    expect(el.size).to.equal('md');
    expect(el).to.have.attribute('size', 'md');
  });

  it('should have subtle emphasis by default', () => {
    expect(el.emphasis).to.equal('subtle');
    expect(el).to.have.attribute('emphasis', 'subtle');
  });

  // it('should render correctly', () => {
  //   expect(el).shadowDom.to.equalSnapshot();
  // });
  //
  // it('should not have a default size', () => {
  //   expect(el).not.to.have.attribute('size');
  // });
  //
  // it('should not have a default variant', () => {
  //   expect(el).not.to.have.attribute('variant');
  // });
});
