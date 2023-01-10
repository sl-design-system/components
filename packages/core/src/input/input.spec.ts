import type { Input } from './input.js';
import { expect, fixture } from '@open-wc/testing';
import { a11ySnapshot, sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import './register.js';

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
  });
});
