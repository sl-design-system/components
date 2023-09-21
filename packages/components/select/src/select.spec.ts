import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { sendKeys } from '@web/test-runner-commands';
import '../register.js';
import { Select } from './select.js';

describe('sl-select', () => {
  let el: Select;
  afterEach(async () => {
    el.dialog?.hidePopover();
  });
  describe('string options', () => {
    const options = [
      `Won't say`,
      `Finland`,
      `The Netherlands`,
      `Somewhere else`,
    ];
    describe('nothing selected', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-select max-overlay-height="200px">
            <sl-select-option>Won't say</sl-select-option>
            <sl-select-option-group group-heading="europe">
              <sl-select-option>Finland</sl-select-option>
              <sl-select-option>The Netherlands</sl-select-option>
            </sl-select-option-group>
            <sl-select-option>Somewhere else</sl-select-option>
          </sl-select>`);
      });
      afterEach(() => {
        el.allOptions.forEach(option => option.removeAttribute('selected'));
      });
    
      it('should render correctly', () => {
        expect(el).shadowDom.to.equalSnapshot();
      });

      it('should list all options in the correct order', () => {
        expect(el.allOptions).to.have.length(4);
        el.allOptions.forEach((option, index) => 
            expect(option.textContent).to.equal(options[index])
        );
      });

      it('should not have a selected option', () => {
        expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');
      });
      
      it('should have a set maximum overlay height', () => {
        expect(el.dialog?.style.getPropertyValue('--max-overlay-height')).to.equal('200px');
      })
      
      it('should have a placeholder when one is set', async () => {
        expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');

        el.placeholder = 'Placeholder';
        await el.updateComplete;
        expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('Placeholder');
       
        el.placeholder = undefined;
        await el.updateComplete;
        expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');
      });

      it('should show the options when the button is clicked', async () => {
        el.dialog?.showPopover();
        await new Promise(resolve => setTimeout(resolve));

        expect(el.button).to.have.attribute('aria-expanded','true');
      });

      it('should select the clicked option and close the dialog', async () => {
        el.dialog?.showPopover();
        const clickEvent = new Event('click',{bubbles:true});        
        el.allOptions[1].dispatchEvent(clickEvent);

        await new Promise(resolve => setTimeout(resolve));
        expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal(options[1]);
        expect(el.button).to.have.attribute('aria-expanded','false');
      });

      it('should open and close the dialog with keyboard navigation', async () => {
        el.button?.focus();
        await sendKeys({ press: 'Enter' });

        await new Promise(resolve => setTimeout(resolve));
        expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');
        expect(el.button).to.have.attribute('aria-expanded','true');
        await sendKeys({ press: 'ArrowDown' });
        await sendKeys({ press: 'Enter' });
        
        await new Promise(resolve => setTimeout(resolve));
        expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal(options[1]);
        expect(el.button).to.have.attribute('aria-expanded','false');
        
        await sendKeys({ press: 'Enter' });
        expect(el.button).to.have.attribute('aria-expanded','true');
        await sendKeys({ press: 'Escape' });
        expect(el.button).to.have.attribute('aria-expanded','false');
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

      it('should not have a set maximum overlay height', () => {
        expect(el.dialog?.style.getPropertyValue('--max-overlay-height')).to.equal('');
      });
    });
  });

  describe('element options', () => {
    describe('nothing selected', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-select>
            <sl-select-option value="unicorn"><sl-icon name="unicorn"></sl-icon></sl-select-option>
            <sl-select-option-group title="animals">
              <sl-select-option value="whale"><sl-icon name="whale"></sl-icon></sl-select-option>
              <sl-select-option value="narwhal"><sl-icon name="narwhal"></sl-icon></sl-select-option>
            </sl-select-option-group>
            <sl-select-option value="pinata"><sl-icon name="pinata"></sl-icon></sl-select-option>
          </sl-select>`);
      });
    
      it('should render correctly', () => {
        expect(el).shadowDom.to.equalSnapshot();
      });

      it('should list all options in the correct order', () => {
        const options = [
          `unicorn`,
          `whale`,
          `narwhal`,
          `pinata`,
        ];
        expect(el.allOptions).to.have.length(4);
        el.allOptions.forEach((option, index) => 
            expect(option.querySelector('sl-icon')?.getAttribute('name')).to.equal(options[index])
        );
      });

      it('should show the options when the button is clicked', async () => {
        el.dialog?.showPopover();
        await new Promise(resolve => setTimeout(resolve));

        expect(el.button).to.have.attribute('aria-expanded','true');
      });
    });

    describe('preselected item', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-select>
            <sl-select-option value="unicorn"><sl-icon name="unicorn"></sl-icon></sl-select-option>
            <sl-select-option-group title="animals">
              <sl-select-option value="whale" selected><sl-icon name="whale"></sl-icon></sl-select-option>
              <sl-select-option value="narwhal"><sl-icon name="narwhal"></sl-icon></sl-select-option>
            </sl-select-option-group>
            <sl-select-option value="pinata"><sl-icon name="pinata"></sl-icon></sl-select-option>
          </sl-select>`);
      });
    
      it('should render correctly', () => {
        expect(el).shadowDom.to.equalSnapshot();
      });

      it('should have a selected option', () => {
        expect(el.renderRoot.querySelector('button span sl-icon')).to.have.attribute('name','whale');
      });
    });
  });
});
