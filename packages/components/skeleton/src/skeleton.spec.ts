import { fixture } from '@open-wc/testing';
import { expect } from 'chai';
import { html } from 'lit';
import '../register.js';
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
