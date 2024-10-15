import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import '@sl-design-system/select/register.js';
import { html } from 'lit';
import '../register.js';
import { ItemsCounter } from './items-counter.js';

describe('sl-page', () => {
  let el: ItemsCounter;

  describe('defaults', () => {
    beforeEach(async () => {
      // try {
      //   customElements.define('sl-page', Page);
      // } catch {
      //   // empty
      // }

      el = await fixture(html` <sl-items-counter></sl-items-counter> `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have a button', () => {
      // const button = el.renderRoot.querySelector('button');
      console.log('el', el, el.renderRoot);

      expect(el).to.exist;
    });

    // it('should have a proper aria-label', () => {
    //   const button = el.renderRoot.querySelector('button');
    //
    //   expect(button).to.exist;
    //
    //   const ariaLabel = button!.getAttribute('aria-label');
    //
    //   expect(ariaLabel).to.equal('1, page');
    // });
  });
});
