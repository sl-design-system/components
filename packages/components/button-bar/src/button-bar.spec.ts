import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type ButtonBar, type ButtonBarAlign } from './button-bar.js';

describe('sl-button-bar', () => {
  let el: ButtonBar;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-button-bar>
          <sl-button>Foo</sl-button>
          <sl-button>Bar</sl-button>
          <sl-button aria-label="Close">
            <sl-icon name="close"></sl-icon>
          </sl-button>
        </sl-button-bar>
      `);
    });

    it('should not have an alignment', () => {
      expect(el).not.to.have.attribute('align');
    });

    ['center', 'end', 'space-between', 'start'].forEach(align => {
      it(`should support ${align} alignment`, async () => {
        el.align = align as ButtonBarAlign;
        await el.updateComplete;

        expect(el).to.have.attribute('align', align);
      });
    });

    it('should not reverse the order', () => {
      expect(el).not.to.have.attribute('reverse');
      expect(el.reverse).not.to.be.true;
    });

    it('should reverse the order when set', async () => {
      el.reverse = true;
      await el.updateComplete;

      expect(el).to.have.attribute('reverse');
    });

    it('should not be icon-only when there are no only icon-only buttons', () => {
      expect(el).not.to.have.attribute('icon-only');
      expect(el).not.to.match(':state(icon-only)');
      expect(el.iconOnly).not.to.be.true;
    });

    it('should not be empty', () => {
      expect(el).not.to.match(':state(empty)');
    });

    it('should not have a size', () => {
      expect(el.size).to.be.undefined;
    });

    it('should propagate size to the buttons', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      el.size = 'lg';
      await el.updateComplete;

      expect(buttons.map(b => b.size)).to.deep.equal(['lg', 'lg', 'lg']);
    });

    it('should propagate fill to the buttons', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      el.fill = 'ghost';
      await el.updateComplete;

      expect(buttons.map(b => b.fill)).to.deep.equal(['ghost', 'ghost', 'ghost']);
    });

    it('should propagate variant to the buttons', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-button'));

      el.variant = 'primary';
      await el.updateComplete;

      expect(buttons.map(b => b.variant)).to.deep.equal(['primary', 'primary', 'primary']);
    });
  });

  describe('icon only', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-button-bar>
          <sl-button aria-label="Close" fill="ghost">
            <sl-icon name="close"></sl-icon>
          </sl-button>
          <sl-button aria-label="Fullscreen" fill="ghost">
            <sl-icon name="full-screen"></sl-icon>
          </sl-button>
        </sl-button-bar>
      `);

      // Give the buttons a chance to update
      await el.updateComplete;
    });

    it('should have an icon-only attribute', () => {
      expect(el).to.have.attribute('icon-only');
    });

    it('should have the icon-only state', () => {
      expect(el).to.match(':state(icon-only)');
    });
  });

  describe('icon only with non-ghost button', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-button-bar>
          <sl-button aria-label="Close">
            <sl-icon name="close"></sl-icon>
          </sl-button>
          <sl-button aria-label="Fullscreen" fill="ghost">
            <sl-icon name="full-screen"></sl-icon>
          </sl-button>
        </sl-button-bar>
      `);

      // Give the buttons a chance to update
      await el.updateComplete;
    });

    it('should not have an icon-only attribute', () => {
      expect(el).not.to.have.attribute('icon-only');
    });

    it('should have the icon-only state', () => {
      expect(el).not.to.match(':state(icon-only)');
    });
  });

  describe('mix of icon only and buttons with text', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-button-bar>
          <sl-button fill="ghost">Foo</sl-button>
          <sl-button aria-label="Fullscreen" fill="ghost">
            <sl-icon name="full-screen"></sl-icon>
          </sl-button>
        </sl-button-bar>
      `);

      // Give the buttons a chance to update
      await el.updateComplete;
    });

    it('should not have an icon-only attribute', () => {
      expect(el).not.to.have.attribute('icon-only');
    });

    it('should not match :state(icon-only)', () => {
      expect(el.matches(':state(icon-only)')).to.be.false;
    });
  });

  describe('empty', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button-bar></sl-button-bar>`);

      // Give the component a chance to update
      await el.updateComplete;
    });

    it('should have the empty state', () => {
      expect(el).to.match(':state(empty)');
    });

    it('should not have the empty state after adding buttons', async () => {
      const button = document.createElement('sl-button');
      button.textContent = 'Test';
      el.appendChild(button);

      // Wait for the slot change and update
      await new Promise(resolve => setTimeout(resolve));

      expect(el).not.to.match(':state(empty)');
    });
  });
});
