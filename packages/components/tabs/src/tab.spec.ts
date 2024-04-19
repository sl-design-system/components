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

  it('should have a tab role', () => {
    expect(el).to.have.attribute('role', 'tab');
  });

  it('should have a tabs slot', () => {
    expect(el).to.have.attribute('slot', 'tabs');
  });

  it('should not be disabled by default', () => {
    expect(el).not.to.have.attribute('disabled');
    expect(el.disabled).not.to.be.true;
  });

  it('should be disabled when set', async () => {
    el.disabled = true;
    await el.updateComplete;

    expect(el).to.have.attribute('disabled');
  });

  it('should not be selected by default', () => {
    expect(el).not.to.have.attribute('aria-selected');
    expect(el.selected).not.to.be.true;
  });

  it('should be selected when set', async () => {
    el.setAttribute('selected', '');
    await el.updateComplete;

    expect(el).to.have.attribute('aria-selected', 'true');
    expect(el.selected).to.be.true;
  });
});
