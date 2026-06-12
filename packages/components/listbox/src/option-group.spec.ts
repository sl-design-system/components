import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type OptionGroup } from './option-group.js';

describe('sl-option-group', () => {
  let el: OptionGroup;

  beforeEach(async () => {
    el = await fixture(html`<sl-option-group></sl-option-group>`);
  });

  it('should not have a group role for Safari/VoiceOver compatibility', () => {
    // We removed role="group" because it breaks Safari/VoiceOver when inside role="listbox"
    expect(el).not.to.have.attribute('role', 'group');
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

  it('should have aria-hidden="true" on the group header for Safari/VoiceOver compatibility', async () => {
    el.label = 'Group label';
    await el.updateComplete;

    const header = el.renderRoot.querySelector('sl-option-group-header');

    expect(header).to.have.attribute('aria-hidden', 'true');
  });

  it('should consume and remove the label attribute from markup', async () => {
    const group = await fixture<OptionGroup>(
      html`<sl-option-group label="Group label"></sl-option-group>`
    );
    await group.updateComplete;

    expect(group).not.to.have.attribute('label');
    expect(group.label).to.equal('Group label');
    expect(group.renderRoot.querySelector('sl-option-group-header')).to.have.text('Group label');
  });

  it('should consume and remove label when attribute is set later', async () => {
    el.setAttribute('label', 'Later label');
    await el.updateComplete;

    expect(el).not.to.have.attribute('label');
    expect(el.label).to.equal('Later label');
    expect(el.renderRoot.querySelector('sl-option-group-header')).to.have.text('Later label');
  });
});
