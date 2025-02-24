import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type OptionGroup } from './option-group.js';

describe('sl-option-group', () => {
  let el: OptionGroup;

  beforeEach(async () => {
    el = await fixture(html`<sl-option-group></sl-option-group>`);
  });

  it('should have a group role', () => {
    expect(el).to.have.attribute('role', 'group');
  });

  it('should not have a label by default', () => {
    expect(el.label).to.be.undefined;
    expect(el.renderRoot.querySelector('.label')).to.not.exist;
  });

  it('should have a label when set', async () => {
    el.label = 'Group label';
    await el.updateComplete;

    const header = el.renderRoot.querySelector('sl-option-group-header');

    expect(header).to.exist;
    expect(header).to.have.text('Group label');
  });
});
