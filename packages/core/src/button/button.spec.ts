import type { Button } from './button.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import './register.js';

describe('sl-button', () => {
  let el: Button;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a tabindex', () => {
      expect(el).to.have.attribute('tabindex', '0');
    });

    it('should allow for a custom tabindex', async () => {
      el.tabIndex = 10;
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '10');
    });

    it('should have a button role', () => {
      expect(el).to.have.attribute('role', 'button');
    });

    it('should be size medium', () => {
      expect(el).to.have.attribute('size', 'md');
    });

    it('should be small size when set', async () => {
      el.size = 'sm';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'sm');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
    });

    // it('should be disabled if set', async () => {
    //   el.disabled = true;
    //   await el.updateComplete;

    //   expect(el).to.have.attribute('disabled');
    // });
  });
});
