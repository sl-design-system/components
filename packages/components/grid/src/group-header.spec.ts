import { type Button } from '@sl-design-system/button';
import { getForwardedAriaAttribute } from '@sl-design-system/shared/helpers/forward-aria.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { GridGroupHeader } from './group-header.js';

try {
  if (!customElements.get('sl-grid-group-header')) {
    customElements.define('sl-grid-group-header', GridGroupHeader);
  }
} catch {
  // empty
}

describe('sl-grid-group-header', () => {
  let el: GridGroupHeader;

  describe('aria-expanded attribute', () => {
    describe('defaults', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-grid-group-header></sl-grid-group-header>`);
      });

      it('should have aria-expanded="true" on the toggle button', () => {
        const button = el.renderRoot.querySelector<Button>('sl-button');

        expect(button).to.exist;
        expect(getForwardedAriaAttribute(button!, 'aria-expanded')).to.equal('true');
      });
    });

    describe('when collapsed is true', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-grid-group-header collapsed></sl-grid-group-header>`);
      });

      it('should have aria-expanded="false" on the toggle button', () => {
        const button = el.renderRoot.querySelector<Button>('sl-button');

        expect(button).to.exist;
        expect(getForwardedAriaAttribute(button!, 'aria-expanded')).to.equal('false');
      });
    });

    describe('when clicking the toggle button', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-grid-group-header></sl-grid-group-header>`);
      });

      it('should update aria-expanded from "true" to "false"', async () => {
        const button = el.renderRoot.querySelector<Button>('sl-button');

        expect(button).to.exist;
        expect(getForwardedAriaAttribute(button!, 'aria-expanded')).to.equal('true');

        button!.click();
        await el.updateComplete;
        await button!.updateComplete;

        expect(getForwardedAriaAttribute(button!, 'aria-expanded')).to.equal('false');
      });

      it('should toggle aria-expanded back from "false" to "true" on second click', async () => {
        const button = el.renderRoot.querySelector<Button>('sl-button');

        expect(button).to.exist;

        button!.click();
        await el.updateComplete;
        await button!.updateComplete;

        expect(getForwardedAriaAttribute(button!, 'aria-expanded')).to.equal('false');

        button!.click();
        await el.updateComplete;
        await button!.updateComplete;

        expect(getForwardedAriaAttribute(button!, 'aria-expanded')).to.equal('true');
      });
    });
  });
});
