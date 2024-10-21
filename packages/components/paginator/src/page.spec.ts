import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import '../register.js';
import { Page } from './page.js';

describe('sl-page', () => {
  let el: Page;

  describe('defaults', () => {
    beforeEach(async () => {
      try {
        customElements.define('sl-page', Page);
      } catch {
        // empty
      }

      el = await fixture(html` <sl-page>1</sl-page> `);
    });

    it('should have a button', () => {
      const button = el.renderRoot.querySelector('button');

      expect(button).to.exist;
    });

    it('should have a proper aria-label', () => {
      expect(el.renderRoot.querySelector('button')).to.have.attribute('aria-label', '1, page');
    });
  });
});
