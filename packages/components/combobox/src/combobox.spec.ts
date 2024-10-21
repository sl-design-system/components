import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type Combobox } from './combobox.js';
import { type CustomOption } from './custom-option.js';
import { type SelectedGroup } from './selected-group.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-combobox', () => {
  let el: Combobox, input: HTMLInputElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-combobox>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);
      // Give the embedded text field time to initialize
      await new Promise(resolve => setTimeout(resolve));

      input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should autocomplete both the input and list', () => {
      expect(el.autocomplete).to.equal('both');
      expect(input).to.have.attribute('aria-autocomplete', 'both');
    });

    it('should not filter the results in the list', () => {
      expect(el.filterResults).not.to.be.true;
    });

    it('should use single selection', () => {
      expect(el.multiple).not.to.be.true;
    });

    it('should not have a value', () => {
      expect(el.value).to.be.undefined;
      expect(input.value).to.equal('');
    });

    it('should have a value when set', async () => {
      el.value = 'Option 1';
      await el.updateComplete;

      expect(input.value).to.equal('Option 1');
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should have a large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
      expect(el.renderRoot.querySelector('sl-text-field')).to.have.attribute('size', 'lg');
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'Placeholder';
      await el.updateComplete;

      expect(el.placeholder).to.equal('Placeholder');
      expect(input).to.have.attribute('placeholder', 'Placeholder');
    });

    it('should not be select only', () => {
      expect(el.selectOnly).not.to.be.true;
    });

    it('should be select only when set', async () => {
      el.selectOnly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('select-only');
      expect(input).to.have.attribute('readonly');
    });

    it('should not be required', () => {
      expect(el.required).not.to.be.true;
      expect(input).not.to.have.attribute('required');
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(input).to.have.attribute('required');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after typing in the input', async () => {
      input.focus();
      await sendKeys({ type: 'L' });

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after typing in the input', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      input.focus();
      await sendKeys({ type: 'L' });

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after input loses focus', () => {
      input.focus();
      input.blur();

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      input.focus();
      input.blur();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should focus the input when focusing the element', () => {
      el.focus();

      expect(document.activeElement).to.equal(input);
    });

    it('should emit an sl-focus event when focusing the input', async () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      input.focus();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the input', async () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      input.focus();
      await sendKeys({ press: 'Tab' });

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when selecting an option', () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      input.click();
      el.querySelector('sl-option')?.click();

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when calling reportValidity', () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.reportValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when selecting an option', () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      input.click();
      el.querySelector('sl-option')?.click();

      expect(onValidate).to.have.been.calledOnce;
    });

    describe('input', () => {
      it('should exist', () => {
        expect(input).to.exist;
      });

      it('should have a combobox role', () => {
        expect(input).to.have.attribute('role', 'combobox');
      });

      it('should have autocomplete off', () => {
        expect(input).to.have.attribute('autocomplete', 'off');
      });

      it('should have an aria-haspopup attribute', () => {
        expect(input).to.have.attribute('aria-haspopup', 'listbox');
      });

      it('should not be expanded', () => {
        expect(input).to.have.attribute('aria-expanded', 'false');
      });

      it('should be expanded when the list is visible', async () => {
        input.click();
        await el.updateComplete;

        expect(input).to.have.attribute('aria-expanded', 'true');
      });

      it('should link the input to the listbox', () => {
        expect(input).to.have.attribute('aria-controls', el.querySelector('sl-listbox')?.id);
      });
    });
  });

  describe('allow custom values', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-combobox allow-custom-values>
          <sl-listbox>
            <sl-option>Lorem</sl-option>
            <sl-option>Ipsum</sl-option>
            <sl-option>Ipsom</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);
      input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
    });

    it('should add a create-custom-option element while typing', async () => {
      input.focus();
      await sendKeys({ type: 'Custom value' });
      await el.updateComplete;

      const createCustomOption = el.querySelector('sl-combobox-create-custom-option');

      expect(createCustomOption).to.exist;
      expect(createCustomOption).to.have.attribute('aria-current', 'true');
      expect(createCustomOption?.value).to.equal('Custom value');
    });

    it('should not add a create-custom-option element when the typed text matches an existing option', async () => {
      input.focus();
      await sendKeys({ type: 'Lorem' });
      await el.updateComplete;

      expect(el.querySelector('sl-combobox-create-custom-option')).not.to.exist;
    });

    it('should remove the create-custom-option element if the text is cleared', async () => {
      input.focus();
      await sendKeys({ type: 'Custom' });
      await el.updateComplete;

      expect(el.querySelector('sl-combobox-create-custom-option')).to.exist;

      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await el.updateComplete;

      expect(el.querySelector('sl-combobox-create-custom-option')).not.to.exist;
    });

    it('should create a custom option after pressing Enter', async () => {
      input.focus();
      await sendKeys({ type: 'Custom value' });
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      const customOption = el.querySelector('sl-listbox')?.firstElementChild as CustomOption;

      expect(customOption).to.exist;
      expect(customOption).to.match('sl-combobox-custom-option');
      expect(customOption).to.have.attribute('aria-current', 'true');
      expect(customOption).to.have.attribute('aria-selected', 'true');
      expect(customOption?.value).to.equal('Custom value');
      expect(el.value).to.equal('Custom value');
    });

    it('should create a custom option after clicking on the create-custom-option element', async () => {
      input.focus();
      await sendKeys({ type: 'Custom value' });
      el.querySelector('sl-combobox-create-custom-option')?.click();
      await el.updateComplete;

      const customOption = el.querySelector('sl-listbox')?.firstElementChild as CustomOption;

      expect(customOption).to.exist;
      expect(customOption).to.match('sl-combobox-custom-option');
      expect(customOption).to.have.attribute('aria-current', 'true');
      expect(customOption).to.have.attribute('aria-selected', 'true');
      expect(customOption?.value).to.equal('Custom value');
      expect(el.value).to.equal('Custom value');
    });

    it('should remove the custom option after deselecting it', async () => {
      input.focus();
      await sendKeys({ type: 'Custom value' });
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      const customOption = el.querySelector('sl-combobox-custom-option');

      expect(customOption).to.exist;

      customOption?.click();
      await el.updateComplete;

      expect(el.querySelector('sl-custom-option')).not.to.exist;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-combobox disabled>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);
      input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
    });

    it('should be disabled', () => {
      expect(el.disabled).to.be.true;
    });

    it('should disable the text field', () => {
      expect(el.renderRoot.querySelector('sl-text-field')).to.have.attribute('disabled');
    });

    it('should disable the input element', () => {
      expect(input).to.have.attribute('disabled');
    });
  });

  describe('single select', () => {
    describe('defaults', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox>
            <sl-listbox>
              <sl-option>Lorem</sl-option>
              <sl-option>Ipsum</sl-option>
              <sl-option>Ipsom</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should set the value when an option is selected', async () => {
        input.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        expect(el.value).to.equal('Lorem');
      });

      it('should unset the value when an option is deselected', async () => {
        const option = el.querySelector('sl-option');

        el.value = 'Lorem';
        await el.updateComplete;

        expect(option).to.have.attribute('aria-selected');

        option?.click();
        await el.updateComplete;

        expect(el.value).to.be.undefined;
      });

      it('should replace the value when a different option is selected', async () => {
        const options = Array.from(el.querySelectorAll('sl-option'));

        options.at(0)?.click();
        await el.updateComplete;

        expect(el.value).to.equal('Lorem');

        options.at(1)?.click();
        await el.updateComplete;

        expect(el.value).to.equal('Ipsum');
      });

      it('should emit an sl-change event with the value after selecting an option', async () => {
        const onChange = spy();

        el.addEventListener('sl-change', (event: SlChangeEvent) => {
          onChange(event.detail);
        });

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        expect(onChange).to.have.been.calledOnce;
        expect(onChange.lastCall.args[0]).to.equal('Lorem');
      });
    });

    describe('allow custom values', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox allow-custom-values>
            <sl-listbox>
              <sl-option>Lorem</sl-option>
              <sl-option>Ipsum</sl-option>
              <sl-option>Ipsom</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should remove the custom option after selecting a different option', async () => {
        input.focus();
        await sendKeys({ type: 'Custom value' });
        await sendKeys({ press: 'Enter' });
        await el.updateComplete;

        expect(el.querySelector('sl-combobox-custom-option')).to.exist;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        expect(el.querySelector('sl-combobox-custom-option')).not.to.exist;
      });

      it('should remove the custom option after adding a different custom option', async () => {
        input.focus();
        await sendKeys({ type: 'Foo' });
        await sendKeys({ press: 'Enter' });
        await el.updateComplete;

        const customOption = el.querySelector('sl-combobox-custom-option');

        expect(customOption).to.exist;
        expect(customOption?.value).to.equal('Foo');

        input.focus();
        input.select();
        await sendKeys({ type: 'Bar' });
        await sendKeys({ press: 'Enter' });
        await el.updateComplete;

        const customOptions = Array.from(el.querySelectorAll('sl-combobox-custom-option'));

        expect(customOptions).to.have.lengthOf(1);
        expect(customOptions.at(0)).to.exist;
        expect(customOptions.at(0)?.value).to.equal('Bar');
      });

      it('should emit an sl-change event when the custom option is created', async () => {
        const onChange = spy();

        el.addEventListener('sl-change', (event: SlChangeEvent) => {
          onChange(event.detail);
        });

        input.focus();
        await sendKeys({ type: 'Custom value' });
        await sendKeys({ press: 'Enter' });
        await el.updateComplete;

        expect(onChange).to.have.been.calledOnce;
        expect(onChange.lastCall.args[0]).to.equal('Custom value');
      });
    });

    describe('filter results', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox filter-results>
            <sl-listbox>
              <sl-option>Lorem</sl-option>
              <sl-option>Ipsum</sl-option>
              <sl-option>Ipsom</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should filter the results in the list when typing', async () => {
        input.focus();
        await sendKeys({ type: 'Ip' });

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options).to.have.lengthOf(3);
        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });

      it('should reset the results when the input is cleared', async () => {
        input.focus();
        await sendKeys({ type: 'Ip' });

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;

        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });

        expect(options[0]).to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });
    });
  });

  describe('multiple select', () => {
    describe('defaults', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox multiple>
            <sl-listbox>
              <sl-option>Lorem</sl-option>
              <sl-option>Ipsum</sl-option>
              <sl-option>Ipsom</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should support multiple selection', () => {
        expect(el.multiple).to.be.true;
      });

      it('should not have a placeholder when there is a selection', async () => {
        el.placeholder = 'Placeholder';
        await el.updateComplete;

        expect(input).to.have.attribute('placeholder', 'Placeholder');

        el.value = ['Lorem'];
        await el.updateComplete;

        expect(input).to.have.attribute('placeholder', '');
      });

      it('should set the value when an option is selected', async () => {
        input.click();
        await el.updateComplete;

        el.querySelector<HTMLElement>('sl-option:first-of-type')?.click();
        await el.updateComplete;

        expect(el.value).to.deep.equal(['Lorem']);

        el.querySelector<HTMLElement>('sl-option:last-of-type')?.click();
        await el.updateComplete;

        expect(el.value).to.deep.equal(['Lorem', 'Ipsom']);
      });

      it('should unset the value when an option is deselected', async () => {
        const options = Array.from(el.querySelectorAll('sl-option'));

        el.value = ['Lorem', 'Ipsum'];
        await el.updateComplete;

        expect(options.map(o => o.getAttribute('aria-selected') === 'true')).to.deep.equal([true, true, false]);

        options.at(0)?.click();
        await el.updateComplete;

        expect(el.value).to.deep.equal(['Ipsum']);
      });

      it('should emit an sl-change event with the value after selecting an option', async () => {
        const onChange = spy();

        el.addEventListener('sl-change', (event: SlChangeEvent) => {
          onChange(event.detail);
        });

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        expect(onChange).to.have.been.calledOnce;
        expect(onChange.lastCall.args[0]).to.deep.equal(['Lorem']);
      });
    });

    describe('tags', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox multiple .value=${['Option 1', 'Option 2']}>
            <sl-listbox>
              <sl-option>Option 1</sl-option>
              <sl-option>Option 2</sl-option>
              <sl-option>Option 3</sl-option>
              <sl-option>Option 4</sl-option>
              <sl-option>Option 5</sl-option>
              <sl-option>Option 6</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should have a stacked tag list', () => {
        const tagList = el.renderRoot.querySelector('sl-tag-list');
        expect(tagList).to.exist;
        expect(tagList).to.have.attribute('stacked');
      });

      it('should have a tag for each selected option', () => {
        const tags = el.renderRoot.querySelectorAll('sl-tag');

        expect(tags).to.have.lengthOf(2);
        expect(tags[0]).to.have.trimmed.text('Option 1');
        expect(tags[1]).to.have.trimmed.text('Option 2');
      });

      it('should have remove buttons on the tags', () => {
        const removable = Array.from(el.renderRoot.querySelectorAll('sl-tag')).every(
          tag => !!tag.renderRoot.querySelector('button')
        );

        expect(removable).to.be.true;
      });

      it('should stack options when there is limited space', async () => {
        el.style.maxInlineSize = '300px';
        el.value = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
        await el.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 50));

        const tagList = el.renderRoot.querySelector('sl-tag-list');
        expect(tagList?.renderRoot.querySelector('sl-tag')).to.have.trimmed.text('5');

        const visible = Array.from(el.renderRoot.querySelectorAll('sl-tag')).map(tag => tag.style.display !== 'none');
        expect(visible).to.deep.equal([false, false, false, false, false, true]);
      });

      it('should add a tag after selecting an option', async () => {
        el.value = ['Option 2'];
        await el.updateComplete;

        input.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        const tags = el.renderRoot.querySelectorAll('sl-tag');
        expect(tags).to.have.lengthOf(2);
        expect(tags[0]).to.have.trimmed.text('Option 2');
        expect(tags[1]).to.have.trimmed.text('Option 1');
      });

      it('should remove a tag after clicking the remove button', async () => {
        el.value = ['Option 1'];
        await el.updateComplete;

        // Show the listbox
        input.click();

        // Verify the first option is selected
        expect(el.querySelector('sl-option')).to.have.attribute('aria-selected', 'true');

        // Click the remove button in the tag
        el.renderRoot.querySelector('sl-tag')?.renderRoot.querySelector('button')?.click();
        await el.updateComplete;

        // Verify the option is no longer selected
        expect(el.querySelector('sl-option')).to.have.attribute('aria-selected', 'false');

        // Verify the tag was removed
        expect(el.value).to.deep.equal([]);
      });
    });

    describe('allow custom values', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox allow-custom-values multiple>
            <sl-listbox>
              <sl-option>Lorem</sl-option>
              <sl-option>Ipsum</sl-option>
              <sl-option>Ipsom</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should allow for multiple custom options', async () => {
        input.focus();
        await sendKeys({ type: 'Custom 1' });
        await sendKeys({ press: 'Enter' });
        await el.updateComplete;

        expect(el.querySelectorAll('sl-combobox-custom-option')).to.have.lengthOf(1);

        input.focus();
        input.select();
        await sendKeys({ type: 'Custom 2' });
        await sendKeys({ press: 'Enter' });
        await el.updateComplete;

        expect(el.querySelectorAll('sl-combobox-custom-option')).to.have.lengthOf(2);

        expect(el.value).to.deep.equal(['Custom 1', 'Custom 2']);
      });
    });

    describe('disabled', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox disabled multiple .value=${['Option 1']}>
            <sl-listbox>
              <sl-option>Option 1</sl-option>
              <sl-option>Option 2</sl-option>
              <sl-option>Option 3</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
      });

      it('should disable the tags', () => {
        const tags = el.renderRoot.querySelectorAll('sl-tag');

        expect(tags).to.have.lengthOf(1);
        expect(tags[0]).to.have.attribute('disabled');
      });

      it('should not have remove buttons on the tags', () => {
        const tag = el.renderRoot.querySelector('sl-tag');

        expect(tag).to.exist;
        expect(tag?.renderRoot.querySelector('button')).not.to.exist;
      });
    });

    describe('filter results', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox filter-results multiple .value=${['Lorem']}>
            <sl-listbox>
              <sl-option>Lorem</sl-option>
              <sl-option>Ipsum</sl-option>
              <sl-option>Ipsom</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should filter the results in the list when typing', async () => {
        input.focus();
        await sendKeys({ type: 'Ip' });

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options).to.have.lengthOf(3);
        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });

      it('should reset the results when the input is cleared', async () => {
        input.focus();
        await sendKeys({ type: 'Ip' });

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;

        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });
        await sendKeys({ press: 'Backspace' });

        expect(options[0]).to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });

      it('should show a message when there are no matches', async () => {
        input.focus();
        await sendKeys({ type: 'Foo' });

        const noMatch = el.querySelector('sl-combobox-no-match');
        expect(noMatch).to.exist;
        expect(noMatch?.renderRoot).to.have.text('No options starting with "Foo" have been found.');
      });

      it('should remove the message when there are matches', async () => {
        input.focus();
        await sendKeys({ type: 'Foo' });

        expect(el.querySelector('sl-combobox-no-match')).to.exist;

        input.select();
        await sendKeys({ press: 'Backspace' });

        expect(el.querySelector('sl-combobox-no-match')).not.to.exist;
      });
    });

    describe('group selected', () => {
      let selectedGroup: SelectedGroup;

      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox group-selected multiple .value=${['Option 1', 'Option 2']}>
            <sl-listbox>
              <sl-option>Option 1</sl-option>
              <sl-option>Option 2</sl-option>
              <sl-option>Option 3</sl-option>
              <sl-option>Option 4</sl-option>
              <sl-option>Option 5</sl-option>
              <sl-option>Option 6</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
        selectedGroup = el.querySelector('sl-combobox-selected-group')!;
      });

      it('should have the group selected property set', () => {
        expect(el.groupSelected).to.be.true;
      });

      it('should group the selected options', () => {
        expect(selectedGroup).to.exist;
        expect(selectedGroup).to.have.attribute('aria-label', 'Selected');

        const options = Array.from(selectedGroup.renderRoot.querySelectorAll('sl-option')).map(o => o.value as string);
        expect(options).to.deep.equal(['Option 1', 'Option 2']);
      });

      it('should have a label for all the unselected options', () => {
        const otherLabel = selectedGroup.renderRoot.querySelector('.other');

        expect(otherLabel).to.exist;
        expect(otherLabel).to.have.trimmed.text('All options');
      });
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-form-field label="Label">
            <sl-combobox @sl-form-control=${this.onFormControl}>
              <sl-listbox>
                <sl-option>Option 1</sl-option>
                <sl-option>Option 2</sl-option>
                <sl-option>Option 3</sl-option>
              </sl-listbox>
            </sl-combobox>
          </sl-form-field>
        `;
      }
    }

    beforeEach(async () => {
      try {
        customElements.define('form-integration-test-component', FormIntegrationTestComponent);
      } catch {
        // empty
      }

      el = await fixture(html`<form-integration-test-component></form-integration-test-component>`);
    });

    it('should emit an sl-form-control event after first render', () => {
      expect(el.onFormControl).to.have.been.calledOnce;
    });

    it('should focus the input when the label is clicked', async () => {
      const input = el.renderRoot.querySelector('input'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).to.equal(input);
    });
  });
});
