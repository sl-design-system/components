import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { SelectOptionGroup } from './select-option-group.js';

describe('sl-select-option-group', () => {
  let el: SelectOptionGroup;

  describe('default (string)', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-option-group><sl-select-option>yes</sl-select-option><sl-select-option>no</sl-select-option></sl-select-option-group>`);
    });
  
    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have the correct attributes', () => {
      expect(el).attribute('role').to.equal('group');
      expect(el).attribute('aria-label').to.equal('');
    });

    it('should show the group title when there is one', async () => {
      el.setAttribute('group-heading','group 1');
      await el.updateComplete;
      expect(el.groupHeading).to.equal('group 1');
      expect(el.renderRoot.querySelector('span')).to.have.text('group 1');
    });
  });
});
