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

    it('should have subtle emphasis', () => {
      expect(el.emphasis).to.equal('subtle');
      expect(el).to.have.attribute('emphasis', 'subtle');
    });

    it('should have medium size', () => {
      expect(el.size).to.equal('md');
      expect(el).to.have.attribute('size', 'md');
    });

    it('should have neutral variant', () => {
      expect(el.variant).to.equal('neutral');
      expect(el).to.have.attribute('variant', 'neutral');
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
