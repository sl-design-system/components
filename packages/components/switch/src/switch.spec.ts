import { expect, fixture } from '@open-wc/testing';
import { Icon } from '@sl-design-system/icon';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import '../register.js';
import { Switch } from './switch.js';

describe('sl-switch', () => {
  let el: Switch;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch></sl-switch>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should not be checked', () => {
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
      expect(el.internals.ariaChecked).not.to.equal('true');
    });

    it('should be checked when set', async () => {
      el.checked = true;
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should have a medium size', () => {
      expect(el).to.have.attribute('size', 'md');
      expect(el.size).to.equal('md');
    });

    it('should not have an icon when size is sm', async () => {
      el.size = 'sm';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon')).to.be.null;
    });

    it('should have an icon when size is md or lg', async () => {
      expect(el.renderRoot.querySelector('sl-icon')).to.exist;

      el.size = 'lg';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon')).to.exist;
    });

    it('should have the correct icon size', async () => {
      const icon = el.renderRoot.querySelector<Icon>('sl-icon');

      expect(icon?.size).to.equal('xs');

      el.size = 'lg';
      await el.updateComplete;

      expect(icon?.size).to.equal('md');
    });

    it('should toggle the state when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).to.equal(true);

      el.click();
      await el.updateComplete;

      expect(el.checked).to.equal(false);
    });

    it('should toggle the state on Enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(el.checked).to.equal(true);

      await sendKeys({ press: 'Enter' });

      expect(el.checked).to.equal(false);
    });

    it('should toggle the state on Space', async () => {
      el.focus();
      await sendKeys({ press: ' ' });

      expect(el.checked).to.equal(true);

      await sendKeys({ press: ' ' });

      expect(el.checked).to.equal(false);
    });

    it('should support custom icons', async () => {
      el.iconOn = 'sun';
      el.iconOff = 'moon';
      await el.updateComplete;

      const icon = el.renderRoot.querySelector<Icon>('sl-icon');

      expect(icon?.name).to.equal('moon');

      el.click();
      await el.updateComplete;

      expect(icon?.name).to.equal('sun');
    });
  });

  describe('disabled', () => {
    beforeEach(async ()=>{
      el = await fixture(html`<sl-switch disabled></sl-switch>`);
    });

    it('should have an attribute', async () => {
      expect(el).to.have.attribute('disabled');
    });

    it('should not change the state when clicked', async () => {
      el.click();

      expect(el.checked).not.to.equal(true);
    });

    it('should not change the state on Enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(el.checked).not.to.equal(true);
    });

    it('should not change the state on Space', async () => {
      el.focus();
      await sendKeys({ press: ' ' });

      expect(el.checked).not.to.equal(true);
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch checked></sl-switch>`);
    });

    it('should be on when the property is set', () => {
      expect(el.checked).to.equal(true);
      expect(el.internals.ariaChecked).to.equal('true');
    });
  });

  describe('form integration', () => {
    let form: HTMLFormElement;

    describe('unchecked', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-switch></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;
      });

      it('should revert back to the correct initial state (off) when the form is reset', () => {
        el.click();

        expect(el.checked).to.equal(true);

        el.formResetCallback();

        expect(el.checked).to.equal(false);
      });
    });

    describe('checked', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-switch checked></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;
      });

      it('should revert back to the correct initial state (on) when the form is reset', () => {
        el.click();

        expect(el.checked).to.equal(false);

        el.formResetCallback();

        expect(el.checked).to.equal(true);
      });
    });
  });
});
