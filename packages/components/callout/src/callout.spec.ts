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

    it('should have success variant when set', async () => {
      el.variant = 'success';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'success');
    });
  });

  describe('icons', () => {
    it('should render the info icon by default', async () => {
      el = await fixture(html`<sl-callout>Callout component</sl-callout>`);

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'info');
    });

    it('should render the circle-check-solid icon for the success variant', async () => {
      el = await fixture(html`<sl-callout variant="success">Callout component</sl-callout>`);

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'circle-check-solid');
    });

    it('should render the triangle-exclamation-solid icon for the warning variant', async () => {
      el = await fixture(html`<sl-callout variant="warning">Callout component</sl-callout>`);

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'triangle-exclamation-solid');
    });

    it('should render the octagon-xmark-solid icon for the danger variant', async () => {
      el = await fixture(html`<sl-callout variant="danger">Callout component</sl-callout>`);

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'octagon-xmark-solid');
    });
  });

  describe('no title', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-callout>Callout component text</sl-callout>`);
    });

    it('should not display a title', () => {
      const title = el.renderRoot.querySelector('[part="title"]')!;

      expect(title).to.exist;
      expect(title).to.have.style('display', 'none');
    });

    it('should have the no-title attribute set', () => {
      expect(el).to.have.attribute('no-title');
    });
  });
});
