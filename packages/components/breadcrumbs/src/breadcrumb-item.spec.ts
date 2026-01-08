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

  describe('content slot', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-breadcrumb-item>Item content</sl-breadcrumb-item>`);
    });

    it('should have has-content attribute when content is provided', () => {
      expect(el).to.have.attribute('has-content');
    });
  });
});
