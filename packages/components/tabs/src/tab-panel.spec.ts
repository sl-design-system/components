import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { TabPanel } from './tab-panel.js';

describe('sl-tab-panel', () => {
  let el: TabPanel;

  beforeEach(async () => {
    el = await fixture(html`<sl-tab-panel></sl-tab-panel>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should have the correct attributes', () => {
    expect(el).to.have.attribute('role','tabpanel');
  });
});
