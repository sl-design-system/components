import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { TabPanel } from './tab-panel.js';

describe('sl-tab-panel', () => {
  let el: TabPanel;

  beforeEach(async () => {
    el = await fixture(html`<sl-tab-panel></sl-tab-panel>`);
  });

  it('should have a tabpanel role', () => {
    expect(el).to.have.attribute('role', 'tabpanel');
  });
});
