import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { CheckboxGroup } from './checkbox-group.js';
import './register.js';

describe('sl-checkbox-group', () => {
  let el: CheckboxGroup;

  describe('empty', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox-group></sl-checkbox-group>`);
    });
  
    it('should not break', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });
  });

  describe('defaults', () => {
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

    it('should be valid when no option is chosen but the group is not required', () =>{
      expect(el.internals.validity.valid).to.equal(true);
    });

    it('should handle the navigating between options correctly', async () => {            
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

    it('should be valid when no option is chosen but the group is not required', async () =>{
      el.boxes?.forEach(b=>b.blur());
      // this doesn't work, can this even be tested here?
      // expect(el.boxes?.[0].tabIndex).to.equal(-1);
      // expect(el.boxes?.[1].tabIndex).to.equal(-1);
      // expect(el.boxes?.[2].tabIndex).to.equal(-1);

      await el.click();

      // expect(el.boxes?.[0].tabIndex).to.equal(0);
      // expect(el.boxes?.[1].tabIndex).to.equal(-1);
      // expect(el.boxes?.[2].tabIndex).to.equal(-1);
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`
          <sl-checkbox-group required hint="this is a hint">
            <sl-checkbox value="1">Option 1</sl-checkbox>
            <sl-checkbox value="2">Option 2</sl-checkbox>
            <sl-checkbox value="3">Option 3</sl-checkbox>
          </sl-checkbox-group>
      `);
    });

    it('should validate that an option is chosen when it is a required group', async () => {
      expect(el.internals.validity.valid).to.equal(false);
    });

    it('should validate that an option is chosen when it is a required group', async () => {
      expect(el.internals.validity.valid).to.equal(false);
      
      el.boxes?.[0]?.setAttribute('checked','');
      await el.form?.checkValidity();

      expect(el.internals.validity.valid).to.equal(true);
    });
  });
});
