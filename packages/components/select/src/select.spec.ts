import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { sendKeys } from '@web/test-runner-commands';
import { spy } from 'sinon';
import '../register.js';
import { Select } from './select.js';
import { SelectButton } from './select-button.js';

describe('sl-select', () => {
  let el: Select;

  describe('empty', () => {
    beforeEach(async ()=> {
      el = await fixture(html`<sl-select></sl-select>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a button', () => {
      expect(el.querySelector('sl-select-button')).to.exist;
    });
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select>
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
      `);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a tabindex of 0', () => {
      expect(el).to.have.attribute('tabindex','0');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
    });

    it('should not have a placeholder', () => {
      expect(el.querySelector('sl-select-button')).not.to.have.attribute('aria-placeholder');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'Placeholder';
      await el.updateComplete;

      expect(el.querySelector('sl-select-button')).to.have.attribute('aria-placeholder','Placeholder');
    })

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
      expect(el.internals.ariaRequired).not.to.equal('true');
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(el.internals.ariaRequired).to.equal('true');
    });

    it('should be valid by default', () => {
      expect(el.valid).to.be.true;
    });

    it('should be invalid when required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;
    });

    it('should have a listbox part', () => {
      expect(el.renderRoot.querySelector('[role="listbox"]')).to.have.attribute('part', 'listbox');
    });

    it('should not have a value', () => {
      expect(el.value).to.be.null;
    });

    it('should have a value after selection', async () => {
      const button = el.querySelector('sl-select-button') as SelectButton;

      button?.click();
      await el.updateComplete;

      el.querySelector('sl-select-option')?.click();
      await el.updateComplete;

      expect(el.value).to.equal('1');
    });

    it('should fire an sl-change event when selecting an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);

      el.querySelector<SelectButton>('sl-select-button')?.click();
      await el.updateComplete;

      el.querySelector('sl-select-option')?.click();
      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
    });

    it('should mark an option as selected if it has the same value', async () => {
      el.value = '2';
      await el.updateComplete;

      expect(el.querySelector('sl-select-option[value="2"]')).to.have.attribute('selected');
    });
  });

  describe('disabled', () => {
    beforeEach(async ()=> {
      el = await fixture(html`<sl-select disabled></sl-select>`);
    });

    it('should be marked as disabled', () => {
      expect(el.disabled).to.be.true;
    });

    it('should have a tabindex of -1', () => {
      expect(el).to.have.attribute('tabindex', '-1');
      expect(el.querySelector<SelectButton>('sl-select-button')).to.have.attribute('tabindex', '-1');
    });

    it('should not toggle the expanded state when clicked', async () => {
      const button = el.querySelector<SelectButton>('sl-select-button');

      button?.click();
      await el.updateComplete;

      expect(button).not.to.have.attribute('aria-expanded');
    });

    it('should not toggle the expanded state on enter', async () => {
      const button = el.querySelector<SelectButton>('sl-select-button');

      button?.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(button).not.to.have.attribute('aria-expanded');
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-select required>
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
      `);
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
    });

    it('should have a validation message', () => {
      expect(el.validationMessage).to.equal('An option must be selected.');
    });

    it('should have a show-validity attribute when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'invalid');
    });

    it('should emit an update-validity event when reported', async () => {
      const onUpdateValidity = spy();

      el.addEventListener('sl-update-validity', onUpdateValidity);
      el.reportValidity();
      await el.updateComplete;

      expect(onUpdateValidity).to.have.been.calledOnce;
    });

    it('should be valid when an option is selected', async () => {
      el.querySelector<SelectButton>('sl-select-button')?.click();
      await el.updateComplete;

      el.querySelector('sl-select-option')?.click();
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });
  });

  describe('form integration', () => {
    let form: HTMLFormElement;

    describe('selected', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-select value="2">
              <sl-select-option value="1">Option 1</sl-select-option>
              <sl-select-option value="2">Option 2</sl-select-option>
              <sl-select-option value="3">Option 3</sl-select-option>
            </sl-select>
          </form>
        `);

        el = form.firstElementChild as Select;
      });

      it('should revert back to the correct initial state when the form is reset', async () => {
        el.querySelector<SelectButton>('sl-select-button')?.click();
        await el.updateComplete;

        el.querySelector('sl-select-option')?.click();
        await el.updateComplete;

        expect(el.value).to.equal('1');

        el.formResetCallback();

        expect(el.value).to.equal('2');
      });
    });

    describe('unselected', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-select>
              <sl-select-option value="1">Option 1</sl-select-option>
              <sl-select-option value="2">Option 2</sl-select-option>
              <sl-select-option value="3">Option 3</sl-select-option>
            </sl-select>
          </form>
        `);

        el = form.firstElementChild as Select;
      });

      it('should revert back to the correct initial state when the form is reset', async () => {
        el.querySelector<SelectButton>('sl-select-button')?.click();
        await el.updateComplete;

        el.querySelector('sl-select-option')?.click();
        await el.updateComplete;

        expect(el.value).to.equal('1');

        el.formResetCallback();

        expect(el.value).to.be.null
      });
    });
  });

  // afterEach(async () => {
  //   el.listbox?.hidePopover();
  // });

  // describe('string options', () => {
  //   describe('nothing selected', () => {
  //     beforeEach(async () => {
  //       el = await fixture(html`
  //         <sl-select max-overlay-height="200px">
  //           <sl-select-option>Won't say</sl-select-option>
  //           <sl-select-option-group group-heading="europe">
  //             <sl-select-option>Finland</sl-select-option>
  //             <sl-select-option>The Netherlands</sl-select-option>
  //           </sl-select-option-group>
  //           <sl-select-option>Somewhere else</sl-select-option>
  //         </sl-select>
  //       `);
  //     });

  //     it('should render correctly', () => {
  //       expect(el).shadowDom.to.equalSnapshot();
  //     });

  //     it('should list all options in the correct order', () => {
  //       const options = Array.from(el.querySelectorAll('sl-select-option')).map(option => option.textContent?.trim());

  //       expect(options).to.eql(['Won\'t say', 'Finland', 'The Netherlands', 'Somewhere else']);
  //     });

  //     it('should not have a selected option', () => {
  //       expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');
  //     });

  //     it('should have a set maximum overlay height', () => {
  //       expect(el.listbox?.style.getPropertyValue('--max-overlay-height')).to.equal('200px');
  //     })

  //     it('should have a placeholder when one is set', async () => {
  //       expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');

  //       el.placeholder = 'Placeholder';
  //       await el.updateComplete;
  //       expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('Placeholder');

  //       el.placeholder = undefined;
  //       await el.updateComplete;
  //       expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');
  //     });

  //     it('should show the options when the button is clicked', async () => {
  //       el.listbox?.showPopover();
  //       await new Promise(resolve => setTimeout(resolve));

  //       expect(el.button).to.have.attribute('aria-expanded','true');
  //     });

  //     it('should select the clicked option and close the dialog', async () => {
  //       el.listbox?.showPopover();
  //       const clickEvent = new Event('click',{bubbles:true});
  //       el.options[1].dispatchEvent(clickEvent);

  //       await new Promise(resolve => setTimeout(resolve));
  //       expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal(options[1]);
  //       expect(el.button).to.have.attribute('aria-expanded','false');
  //     });

  //     it('should open and close the dialog with keyboard navigation', async () => {
  //       el.button?.focus();
  //       await sendKeys({ press: 'Enter' });

  //       await new Promise(resolve => setTimeout(resolve));
  //       expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('');
  //       expect(el.button).to.have.attribute('aria-expanded','true');
  //       await sendKeys({ press: 'ArrowDown' });
  //       await sendKeys({ press: 'Enter' });

  //       await new Promise(resolve => setTimeout(resolve));
  //       expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal(options[1]);
  //       expect(el.button).to.have.attribute('aria-expanded','false');

  //       await sendKeys({ press: 'Enter' });
  //       expect(el.button).to.have.attribute('aria-expanded','true');
  //       await sendKeys({ press: 'Escape' });
  //       expect(el.button).to.have.attribute('aria-expanded','false');
  //     });
  //   });

  //   describe('preselected item', () => {
  //     beforeEach(async () => {
  //       el = await fixture(html`
  //         <sl-select>
  //           <sl-select-option>Won't say</sl-select-option>
  //           <sl-select-option-group title="europe">
  //             <sl-select-option>Finland</sl-select-option>
  //             <sl-select-option selected>The Netherlands</sl-select-option>
  //           </sl-select-option-group>
  //           <sl-select-option>Somewhere else</sl-select-option>
  //         </sl-select>
  //       `);
  //     });

  //     it('should render correctly', () => {
  //       expect(el).shadowDom.to.equalSnapshot();
  //     });

  //     it('should have a selected option', () => {
  //       expect(el.renderRoot.querySelector('button span')?.textContent?.trim()).to.equal('The Netherlands');
  //     });

  //     it('should not have a set maximum overlay height', () => {
  //       expect(el.listbox?.style.getPropertyValue('--max-overlay-height')).to.equal('');
  //     });
  //   });
  // });

  // describe('element options', () => {
  //   describe('nothing selected', () => {
  //     beforeEach(async () => {
  //       el = await fixture(html`
  //         <sl-select>
  //           <sl-select-option value="unicorn"><sl-icon name="unicorn"></sl-icon></sl-select-option>
  //           <sl-select-option-group title="animals">
  //             <sl-select-option value="whale"><sl-icon name="whale"></sl-icon></sl-select-option>
  //             <sl-select-option value="narwhal"><sl-icon name="narwhal"></sl-icon></sl-select-option>
  //           </sl-select-option-group>
  //           <sl-select-option value="pinata"><sl-icon name="pinata"></sl-icon></sl-select-option>
  //         </sl-select>
  //       `);
  //     });

  //     it('should render correctly', () => {
  //       expect(el).shadowDom.to.equalSnapshot();
  //     });

  //     it('should list all options in the correct order', () => {
  //       const options = [
  //         `unicorn`,
  //         `whale`,
  //         `narwhal`,
  //         `pinata`,
  //       ];

  //       expect(el.options).to.have.length(4);

  //       el.options.forEach((option, index) =>
  //         expect(option.querySelector('sl-icon')?.getAttribute('name')).to.equal(options[index])
  //       );
  //     });

  //     it('should show the options when the button is clicked', async () => {
  //       el.listbox?.showPopover();
  //       await new Promise(resolve => setTimeout(resolve));

  //       expect(el.button).to.have.attribute('aria-expanded','true');
  //     });
  //   });

  //   describe('preselected item', () => {
  //     beforeEach(async () => {
  //       el = await fixture(html`
  //         <sl-select>
  //           <sl-select-option value="unicorn"><sl-icon name="unicorn"></sl-icon></sl-select-option>
  //           <sl-select-option-group title="animals">
  //             <sl-select-option value="whale" selected><sl-icon name="whale"></sl-icon></sl-select-option>
  //             <sl-select-option value="narwhal"><sl-icon name="narwhal"></sl-icon></sl-select-option>
  //           </sl-select-option-group>
  //           <sl-select-option value="pinata"><sl-icon name="pinata"></sl-icon></sl-select-option>
  //         </sl-select>
  //       `);
  //     });

  //     it('should render correctly', () => {
  //       expect(el).shadowDom.to.equalSnapshot();
  //     });

  //     it('should have a selected option', () => {
  //       expect(el.renderRoot.querySelector('button span sl-icon')).to.have.attribute('name','whale');
  //     });
  //   });
  // });
});
