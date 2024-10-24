import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import '../register.js';
import { PaginatorPage } from './paginator-page.js';

describe('sl-paginator-page', () => {
  let el: PaginatorPage;

  describe('defaults', () => {
    beforeEach(async () => {
      try {
        customElements.define('sl-paginator-page', PaginatorPage);
      } catch {
        // empty
      }

      el = await fixture(html` <sl-paginator-page>1</sl-paginator-page> `);
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
