import type { Input } from './input.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { sendKeys } from '@web/test-runner-commands';

describe('sl-input', () => {
  let el: Input;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-input></sl-input>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    // it('should have a button role', async () => {
    //   const { role } = await a11ySnapshot({ selector: 'sl-input' }) as any;

    //   expect(role).to.equal('button');
    // });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
    });

    it('should be disabled if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should have a medium size by default', () => {
      expect(el).to.have.attribute('size', 'md');
    });

    it('should have a large size when set', () => {
      el.setAttribute('size', 'lg');

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not be readonly by default', () => {
      expect(el).not.to.have.attribute('readonly');
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
    });

    it('should have focus-visible-within when focused by keyboard', async () => {
      await sendKeys({press: 'Tab'});

      expect(el.focusVisible).to.be.true;
    });

    it('should not have focus-visible-within when focused click', async () => {
      el.click();

      expect(el.focusVisible).not.to.be.true;
    });

    it('should not have a placeholder by default', () => {
      expect(el).not.to.have.attribute('placeholder');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'my placeholder';
      await el.updateComplete;

      const input = el.querySelector('input');

      console.log('el with placeholder', el, el.querySelector('input'));

      expect(input).to.have.attribute('placeholder', 'my placeholder');
    });
  });
});

// TODO: showVALID, invalid, valid
