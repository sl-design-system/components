import type { badge } from './badge.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';

describe('dna-badge', () => {
  let el: badge;

  beforeEach(async () => {
    el = await fixture(html`<sl-badge></sl-badge>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });
});
