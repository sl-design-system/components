import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { BreadcrumbItem } from './breadcrumb-item.js';

describe('sl-breadcrumb-item', () => {
  let el: BreadcrumbItem;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-breadcrumb-item>Item</sl-breadcrumb-item>`);
    });

    it('should render a default slot', () => {
      const slot = el.renderRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('click events', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-breadcrumb-item>Item</sl-breadcrumb-item>`);
    });

    it('should trigger a click event when click method is called', () => {
      let clicked = false;
      el.addEventListener('click', () => {
        clicked = true;
      });

      el.click();

      expect(clicked).to.be.true;
    });
  });
});
