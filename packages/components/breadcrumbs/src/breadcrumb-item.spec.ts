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

    it('should have a link role', () => {
      expect(el).to.have.attribute('role', 'link');
    });

    it('should have tabindex 0', () => {
      expect(el).to.have.attribute('tabindex', '0');
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should not be current by default', () => {
      expect(el).not.to.have.attribute('current');
      expect(el.current).not.to.be.true;
    });

    it('should not be collapsed by default', () => {
      expect(el).not.to.have.attribute('collapsed');
      expect(el.collapsed).not.to.be.true;
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

    it('should prevent click events when disabled', () => {
      let clicked = false;
      el.addEventListener('click', (e: Event) => {
        if (!e.defaultPrevented) {
          clicked = true;
        }
      });

      el.click();

      expect(clicked).to.be.false;
    });

    it('should not respond to keyboard events when disabled', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      el.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
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

    it('should have tabindex -1', () => {
      expect(el).to.have.attribute('tabindex', '-1');
    });

    it('should prevent click events when current', () => {
      let clicked = false;
      el.addEventListener('click', (e: Event) => {
        if (!e.defaultPrevented) {
          clicked = true;
        }
      });

      el.click();

      expect(clicked).to.be.false;
    });

    it('should not respond to keyboard events when current', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      el.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('collapsed', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-breadcrumb-item collapsed>Item</sl-breadcrumb-item>`);
    });

    it('should have a collapsed attribute', () => {
      expect(el).to.have.attribute('collapsed');
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-breadcrumb-item>Item</sl-breadcrumb-item>`);
    });

    it('should trigger click when Enter key is pressed', () => {
      let clicked = false;
      el.addEventListener('click', () => {
        clicked = true;
      });

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(clicked).to.be.true;
    });

    it('should trigger click when Space key is pressed', () => {
      let clicked = false;
      el.addEventListener('click', () => {
        clicked = true;
      });

      el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(clicked).to.be.true;
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
