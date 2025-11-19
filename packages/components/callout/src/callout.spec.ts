import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { Callout } from './callout.js';

describe('sl-callout', () => {
  let el: Callout;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-callout>Callout component</sl-callout>`);
    });

    it('should not have an explicit density', () => {
      expect(el).not.to.have.attribute('density');
      expect(el.density).to.be.undefined;
    });

    it('should not have an explicit variant', () => {
      expect(el).not.to.have.attribute('variant');
      expect(el.variant).to.be.undefined;
    });

    it('should have positive variant when set', async () => {
      el.variant = 'positive';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'positive');
    });

    it('should have caution variant when set', async () => {
      el.variant = 'caution';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'caution');
    });

    it('should have negative variant when set', async () => {
      el.variant = 'negative';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'negative');
    });
  });

  describe('no title', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-callout>Callout component text</sl-callout>`);
    });

    it('should not display a title', () => {
      const title = el.renderRoot.querySelector('[part="title"]')!;

      expect(title).to.exist;
      expect(getComputedStyle(title).display).to.equal('none');
    });

    it('should have the no-title attribute set', () => {
      expect(el).to.have.attribute('no-title');
    });
  });
});
