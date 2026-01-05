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

    it('should not be current by default', () => {
      expect(el).not.to.have.attribute('current');
      expect(el.current).not.to.be.true;
    });

    it('should render a default slot', () => {
      const slot = el.renderRoot.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-breadcrumb-item disabled>Item</sl-breadcrumb-item>`);
    });

    it('should have a disabled attribute', () => {
      expect(el).to.have.attribute('disabled');
    });
  });

  describe('current', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-breadcrumb-item current>Item</sl-breadcrumb-item>`);
    });

    it('should have a current attribute', () => {
      expect(el).to.have.attribute('current');
    });

    it('should have aria-current="page"', () => {
      expect(el).to.have.attribute('aria-current', 'page');
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
