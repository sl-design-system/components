import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import './register.js';
import { Tab } from './tab.js';

describe('sl-tab', () => {
  let el: Tab;

  beforeEach(async () => {
    el = await fixture(html`<sl-tab></sl-tab>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should have the correct aria values', () => {
    expect(el).attribute('aria-selected').to.equal('false');
    expect(el).attribute('aria-disabled').to.equal('false');
  });

  it('should have the correct attributes', () => {
    expect(el).attribute('slot').to.equal('tabs');
    expect(el).attribute('role').to.equal('tab');
  });

  it('should have the correct aria values', async () => {
    el.selected = true;
    el.disabled = true;

    await el.updateComplete;

    expect(el).attribute('aria-selected').to.equal('true');
    expect(el).attribute('aria-disabled').to.equal('true');
  });
});
