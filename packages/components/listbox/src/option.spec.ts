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

  it('should not have a value by default', () => {
    expect(el.value).to.be.undefined;
  });

  it('should not be disabled by default', () => {
    expect(el).not.to.have.attribute('disabled');
    expect(el.disabled).not.to.be.true;
  });

  it('should be disabled when set', async () => {
    el.disabled = true;
    await el.updateComplete;

    expect(el).to.have.attribute('disabled');
  });

  it('should not be selected by default', () => {
    expect(el).not.to.have.attribute('selected');
    expect(el.selected).not.to.be.true;
  });

  it('should be selected when set', async () => {
    el.selected = true;
    await el.updateComplete;

    expect(el).to.have.attribute('selected');
  });

  it('should have a hidden check icon by default', () => {
    const icon = el.renderRoot.querySelector('sl-icon[name="check"]');

    expect(icon).to.exist;
    expect(icon).to.have.style('visibility', 'hidden');
  });

  it('should show the check icon when selected', async () => {
    el.selected = true;
    await el.updateComplete;

    const icon = el.renderRoot.querySelector('sl-icon[name="check"]');

    expect(icon).to.exist;
    expect(icon).to.have.style('visibility', 'visible');
  });
});
