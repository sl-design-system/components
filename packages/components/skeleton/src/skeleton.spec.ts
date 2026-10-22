import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import './register.js';
import { Skeleton } from './skeleton.js';

describe('sl-skeleton', () => {
  let el: Skeleton;

  beforeEach(async () => {
    el = await fixture(html`<sl-skeleton></sl-skeleton>`);
  });

  it('should have an aria busy', () => {
    expect(el).to.have.attribute('aria-busy', 'true');
  });

  it('should not have a default effect', () => {
    expect(el).not.to.have.attribute('effect');
    expect(el.effect).to.be.undefined;
  });

  it('should have a pulse effect when set', async () => {
    el.effect = 'pulse';
    await el.updateComplete;

    expect(el).to.have.attribute('effect', 'pulse');
  });

  it('should have a shimmer effect when set', async () => {
    el.effect = 'shimmer';
    await el.updateComplete;

    expect(el).to.have.attribute('effect', 'shimmer');
  });

  it('should have a sheen effect when set', async () => {
    el.effect = 'sheen';
    await el.updateComplete;

    expect(el).to.have.attribute('effect', 'sheen');
  });

  it('should have no effect when set to none', async () => {
    el.effect = 'none';
    await el.updateComplete;

    expect(el).to.have.attribute('effect', 'none');
    expect(window.getComputedStyle(el).animationName).to.equal('none');
    expect(window.getComputedStyle(el).backgroundImage).to.equal('none');
  });

  it('should remove gradient and disable animation when effect is set to none', async () => {
    expect(window.getComputedStyle(el).backgroundImage).to.contain('linear-gradient');

    el.effect = 'none';
    await el.updateComplete;

    expect(el).to.have.attribute('effect', 'none');
    expect(window.getComputedStyle(el).animationName).to.equal('none');
    expect(window.getComputedStyle(el).backgroundImage).to.equal('none');
  });

  it('should have no animation or gradient when rendered with effect="none"', async () => {
    const noneEl = await fixture<Skeleton>(html`<sl-skeleton effect="none"></sl-skeleton>`);

    expect(noneEl).to.have.attribute('effect', 'none');
    expect(window.getComputedStyle(noneEl).animationName).to.equal('none');
    expect(window.getComputedStyle(noneEl).backgroundImage).to.equal('none');
  });

  it("should have a CSS rule for :host([effect='none']) with animation: none and plain background", () => {
    const stylesheet = Skeleton.styles as CSSStyleSheet;
    const rules = Array.from(stylesheet.cssRules) as CSSStyleRule[];
    const noneRule = rules.find(
      rule => rule.selectorText?.includes('effect') && rule.selectorText?.includes('none')
    );

    expect(noneRule).to.exist;
    expect(noneRule?.style.animationName).to.equal('none');
    expect(noneRule?.style.background).to.contain('var(--sl-color-skeleton-plain)');
  });

  it('should not have a default variant', () => {
    expect(el).not.to.have.attribute('variant');
    expect(el.variant).to.be.undefined;
  });

  it('should have a circle variant when set', async () => {
    el.variant = 'circle';
    await el.updateComplete;

    expect(el).to.have.attribute('variant', 'circle');
  });
});
