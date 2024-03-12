import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
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
    expect(el).to.have.attribute('aria-selected', 'false');
    expect(el).to.have.attribute('aria-disabled', 'false');
  });

  it('should have the correct attributes', () => {
    expect(el).to.have.attribute('slot', 'tabs');
    expect(el).to.have.attribute('role', 'tab');
  });

  it('should have the correct aria values when disabled and selected', async () => {
    el.selected = true;
    el.disabled = true;

    await el.updateComplete;

    expect(el).to.have.attribute('aria-selected', 'true');
    expect(el).to.have.attribute('aria-disabled', 'true');
  });
});
