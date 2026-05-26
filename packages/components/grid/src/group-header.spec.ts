import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { GridGroupHeader } from './group-header.js';

customElements.define('sl-grid-group-header', GridGroupHeader);

describe('sl-grid-group-header', () => {
  let el: GridGroupHeader;

  describe('aria-expanded attribute', () => {
    describe('defaults', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-grid-group-header></sl-grid-group-header>`);
      });

      it('should have aria-expanded="true" on the toggle button', () => {
        const button = el.renderRoot.querySelector('sl-button')?.renderRoot.querySelector('button');

        expect(button).to.have.attribute('aria-expanded', 'true');
      });
    });

    describe('when collapsed is true', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-grid-group-header collapsed></sl-grid-group-header>`);
      });

      it('should have aria-expanded="false" on the toggle button', () => {
        const button = el.renderRoot.querySelector('sl-button')?.renderRoot.querySelector('button');

        expect(button).to.have.attribute('aria-expanded', 'false');
      });
    });

    describe('when clicking the toggle button', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-grid-group-header></sl-grid-group-header>`);
      });

      it('should update aria-expanded from "true" to "false"', async () => {
        const button = el.renderRoot.querySelector('sl-button')!;
        const innerButton = button.renderRoot.querySelector('button');

        expect(innerButton).to.have.attribute('aria-expanded', 'true');

        button.click();
        await el.updateComplete;
        await button.updateComplete;

        expect(innerButton).to.have.attribute('aria-expanded', 'false');
      });

      it('should toggle aria-expanded back from "false" to "true" on second click', async () => {
        const button = el.renderRoot.querySelector('sl-button')!;
        const innerButton = button.renderRoot.querySelector('button');

        button.click();
        await el.updateComplete;
        await button.updateComplete;

        expect(innerButton).to.have.attribute('aria-expanded', 'false');

        button.click();
        await el.updateComplete;
        await button.updateComplete;

        expect(innerButton).to.have.attribute('aria-expanded', 'true');
      });
    });
  });
});
