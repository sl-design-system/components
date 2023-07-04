import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { Select } from './select.js';

describe('sl-select', () => {
  let el: Select;

  describe('nothing selected', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select>
          <sl-select-option>Won't say</sl-select-option>
          <sl-select-option-group title="europe">
            <sl-select-option>Finland</sl-select-option>
            <sl-select-option>The Netherlands</sl-select-option>
          </sl-select-option-group>
          <sl-select-option>Somewhere else</sl-select-option>
        </sl-select>`);
    });
  
    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should list all options in the correct order', () => {
      const options = [
        `Won't say`,
        `Finland`,
        `The Netherlands`,
        `Somewhere else`,
      ];
      expect(el.allOptions).to.have.length(4);
      el.allOptions.forEach((option, index) => 
          expect(option.textContent).to.equal(options[index])
      );
    });

    it('should not have a selected option', () => {
      expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');
    });

    it('should show the options when the button is clicked', () => {
      el.renderRoot.querySelector('button')?.click();
      expect(el.dialog).to.have.attribute('popover-open');
    });
  });

  describe('preselected item', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select>
          <sl-select-option>Won't say</sl-select-option>
          <sl-select-option-group title="europe">
            <sl-select-option>Finland</sl-select-option>
            <sl-select-option selected>The Netherlands</sl-select-option>
          </sl-select-option-group>
          <sl-select-option>Somewhere else</sl-select-option>
        </sl-select>`);
    });
  
    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a selected option', () => {
      expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('The Netherlands');
    });
  });
});
