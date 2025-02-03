import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { SelectOptionGroup } from './select-option-group.js';

describe('sl-select-option-group', () => {
  let el: SelectOptionGroup;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-select-option-group>
        <sl-select-option>yes</sl-select-option>
        <sl-select-option>no</sl-select-option>
      </sl-select-option-group>
    `);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should have a group role', () => {
    expect(el).to.have.attribute('role', 'group');
  });

  it('should have no group title by default', () => {
    expect(el).not.to.have.attribute('aria-label');
  });

  it('should show the group title when there is one', async () => {
    el.heading = 'group 1';
    await el.updateComplete;

    expect(el).to.have.attribute('aria-label', 'group 1');
    expect(el.renderRoot.querySelector('span')).to.have.text('group 1');
  });
});
