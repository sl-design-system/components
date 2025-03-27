import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Badge } from './badge.js';

describe('sl-badge', () => {
  let el: Badge;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-badge>99+</sl-badge>`);
    });

    it('should not have a round attribute', () => {
      expect(el).to.not.have.attribute('round');
    });

    it('should not have an explicit emphasis', () => {
      expect(el).not.to.have.attribute('emphasis');
      expect(el.emphasis).to.be.undefined;
    });

    it('should have a bold emphasis when set', async () => {
      el.emphasis = 'bold';
      await el.updateComplete;

      expect(el).to.have.attribute('emphasis', 'bold');
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should have a size when set', async () => {
      el.size = 'sm';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'sm');
    });

    it('should not have an explicit variant', () => {
      expect(el).not.to.have.attribute('variant');
      expect(el.variant).to.be.undefined;
    });

    it('should have a variant when set', async () => {
      el.variant = 'primary';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'primary');
    });
  });

  describe('icon only', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-badge><sl-icon name="check"></sl-icon></sl-badge>`);
    });

    it('should have a round attribute', () => {
      expect(el).to.have.attribute('round');
    });
  });

  describe('single character', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-badge>9</sl-badge>`);
    });

    it('should have a round attribute', () => {
      expect(el).to.have.attribute('round');
    });
  });
});
