import type { Card } from './card.js';
import { expect, fixture, should } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';

describe('sl-card', () => {
  let el: Card;

  beforeEach(async () => {
    el = await fixture(html`<sl-card></sl-card>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });
});
