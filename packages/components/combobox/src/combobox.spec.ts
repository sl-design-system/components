import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/listbox/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type Combobox } from './combobox.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-combobox', () => {
  let el: Combobox, input: HTMLInputElement, listbox: HTMLElement;

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
      listbox = el.querySelector('sl-listbox')!;
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

    it('should not support multiple selection', () => {
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

    it('should have a medium size', () => {
      expect(el).to.have.attribute('size', 'md');
      expect(el.size).to.equal('md');
      expect(el.renderRoot.querySelector('sl-text-field')).to.have.attribute('size', 'md');
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

    it('should not be readonly', () => {
      expect(el.selectOnly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.selectOnly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
      expect(input).to.have.attribute('readonly');
    });

    it('should not be required', () => {
      expect(el.required).not.to.be.true;
      expect(el.internals.ariaRequired).not.to.equal('true');
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(el.internals.ariaRequired).to.equal('true');
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
        expect(input).to.have.attribute('aria-controls', listbox.id);
      });
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
      input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      listbox = el.querySelector('sl-listbox')!;
    });

    it('should disable the text field', () => {
      expect(el.renderRoot.querySelector('sl-text-field')).to.have.attribute('disabled');
    });

    it('should disable the input element', () => {
      expect(input).to.have.attribute('disabled');
    });

    it('should disable any tags', () => {
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
        <sl-combobox filter-results>
          <sl-listbox>
            <sl-option>Lorem</sl-option>
            <sl-option>Ipsum</sl-option>
            <sl-option>Ipsom</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);
      input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      listbox = el.querySelector('sl-listbox')!;
    });

    it('should filter the results in the list when typing', async () => {
      input.focus();
      await sendKeys({ type: 'Ip' });

      const options = Array.from(listbox.querySelectorAll('sl-option'));

      expect(options).to.have.lengthOf(3);
      expect(options[0]).not.to.be.displayed;
      expect(options[1]).to.be.displayed;
      expect(options[2]).to.be.displayed;
    });
  });

  describe('multiple', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-combobox multiple>
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
      listbox = el.querySelector('sl-listbox')!;
    });

    it('should support multiple selection', () => {
      expect(el.multiple).to.be.true;
    });

    it('should have a stacked tag list when options are selected', async () => {
      el.value = ['Option 1', 'Option 2'];
      await el.updateComplete;

      const tagList = el.renderRoot.querySelector('sl-tag-list');
      expect(tagList).to.exist;
      expect(tagList).to.have.attribute('stacked');
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

    it('should have a tag for each selected option', async () => {
      el.value = ['Option 1', 'Option 2'];
      await el.updateComplete;

      const tags = el.renderRoot.querySelectorAll('sl-tag');

      expect(tags).to.have.lengthOf(2);
      expect(tags[0]).to.have.trimmed.text('Option 1');
      expect(tags[1]).to.have.trimmed.text('Option 2');
    });

    it('should have remove buttons on the tags', async () => {
      el.value = ['Option 1', 'Option 2'];
      await el.updateComplete;

      const removable = Array.from(el.renderRoot.querySelectorAll('sl-tag')).every(
        tag => !!tag.renderRoot.querySelector('button')
      );

      expect(removable).to.be.true;
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
      expect(tags[0]).to.have.trimmed.text('Option 1');
      expect(tags[1]).to.have.trimmed.text('Option 2');
    });

    it('should remove a tag after clicking the remove button', async () => {
      el.value = ['Option 1'];
      await el.updateComplete;

      // Show the listbox
      input.click();

      // Verify the first option is selected
      expect(el.querySelector('sl-option')).to.have.attribute('aria-selected');

      // Click the remove button in the tag
      el.renderRoot.querySelector('sl-tag')?.renderRoot.querySelector('button')?.click();
      await el.updateComplete;

      // Verify the option is no longer selected
      expect(el.querySelector('sl-option')).not.to.have.attribute('aria-selected');

      // Verify the tag was removed
      expect(el.value).to.deep.equal([]);
    });
  });
});
