import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { CheckboxGroup } from './checkbox-group.js';
import '../register.js';

describe('sl-checkbox-group', () => {
  let el: CheckboxGroup;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-checkbox-group>
        <sl-checkbox>Option 1</sl-checkbox>
        <sl-checkbox>Option 2</sl-checkbox>
        <sl-checkbox>Option 3</sl-checkbox>
      </sl-checkbox-group>
    `);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should not be disabled', () => {
    expect(el.disabled).to.not.be.true;
    expect(el).not.to.have.attribute('disabled');
  });

  it('should be disabled if set', async () => {
    el.disabled = true;
    await el.updateComplete;

    expect(el.disabled).to.be.true;
    expect(el).to.have.attribute('disabled');
  });

  it('should disable all checkboxes if set', async () => {
    el.disabled = true;
    await el.updateComplete;

    const allDisabled = Array.from(el.querySelectorAll('sl-checkbox')).every(c => c.disabled);

    expect(allDisabled).to.be.true;
  });

  it('should be valid', () =>{
    expect(el.valid).to.equal(true);
  });

  it('should be invalid when required', async () => {
    el.required = true;
    await el.updateComplete;

    expect(el.valid).to.equal(false);
    expect(el.validity.valueMissing).to.equal(true);
  });

  it('should be valid when required and checked', async () => {
    el.required = true;
    await el.updateComplete;

    el.querySelector('sl-checkbox')?.click();
    await new Promise(resolve => setTimeout(resolve));

    expect(el.valid).to.equal(true);
    expect(el.validity.valueMissing).to.equal(false);
  });

  it('should propagate the group size to the checkboxes', async () => {
    el.size = 'lg';
    await el.updateComplete;

    const allLarge = Array.from(el.querySelectorAll('sl-checkbox')).every(c => c.size === 'lg');

    expect(allLarge).to.be.true;
  });

  it('should handle navigating between options correctly', async () => {
    expect(el.boxes?.[0].checked).not.to.equal(true);
    expect(el.boxes?.[0].tabIndex).to.equal(0);
    expect(el.boxes?.[1].checked).not.to.equal(true);
    expect(el.boxes?.[1].tabIndex).to.equal(-1);

    el.boxes?.[0]?.focus();
    await sendKeys({ press: 'Space' });

    expect(el.boxes?.[0].checked).to.equal(true);
    expect(el.boxes?.[1].checked).not.to.equal(true);

    await sendKeys({ press: 'ArrowRight' });
    await sendKeys({ press: 'Enter' });

    expect(el.boxes?.[0].checked).to.equal(true);
    expect(el.boxes?.[1].checked).to.equal(true);
  });
});
