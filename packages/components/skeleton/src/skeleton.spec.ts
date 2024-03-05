import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { Skeleton } from './skeleton.js';

describe('sl-skeleton', () => {
  let el: Skeleton;

  beforeEach(async () => {
    el = await fixture(html`<sl-skeleton></sl-skeleton>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should have an aria busy', () => {
    expect(el).to.have.attribute('aria-busy', 'true');
  });

  it('should have a shimmer effect by default', () => {
    expect(el).to.have.attribute('effect', 'shimmer');
  });

  it('should have a pulse effect when set', async () => {
    el.effect = 'pulse';
    await el.updateComplete;

    const effect = el.getAttribute('effect');
    expect(effect).to.equal('pulse');
  });

  it('should have a shimmer effect when set', async () => {
    el.effect = 'shimmer';
    await el.updateComplete;

    const effect = el.getAttribute('effect');
    expect(effect).to.equal('shimmer');
  });

  it('should have a sheen effect when set', async () => {
    el.effect = 'sheen';
    await el.updateComplete;

    const effect = el.getAttribute('effect');
    expect(effect).to.equal('sheen');
  });

  it('should have no effect when set to none', async () => {
    el.effect = 'none';
    await el.updateComplete;

    const effect = el.getAttribute('effect');
    expect(effect).to.equal('none');
  });
});
