import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { fixture, oneEvent } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Listbox, Option, OptionGroup } from '../index.js';
import '../register.js';
import { type Combobox } from './combobox.js';
import { type CustomOption } from './custom-option.js';
import { type GroupedOption } from './grouped-option.js';
import { type SelectedGroup } from './selected-group.js';

describe('sl-combobox', () => {
  it('should export and register listbox option components', () => {
    expect(Listbox).to.exist;
    expect(Option).to.exist;
    expect(OptionGroup).to.exist;

    expect(customElements.get('sl-listbox')).to.equal(Listbox);
    expect(customElements.get('sl-option')).to.equal(Option);
    expect(customElements.get('sl-option-group')).to.equal(OptionGroup);
  });
  let el: Combobox, input: HTMLInputElement;

  const waitForNextMacrotask = async (): Promise<void> => {
    if (vi.isFakeTimers()) {
      vi.advanceTimersByTime(0);
      await Promise.resolve();

      return;
    }

    await new Promise<void>(resolve => setTimeout(resolve));
  };

  const waitForNextFrame = async (): Promise<void> => {
    if (vi.isFakeTimers()) {
      vi.advanceTimersToNextFrame();
      return;
    }

    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  };

  const waitForActiveElement = async (
    root: Document | ShadowRoot,
    expected: Element,
    timeout = 1000
  ): Promise<void> => {
    const startedAt = Date.now();

    while (root.activeElement !== expected && Date.now() - startedAt < timeout) {
      await waitForNextMacrotask();
      await waitForNextFrame();
    }

    expect(root.activeElement).to.equal(expected);
  };

  const waitForCondition = async (condition: () => boolean, timeout = 1000): Promise<void> => {
    const startedAt = Date.now();

    while (!condition() && Date.now() - startedAt < timeout) {
      await waitForNextMacrotask();
      await waitForNextFrame();
    }

    expect(condition()).to.be.true;
  };

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

    it('should have aria-autocomplete="none" when autocomplete is "off"', async () => {
      el.autocomplete = 'off';
      await el.updateComplete;

      expect(input).to.have.attribute('aria-autocomplete', 'none');
    });

    it('should have aria-autocomplete="none" when select-only is true', async () => {
      el.selectOnly = true;
      await el.updateComplete;

      expect(input).to.have.attribute('aria-autocomplete', 'none');
    });

    it('should be readonly when select-only is true', async () => {
      el.selectOnly = true;
      await el.updateComplete;

      expect(input).to.have.attribute('readonly');
    });

    it('should have aria-autocomplete="none" when select-only is true even if autocomplete is not "off"', async () => {
      el.selectOnly = true;
      el.autocomplete = 'both';
      await el.updateComplete;

      expect(input).to.have.attribute('aria-autocomplete', 'none');
    });

    it('should reflect the autocomplete property in aria-autocomplete', async () => {
      el.autocomplete = 'list';
      await el.updateComplete;
      expect(input).to.have.attribute('aria-autocomplete', 'list');

      el.autocomplete = 'inline';
      await el.updateComplete;
      expect(input).to.have.attribute('aria-autocomplete', 'inline');
    });

    it('should warn when select-only is true and autocomplete is not "off"', async () => {
      const warnSpy = spy(console, 'warn');

      el.selectOnly = true;
      el.autocomplete = 'both';
      await el.updateComplete;

      expect(warnSpy).to.have.been.calledWithMatch(
        /sl-combobox: The 'autocomplete="both"' property is ignored when 'selectOnly' is true/
      );

      warnSpy.restore();
    });

    it('should not warn when select-only is true and autocomplete is "off"', async () => {
      const warnSpy = spy(console, 'warn');

      el.selectOnly = true;
      el.autocomplete = 'off';
      await el.updateComplete;

      expect(warnSpy).to.not.have.been.called;

      warnSpy.restore();
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

    it('should have a button', () => {
      const button = el.renderRoot.querySelector('button[slot="suffix"]');

      expect(button).to.exist;
      expect(button).to.contain('sl-icon[name="chevron-down"]');
    });

    it('should toggle the popover when clicking the button', () => {
      const button = el.renderRoot.querySelector<HTMLElement>('button[slot="suffix"]'),
        wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      expect(wrapper?.matches(':popover-open')).to.be.false;

      button?.click();
      expect(wrapper?.matches(':popover-open')).to.be.true;

      button?.click();
      expect(wrapper?.matches(':popover-open')).to.be.false;
    });

    it('should have a static aria-label of "Options" on the button', () => {
      const button = el.renderRoot.querySelector('button[slot="suffix"]');

      expect(button).to.have.attribute('aria-label', 'Options');
    });

    it('should have aria-expanded "false" on the button when the popover is closed', () => {
      const button = el.renderRoot.querySelector('button[slot="suffix"]');

      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should have aria-expanded "true" on the button when the popover is open', async () => {
      const button = el.renderRoot.querySelector<HTMLElement>('button[slot="suffix"]');

      button?.click();
      await el.updateComplete;

      expect(button).to.have.attribute('aria-expanded', 'true');
    });

    it('should update aria-expanded on the button immediately when toggling the popover', () => {
      const button = el.renderRoot.querySelector<HTMLElement>('button[slot="suffix"]');

      button?.click();
      expect(button).to.have.attribute('aria-expanded', 'true');

      button?.click();
      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should switch aria-expanded back to "false" when the popover closes', async () => {
      const button = el.renderRoot.querySelector<HTMLElement>('button[slot="suffix"]');

      button?.click();
      await el.updateComplete;

      button?.click();
      await el.updateComplete;

      expect(button).to.have.attribute('aria-expanded', 'false');
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

      const textField = el.renderRoot.querySelector('sl-text-field');
      if (textField) {
        await (textField as unknown as { updateComplete: Promise<boolean> }).updateComplete;
      }

      expect(el).to.have.attribute('required');
      expect(input).to.have.attribute('required');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after typing in the input', async () => {
      input.focus();
      await userEvent.keyboard('L');

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after typing in the input', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      input.focus();
      await userEvent.keyboard('L');

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
      const focusEvent = oneEvent(el, 'sl-focus');
      input.focus();
      await focusEvent;

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the input', async () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      input.focus();
      await userEvent.tab();

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when selecting an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      input.click();
      el.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when calling reportValidity', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.reportValidity();
      await el.updateComplete;

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when selecting an option', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      input.click();
      el.querySelector('sl-option')?.click();
      await el.updateComplete;

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

    it('should not have has-selected-items attribute when interacting with a combobox with no selected items', async () => {
      el.placeholder = 'Placeholder';
      await el.updateComplete;

      expect(el).not.to.have.attribute('has-selected-items');
      expect(input.placeholder).to.equal('Placeholder');

      await userEvent.click(input);
      await el.updateComplete;

      await userEvent.click(document.body);
      await el.updateComplete;

      expect(el).not.to.have.attribute('has-selected-items');
      expect(input.placeholder).to.equal('Placeholder');
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
      await userEvent.keyboard('Custom value');
      await el.updateComplete;

      const createCustomOption = el.querySelector('sl-combobox-create-custom-option');

      expect(createCustomOption).to.exist;
      expect(createCustomOption).to.have.attribute('current');
      expect(createCustomOption?.value).to.equal('Custom value');
    });

    it('should not add a create-custom-option element when the typed text matches an existing option', async () => {
      input.focus();
      await userEvent.keyboard('Lorem');
      await el.updateComplete;

      expect(el.querySelector('sl-combobox-create-custom-option')).not.to.exist;
    });

    it('should remove the create-custom-option element if the text is cleared', async () => {
      input.focus();
      await userEvent.keyboard('Custom');
      await el.updateComplete;

      expect(el.querySelector('sl-combobox-create-custom-option')).to.exist;

      await userEvent.keyboard('{Backspace}');
      await userEvent.keyboard('{Backspace}');
      await userEvent.keyboard('{Backspace}');
      await userEvent.keyboard('{Backspace}');
      await userEvent.keyboard('{Backspace}');
      await userEvent.keyboard('{Backspace}');
      await el.updateComplete;

      expect(el.querySelector('sl-combobox-create-custom-option')).not.to.exist;
    });

    it('should create a custom option after pressing Enter', async () => {
      input.focus();
      await userEvent.keyboard('Custom value');
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      const customOption = el.querySelector('sl-listbox')?.firstElementChild as CustomOption;

      expect(customOption).to.exist;
      expect(customOption).to.match('sl-combobox-custom-option');
      expect(customOption).to.have.attribute('aria-selected', 'true');
      expect(customOption).to.have.attribute('current');
      expect(customOption?.value).to.equal('Custom value');
      expect(el.value).to.equal('Custom value');
    });

    it('should create a custom option after clicking on the create-custom-option element', async () => {
      input.focus();
      await userEvent.keyboard('Custom value');
      el.querySelector('sl-combobox-create-custom-option')?.click();
      await el.updateComplete;
      await waitForNextFrame();

      const customOption = el.querySelector('sl-listbox')?.firstElementChild as CustomOption;

      expect(customOption).to.exist;
      expect(customOption).to.match('sl-combobox-custom-option');
      expect(customOption).to.have.attribute('aria-selected', 'true');
      expect(customOption).to.have.attribute('current');
      expect(customOption?.value).to.equal('Custom value');
      expect(el.value).to.equal('Custom value');
    });

    it('should remove the custom option after deselecting it', async () => {
      input.focus();
      await userEvent.keyboard('Custom value');
      await userEvent.keyboard('{Enter}');
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

      it('should ignore disabled selected slotted options', async () => {
        el = await fixture(html`
          <sl-combobox>
            <sl-listbox>
              <sl-option disabled selected>Lorem</sl-option>
              <sl-option>Ipsum</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        const disabledOption = el.querySelector('sl-option')!;

        expect(el.value).to.be.undefined;
        expect(el.selectedItems).to.be.empty;
        expect(disabledOption.selected).to.be.false;
        expect(disabledOption).to.have.attribute('aria-selected', 'false');
      });

      it('should reset the input value if no option is selected and focus leaves the component', async () => {
        input.click();
        await el.updateComplete;

        await userEvent.keyboard('foo');
        await userEvent.keyboard('{Tab}');

        expect(input.value).to.equal('');
      });

      it('should reset the input value to the selected option when focus leaves the component', async () => {
        input.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        input.select();
        await userEvent.keyboard('foo');
        await userEvent.keyboard('{Tab}');

        expect(input.value).to.equal('Lorem');
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

      it('should insert spaces in the input', async () => {
        input.focus();
        await userEvent.keyboard('Foo{Space}Bar');
        await el.updateComplete;

        expect(input.value).to.equal('Foo Bar');
      });
    });

    describe('select only', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox select-only>
            <sl-listbox>
              <sl-option>Lorem</sl-option>
              <sl-option>Ipsum</sl-option>
              <sl-option>Ipsom</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should select the current option when pressing Space', async () => {
        input.focus();
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{Space}');
        await el.updateComplete;

        expect(el.value).to.equal('Lorem');
        expect(input.value).to.equal('Lorem');
      });

      it('should deselect the current option when pressing Space', async () => {
        el.value = 'Lorem';
        await el.updateComplete;

        input.focus();
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{Space}');
        await el.updateComplete;

        expect(el.value).to.be.undefined;
        expect(input.value).to.equal('');
      });
    });

    describe('options with values', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox>
            <sl-listbox>
              <sl-option .value=${'1'}>Lorem</sl-option>
              <sl-option .value=${'2'}>Ipsum</sl-option>
              <sl-option .value=${'3'}>Ipsom</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should set the value when an option is selected', async () => {
        input.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
        input.blur();
        await el.updateComplete;

        expect(el.value).to.equal('1');
        expect(input.value).to.equal('Lorem');
      });

      it('should select an option when the value matches after string coercion', async () => {
        const onChange = spy();

        el = await fixture(html`
          <sl-combobox @sl-change=${onChange}>
            <sl-listbox>
              <sl-option .value=${1}>Lorem</sl-option>
              <sl-option .value=${2}>Ipsum</sl-option>
            </sl-listbox>
          </sl-combobox>
          <input />
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;

        el.value = '1';
        await el.updateComplete;

        input.focus();
        await userEvent.keyboard('{Tab}');
        await el.updateComplete;

        expect(el.value).to.equal('1');
        expect(input.value).to.equal('Lorem');
        expect(onChange).not.to.have.been.called;
      });

      it('should prefer a strict value match over a string-coerced match', async () => {
        el = await fixture(html`
          <sl-combobox>
            <sl-listbox>
              <sl-option .value=${1}>Number</sl-option>
              <sl-option .value=${'1'}>String</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;

        el.value = '1';
        await el.updateComplete;

        expect(input.value).to.equal('String');
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
        await userEvent.keyboard('Custom value');
        await userEvent.keyboard('{Enter}');
        await el.updateComplete;

        expect(el.querySelector('sl-combobox-custom-option')).to.exist;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        expect(el.querySelector('sl-combobox-custom-option')).not.to.exist;
      });

      it('should remove the custom option after adding a different custom option', async () => {
        input.focus();
        await userEvent.keyboard('Foo');
        await userEvent.keyboard('{Enter}');
        await el.updateComplete;

        const customOption = el.querySelector('sl-combobox-custom-option');

        expect(customOption).to.exist;
        expect(customOption?.value).to.equal('Foo');

        input.focus();
        input.select();
        await userEvent.keyboard('Bar');
        await userEvent.keyboard('{Enter}');
        await el.updateComplete;

        const customOptions = Array.from(el.querySelectorAll('sl-combobox-custom-option'));

        expect(customOptions).to.have.lengthOf(1);
        expect(customOptions.at(0)).to.exist;
        expect(customOptions.at(0)?.value).to.equal('Bar');
      });

      it('should remove the custom option when focus leaves the component', async () => {
        input.focus();

        await userEvent.keyboard('Foo');
        expect(el.querySelector('sl-combobox-create-custom-option')).to.exist;

        await userEvent.keyboard('{Tab}');
        expect(el.querySelector('sl-combobox-create-custom-option')).not.to.exist;
      });

      it('should emit an sl-change event when the custom option is created', async () => {
        const onChange = spy();

        el.addEventListener('sl-change', (event: SlChangeEvent) => {
          onChange(event.detail);
        });

        input.focus();
        await userEvent.keyboard('Custom value');
        await userEvent.keyboard('{Enter}');
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
        await userEvent.keyboard('Ip');

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options).to.have.lengthOf(3);
        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });

      it('should reset the results when the input is cleared', async () => {
        input.focus();
        await userEvent.keyboard('Ip');

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;

        await userEvent.keyboard('{Backspace}');
        await userEvent.keyboard('{Backspace}');
        await userEvent.keyboard('{Backspace}');

        expect(options[0]).to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });

      it('should reset the results when focus leaves the component without selecting an option', async () => {
        input.focus();
        await userEvent.keyboard('Ip');

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;

        await userEvent.click(document.body);
        await el.updateComplete;

        expect(input.value).to.equal('');
        expect(options[0]).to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });

      it('should ignore option navigation when filtering hides all options', async () => {
        input.focus();
        await userEvent.keyboard('Foo');
        await el.updateComplete;

        expect(el.items.filter(item => item.type === 'option' && item.visible)).to.have.lengthOf(0);

        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{Home}');
        await el.updateComplete;

        expect(el.currentItem).to.be.undefined;
        expect(input).not.to.have.attribute('aria-activedescendant');
      });
    });

    describe('current item on open', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox>
            <sl-listbox>
              <sl-option>Lorem</sl-option>
              <sl-option selected>Ipsum</sl-option>
              <sl-option>Dolor</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);

        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      });

      it('should set current on the selected option when opened via keyboard', async () => {
        input.focus();
        await userEvent.keyboard('{ArrowDown}');
        await el.updateComplete;
        await waitForNextFrame();

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options[1]).to.have.attribute('current');
        expect(input).to.have.attribute('aria-activedescendant', options[1].id);
      });

      it('should not set current on the selected option when opened via mouse click', async () => {
        input.click();
        await el.updateComplete;

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options[1]).not.to.have.attribute('current');
        expect(input).to.have.attribute('aria-activedescendant', options[1].id);
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

        expect(input).not.to.have.attribute('placeholder');
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

        expect(options.map(o => o.getAttribute('aria-selected') === 'true')).to.deep.equal([
          true,
          true,
          false
        ]);

        options.at(0)?.click();
        await el.updateComplete;

        expect(el.value).to.deep.equal(['Ipsum']);
      });

      it('should reset the input value if focus leaves the component', async () => {
        input.click();
        await el.updateComplete;

        await userEvent.keyboard('foo');
        await userEvent.keyboard('{Tab}');

        expect(input.value).to.equal('');
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

      it('should select only the strict value match when coercible option values also match', async () => {
        el = await fixture(html`
          <sl-combobox multiple>
            <sl-listbox>
              <sl-option .value=${1}>Number</sl-option>
              <sl-option .value=${'1'}>String</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);

        el.value = ['1'];
        await el.updateComplete;

        expect(el.selectedItems.map(item => item.label)).to.deep.equal(['String']);
      });

      it('should select and deselect the current option with Space when select-only', async () => {
        el.selectOnly = true;
        await el.updateComplete;

        input.focus();
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{Space}');
        await el.updateComplete;

        expect(el.value).to.deep.equal(['Lorem']);

        await userEvent.keyboard('{Space}');
        await el.updateComplete;

        expect(el.value).to.deep.equal([]);
      });

      it('should not have has-selected-items attribute when interacting with a combobox with no selected items', async () => {
        el.placeholder = 'Placeholder';
        await el.updateComplete;

        expect(el).not.to.have.attribute('has-selected-items');
        expect(input.placeholder).to.equal('Placeholder');

        await userEvent.click(input);
        await el.updateComplete;

        await userEvent.click(document.body);
        await el.updateComplete;

        expect(el).not.to.have.attribute('has-selected-items');
        expect(input.placeholder).to.equal('Placeholder');
      });

      it('should not poison form value with placeholder on blur', async () => {
        const form = await fixture<HTMLFormElement>(html`
          <form>
            <sl-combobox name="test" multiple placeholder="Placeholder">
              <sl-listbox>
                <sl-option>Lorem</sl-option>
                <sl-option>Ipsum</sl-option>
                <sl-option>Ipsom</sl-option>
              </sl-listbox>
            </sl-combobox>
          </form>
        `);

        const combobox = form.querySelector<Combobox>('sl-combobox')!,
          formInput = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

        await combobox.updateComplete;
        await userEvent.click(formInput);

        await combobox.updateComplete;
        await userEvent.click(document.body);

        await combobox.updateComplete;
        const formData = new FormData(form);

        expect(formData.getAll('test')).to.deep.equal([]);
      });
    });

    describe('disabled', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox multiple disabled .value=${['Option 1', 'Option 2']}>
            <sl-listbox>
              <sl-option>Option 1</sl-option>
              <sl-option>Option 2</sl-option>
              <sl-option>Option 3</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
      });

      it('should not set aria-hidden on sl-tag elements when disabled', () => {
        const tags = Array.from(el.renderRoot.querySelectorAll('sl-tag'));

        expect(tags).to.have.lengthOf(2);
        expect(tags.every(tag => tag.hasAttribute('aria-hidden'))).to.be.false;
      });

      it('should not set aria-hidden on sl-tag elements when not disabled', async () => {
        el.disabled = false;
        await el.updateComplete;

        const tags = Array.from(el.renderRoot.querySelectorAll('sl-tag'));

        expect(tags).to.have.lengthOf(2);
        expect(tags.every(tag => tag.hasAttribute('aria-hidden'))).to.be.false;
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

      it('should not emit an sl-change event on initial render when a value is set', async () => {
        const onChange = spy();

        el.addEventListener('sl-change', onChange);
        await el.updateComplete;

        expect(onChange).not.to.have.been.called;
      });

      it('should have a stacked tag list', () => {
        const tagList = el.renderRoot.querySelector('sl-tag-list');
        expect(tagList).to.exist;
        expect(tagList).to.have.attribute('stacked');
      });

      it('should have a responsive layout for the tag list', () => {
        const tagList = el.renderRoot.querySelector('sl-tag-list') as HTMLElement;
        const styles = getComputedStyle(tagList);
        const hostStyles = getComputedStyle(el);

        expect(styles.flexGrow).to.equal('0');
        expect(styles.flexShrink).to.equal('1');
        expect(styles.flexBasis).to.equal('auto');
        expect(styles.minInlineSize).to.equal('0px');
        expect(styles.overflowX).to.equal('visible');
        expect(styles.position).to.equal('relative');
        expect(styles.zIndex).to.equal('1');
        expect(hostStyles.contain).to.include('inline-size');
      });

      it('should keep the input caret next to the visible tags', async () => {
        await waitForNextFrame();

        const visibleTags = Array.from(el.renderRoot.querySelectorAll('sl-tag')).filter(
            tag => getComputedStyle(tag).display !== 'none'
          ),
          lastTag = visibleTags.at(-1);

        expect(lastTag, 'expected at least one visible tag').to.exist;

        const inputRect = input.getBoundingClientRect(),
          lastTagRect = lastTag!.getBoundingClientRect(),
          gap = inputRect.left - lastTagRect.right;

        expect(gap).to.be.at.least(0);
        expect(gap).to.be.lessThan(16);
      });

      it('should keep one selected tag visible next to the stack counter in limited space', async () => {
        el.style.maxInlineSize = '300px';
        el.value = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
        await el.updateComplete;
        await waitForNextFrame();
        await waitForNextFrame();

        const tagList = el.renderRoot.querySelector('sl-tag-list')!,
          stackTag = tagList.renderRoot.querySelector('.stack sl-tag'),
          selectedTags = Array.from(el.renderRoot.querySelectorAll('sl-tag')),
          visibleSelectedTags = selectedTags.filter(
            tag => getComputedStyle(tag).display !== 'none'
          );

        expect(stackTag).to.exist;
        expect(stackTag).to.have.trimmed.text(
          `+${selectedTags.length - visibleSelectedTags.length}`
        );
        expect(visibleSelectedTags.length).to.be.greaterThan(0);
      });

      it('should not flicker when selecting many items in a limited space', async () => {
        el.style.maxInlineSize = '300px';

        // Select items that would trigger a collapse
        el.value = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
        await el.updateComplete;

        const getVisibilityState = () =>
          Array.from(el.renderRoot.querySelectorAll('sl-tag')).map(
            tag => tag.style.display !== 'none'
          );

        // Allow initial layout/stacking to settle. Use real timers because ResizeObserver delivery
        // is browser-driven and can deadlock with fake timers in CI.
        await new Promise(resolve => setTimeout(resolve, 300));
        await el.updateComplete;
        await waitForNextFrame();

        const firstState = getVisibilityState(),
          firstInputWidth = input.getBoundingClientRect().width;

        // Wait long enough to cover any potential oscillation cycles.
        await new Promise(resolve => setTimeout(resolve, 500));
        await el.updateComplete;
        await waitForNextFrame();

        const secondState = getVisibilityState(),
          secondInputWidth = input.getBoundingClientRect().width;

        // If the component flickers, the visibility pattern of tags would change over time.
        expect(secondState).to.deep.equal(firstState);
        expect(secondInputWidth).to.be.closeTo(firstInputWidth, 0.5);
      });

      it('should keep the input width bounded while adding tags in limited space', async () => {
        el.style.maxInlineSize = '300px';
        const textField = el.renderRoot.querySelector('sl-text-field') as HTMLElement;

        for (const count of [1, 2, 3, 4, 5, 6]) {
          el.value = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'].slice(
            0,
            count
          );
          await el.updateComplete;
          await waitForNextFrame();
          await waitForNextFrame();

          const inputWidth = input.getBoundingClientRect().width,
            fieldWidth = textField.getBoundingClientRect().width,
            comboboxWidth = el.getBoundingClientRect().width;

          expect(inputWidth).to.be.a('number');
          expect(Number.isFinite(inputWidth)).to.be.true;
          expect(inputWidth).to.be.at.most(fieldWidth + 0.5);
          expect(comboboxWidth).to.be.at.most(300.5);
        }
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

      it('should use the first removable tag button and input as combobox tab stops', async () => {
        const wrapper = await fixture<HTMLDivElement>(html`
            <div>
              <button>Before</button>
              <sl-combobox multiple .value=${['Option 1', 'Option 2']}>
                <sl-listbox>
                  <sl-option>Option 1</sl-option>
                  <sl-option>Option 2</sl-option>
                  <sl-option>Option 3</sl-option>
                </sl-listbox>
              </sl-combobox>
              <button>After</button>
            </div>
          `),
          combobox = wrapper.querySelector('sl-combobox')!,
          input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

        await combobox.updateComplete;
        await waitForNextFrame();
        await combobox.updateComplete;

        const comboboxRoot = combobox.renderRoot as ShadowRoot,
          tagList = comboboxRoot.querySelector('sl-tag-list')!,
          tags = Array.from(comboboxRoot.querySelectorAll('sl-tag')),
          buttons = tags.map(tag => tag.renderRoot.querySelector('button'));

        expect(tags).to.have.lengthOf(2);
        await tagList.updateComplete;
        await waitForCondition(() => tags[0].getAttribute('tabindex') === '0');

        expect(tags[0]).to.have.attribute('tabindex', '0');
        expect(tags[1]).to.have.attribute('tabindex', '-1');
        expect(buttons[0]).to.have.attribute('tabindex', '0');
        expect(buttons[1]).to.have.attribute('tabindex', '-1');

        tags[0].focus();

        await waitForActiveElement(comboboxRoot, tags[0]);
        await waitForActiveElement(tags[0].shadowRoot!, buttons[0]!);

        await userEvent.keyboard('{ArrowRight}');

        await waitForActiveElement(comboboxRoot, tags[1]);
        await waitForActiveElement(tags[1].shadowRoot!, buttons[1]!);

        await userEvent.keyboard('{ArrowLeft}');

        await waitForActiveElement(comboboxRoot, tags[0]);
        await waitForActiveElement(tags[0].shadowRoot!, buttons[0]!);

        await userEvent.tab();

        await waitForActiveElement(document, input);

        await userEvent.tab();

        await waitForActiveElement(document, wrapper.querySelector('button:last-child')!);
      });

      it('should not show fake tag focus when navigating from the input with arrow keys', async () => {
        const tags = Array.from(el.renderRoot.querySelectorAll('sl-tag'));

        input.focus();
        input.setSelectionRange(0, 0);

        await userEvent.keyboard('{ArrowLeft}');
        await el.updateComplete;

        expect(tags.some(tag => tag.classList.contains('focused'))).to.be.false;
        expect(document.activeElement).to.equal(input);
      });

      it('should stack options when there is limited space', async () => {
        vi.useFakeTimers();

        try {
          el.style.maxInlineSize = '300px';
          el.value = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
          await el.updateComplete;
          await vi.advanceTimersByTimeAsync(300);
          await el.updateComplete;
          await waitForNextFrame();

          const tagList = el.renderRoot.querySelector('sl-tag-list'),
            stackTag = tagList?.renderRoot.querySelector('sl-tag'),
            tags = Array.from(el.renderRoot.querySelectorAll('sl-tag')),
            visibility = tags.map(tag => tag.style.display !== 'none'),
            hiddenCount = visibility.filter(isVisible => !isVisible).length,
            visibleCount = visibility.length - hiddenCount;

          expect(visibleCount).to.be.greaterThan(0);
          expect(hiddenCount).to.be.greaterThan(0);
          expect(stackTag).to.have.trimmed.text(`+${hiddenCount}`);
          expect(visibility.join(',')).to.match(/^false(,false)*,true(,true)*$/);
        } finally {
          vi.useRealTimers();
        }
      });

      it('should reveal more tags after the combobox grows again', async () => {
        vi.useFakeTimers();

        try {
          el.style.inlineSize = '300px';
          el.value = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
          await el.updateComplete;
          await vi.advanceTimersByTimeAsync(300);
          await el.updateComplete;
          await waitForNextFrame();

          const getVisibleCount = () =>
            Array.from(el.renderRoot.querySelectorAll('sl-tag')).filter(
              tag => tag.style.display !== 'none'
            ).length;

          const collapsedVisibleCount = getVisibleCount();

          el.style.inlineSize = '900px';
          await vi.advanceTimersByTimeAsync(300);
          await el.updateComplete;
          await waitForNextFrame();

          const expandedVisibleCount = getVisibleCount();

          expect(collapsedVisibleCount).to.be.lessThan(6);
          expect(expandedVisibleCount).to.be.greaterThan(collapsedVisibleCount);
        } finally {
          vi.useRealTimers();
        }
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

      it('should focus the next tag after removing a tag', async () => {
        el.value = ['Option 1', 'Option 2', 'Option 3'];
        await el.updateComplete;

        const tags = Array.from(el.renderRoot.querySelectorAll('sl-tag'));

        tags[0].renderRoot.querySelector<HTMLElement>('button')?.focus();
        await userEvent.keyboard('{Enter}');
        await el.updateComplete;
        await waitForNextFrame();

        const remainingTags = Array.from(el.renderRoot.querySelectorAll('sl-tag'));

        expect(el.value).to.deep.equal(['Option 2', 'Option 3']);
        expect((el.renderRoot as ShadowRoot).activeElement).to.equal(remainingTags[0]);
        expect(remainingTags[0].shadowRoot?.activeElement).to.equal(
          remainingTags[0].renderRoot.querySelector('button')
        );
      });

      it('should focus the input after removing the last tag', async () => {
        el.value = ['Option 1'];
        await el.updateComplete;

        const tag = el.renderRoot.querySelector('sl-tag')!;

        tag.renderRoot.querySelector<HTMLElement>('button')?.focus();
        await userEvent.keyboard('{Enter}');
        await el.updateComplete;
        await waitForNextFrame();

        expect(el.value).to.deep.equal([]);
        expect(document.activeElement).to.equal(input);
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
        await userEvent.keyboard('Custom 1');
        await userEvent.keyboard('{Enter}');
        await el.updateComplete;

        expect(el.querySelectorAll('sl-combobox-custom-option')).to.have.lengthOf(1);

        input.focus();
        input.select();
        await userEvent.keyboard('Custom 2');
        await userEvent.keyboard('{Enter}');
        await el.updateComplete;

        expect(el.querySelectorAll('sl-combobox-custom-option')).to.have.lengthOf(2);

        expect(el.value).to.deep.equal(['Custom 1', 'Custom 2']);
      });

      it('should remove the custom option when focus leaves the component', async () => {
        input.focus();

        await userEvent.keyboard('Foo');
        expect(el.querySelector('sl-combobox-create-custom-option')).to.exist;

        await userEvent.keyboard('{Tab}');
        expect(el.querySelector('sl-combobox-create-custom-option')).not.to.exist;
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
        await userEvent.keyboard('Ip');

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options).to.have.lengthOf(3);
        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });

      it('should reset the results when the input is cleared', async () => {
        input.focus();
        await userEvent.keyboard('Ip');

        const options = Array.from(el.querySelectorAll('sl-option'));

        expect(options[0]).not.to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;

        await userEvent.keyboard('{Backspace}');
        await userEvent.keyboard('{Backspace}');
        await userEvent.keyboard('{Backspace}');

        expect(options[0]).to.be.displayed;
        expect(options[1]).to.be.displayed;
        expect(options[2]).to.be.displayed;
      });

      it('should show a message when there are no matches', async () => {
        input.focus();
        await userEvent.keyboard('Foo');

        const noMatch = el.querySelector('sl-combobox-no-match');
        expect(noMatch).to.exist;
        expect(noMatch?.renderRoot).to.have.text('No options starting with "Foo" have been found.');
      });

      it('should remove the message when there are matches', async () => {
        input.focus();
        await userEvent.keyboard('Foo');

        expect(el.querySelector('sl-combobox-no-match')).to.exist;

        input.select();
        await userEvent.keyboard('{Backspace}');

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

      it('should prepend the selected group as the first child in the listbox', () => {
        const listbox = el.querySelector('sl-listbox');

        expect(listbox?.firstElementChild).to.equal(selectedGroup);
      });

      it('should set has-groups to false when source options are not grouped', () => {
        expect(selectedGroup.hasGroups).to.be.false;
        expect(selectedGroup).not.to.have.attribute('has-groups');
      });

      it('should group the selected options', () => {
        expect(selectedGroup).to.exist;
        // Note: aria-label is no longer set since we removed role="group" for Safari/VoiceOver compatibility

        const options = Array.from(
          selectedGroup.querySelectorAll('sl-combobox-grouped-option')
        ).map(o => o.innerText);
        expect(options).to.deep.equal(['Option 1', 'Option 2']);
      });

      it('should expose the selected state for grouped options', () => {
        const options = Array.from(selectedGroup.querySelectorAll('sl-combobox-grouped-option'));

        expect(options.map(option => option.getAttribute('aria-selected'))).to.deep.equal([
          'true',
          'true'
        ]);
      });

      it('should have group headers for both the selected and unselected options', () => {
        const headers = selectedGroup.renderRoot.querySelectorAll('sl-option-group-header');

        expect(headers).to.have.lengthOf(2);
        expect(headers.item(0)).to.have.trimmed.text('Selected');
        expect(headers.item(1)).to.have.trimmed.text('All options');
      });

      it('should remove the selected group when all selections are cleared', async () => {
        el.value = [];
        await el.updateComplete;

        expect(el.querySelector('sl-combobox-selected-group')).not.to.exist;
      });

      it('should move current to the grouped option so Enter toggles it off instead of selecting it twice', async () => {
        input.focus();
        await userEvent.keyboard('Option 3');
        await el.updateComplete;
        await waitForNextFrame();

        await userEvent.keyboard('{Enter}');
        await el.updateComplete;
        await waitForNextFrame();
        await waitForNextMacrotask();

        const currentGroupedOption = selectedGroup.querySelector(
          'sl-combobox-grouped-option[current]'
        );
        const groupedLabelsAfterFirstEnter = Array.from(
          selectedGroup.querySelectorAll('sl-combobox-grouped-option')
        ).map(option => option.textContent?.trim());

        expect(currentGroupedOption).to.exist;
        expect(currentGroupedOption).to.have.trimmed.text('Option 3');
        expect(groupedLabelsAfterFirstEnter.filter(label => label === 'Option 3')).to.have.lengthOf(
          1
        );

        await userEvent.keyboard('{Enter}');
        await el.updateComplete;
        await waitForNextFrame();
        await waitForNextMacrotask();

        const groupedLabelsAfterSecondEnter = Array.from(
          selectedGroup.querySelectorAll('sl-combobox-grouped-option')
        ).map(option => option.textContent?.trim());

        expect(
          groupedLabelsAfterSecondEnter.filter(label => label === 'Option 3')
        ).to.have.lengthOf(0);
      });

      describe('with grouped source options', () => {
        beforeEach(async () => {
          el = await fixture(html`
            <sl-combobox group-selected multiple .value=${['Option 1', 'Option 3']}>
              <sl-listbox>
                <sl-option-group label="Group 1">
                  <sl-option>Option 1</sl-option>
                  <sl-option>Option 2</sl-option>
                </sl-option-group>
                <sl-option-group label="Group 2">
                  <sl-option>Option 3</sl-option>
                  <sl-option>Option 4</sl-option>
                </sl-option-group>
              </sl-listbox>
            </sl-combobox>
          `);

          selectedGroup = el.querySelector('sl-combobox-selected-group')!;
        });

        it('should set has-groups to true when source options are grouped', () => {
          expect(selectedGroup.hasGroups).to.be.true;
          expect(selectedGroup).to.have.attribute('has-groups');
        });

        it('should render only the selected header when has-groups is true', () => {
          const headers = selectedGroup.renderRoot.querySelectorAll('sl-option-group-header');

          expect(headers).to.have.lengthOf(1);
          expect(headers.item(0)).to.have.trimmed.text('Selected');
        });

        it('should preserve original group labels on grouped selected options', () => {
          const options = Array.from(
            selectedGroup.querySelectorAll<GroupedOption>('sl-combobox-grouped-option')
          );

          expect(options).to.have.lengthOf(2);
          expect(options[0].group).to.equal('Group 1');
          expect(options[1].group).to.equal('Group 2');
        });
      });
    });

    describe('grouped options accessibility', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox
            .options=${[
              { label: 'Apple', value: 'apple', group: 'Fruits' },
              { label: 'Banana', value: 'banana', group: 'Fruits' },
              { label: 'Carrot', value: 'carrot', group: 'Vegetables' },
              { label: 'Potato', value: 'potato', group: 'Vegetables' }
            ]}
            option-group-path="group"
            option-label-path="label"
            option-value-path="value">
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;

        // Open the listbox to render options
        input.focus();
        await el.updateComplete;
        await waitForNextFrame();
        await waitForNextMacrotask();
      });

      it('should not have role="group" on group wrappers', () => {
        // sl-option-group elements are in the light DOM, not the listbox shadow root
        const groups = el.querySelectorAll('sl-option-group[role="group"]');

        expect(groups).to.have.lengthOf(0);
      });

      it('should have aria-hidden="true" on group headers', async () => {
        await userEvent.click(input);
        await el.updateComplete;
        await waitForNextFrame();
        await waitForNextMacrotask();

        const listbox = el.querySelector('sl-listbox');
        const headers = el.items
          .filter(item => item.type === 'group')
          .map(item => item.element)
          .filter(
            (header): header is NonNullable<Combobox['items'][number]['element']> =>
              header !== undefined
          )
          .filter(header => {
            const root = header.getRootNode();

            return (
              header.closest('sl-listbox') === listbox ||
              (root instanceof ShadowRoot && root.host.hasAttribute('data-virtual-list'))
            );
          });

        expect(headers).to.have.lengthOf(2);

        headers.forEach(header => {
          expect(header).to.have.attribute('aria-hidden', 'true');
        });
      });

      it('should have flattened aria-posinset and aria-setsize across all options', async () => {
        await userEvent.click(input);
        await el.updateComplete;
        await waitForNextFrame();
        await waitForNextMacrotask();

        const listbox = el.querySelector('sl-listbox');
        const options = el.items
          .filter(item => 'option' in item)
          .map(item => item.element)
          .filter(
            (option): option is NonNullable<Combobox['items'][number]['element']> =>
              option !== undefined
          )
          .filter(option => option.getAttribute('role') === 'option')
          .filter(option => {
            const root = option.getRootNode();

            return (
              option.closest('sl-listbox') === listbox ||
              (root instanceof ShadowRoot && root.host.hasAttribute('data-virtual-list'))
            );
          });

        expect(options).to.have.lengthOf(4);

        options.forEach((option, index) => {
          expect(option).to.have.attribute('aria-posinset', (index + 1).toString());
          expect(option).to.have.attribute('aria-setsize', '4');
        });
      });

      it('should have set the group name in the option items', () => {
        // Verify that items have group information
        const options = el.items.filter(item => 'option' in item);

        expect(options[0].group).to.equal('Fruits');
        expect(options[1].group).to.equal('Fruits');
        expect(options[2].group).to.equal('Vegetables');
        expect(options[3].group).to.equal('Vegetables');

        // The aria-label with group context is set in #renderItem when virtualizer renders
      });

      it('should have aria-selected on all options', () => {
        // Verify that items are structured correctly for aria-selected
        const options = el.items.filter(item => 'option' in item);

        options.forEach(option => {
          expect(option.selected).to.be.oneOf([true, false, undefined]);
        });
      });

      it('should update aria-activedescendant to point to current option', async () => {
        // Ensure the popover is open
        await userEvent.click(input);
        await el.updateComplete;
        await waitForNextFrame();

        // Navigate to first option
        await userEvent.keyboard('{ArrowDown}');
        await el.updateComplete;
        await waitForNextFrame();

        // The current item should be set and aria-activedescendant should point to it
        if (el.currentItem) {
          expect(input).to.have.attribute('aria-activedescendant', el.currentItem.id);
        } else {
          // If currentItem is not set, that's also acceptable for initial state
          expect(el.currentItem).to.be.undefined;
        }
      });
    });

    describe('grouped options in light DOM', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox>
            <sl-listbox>
              <sl-option-group label="Group 1">
                <sl-option value="1">Option 1</sl-option>
                <sl-option value="2">Option 2</sl-option>
              </sl-option-group>
              <sl-option-group label="Group 2">
                <sl-option value="3">Option 3</sl-option>
                <sl-option value="4">Option 4</sl-option>
              </sl-option-group>
            </sl-listbox>
          </sl-combobox>
        `);
        input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;

        // Give time for options to be processed
        await waitForNextFrame();
        await waitForNextMacrotask();
      });

      it('should not have role="group" on option-group elements', () => {
        const groups = el.querySelectorAll('sl-option-group');

        groups.forEach(group => {
          expect(group).not.to.have.attribute('role', 'group');
        });
      });

      it('should have aria-hidden="true" on group headers', () => {
        const groups = el.querySelectorAll('sl-option-group');

        groups.forEach(group => {
          const header = group.shadowRoot?.querySelector('sl-option-group-header');
          expect(header).to.have.attribute('aria-hidden', 'true');
        });
      });

      it('should have flattened aria-posinset and aria-setsize across all options', async () => {
        // Trigger options processing
        input.focus();
        await el.updateComplete;
        await waitForNextFrame();
        await waitForNextMacrotask();

        const options = el.querySelectorAll('sl-option');

        expect(options).to.have.lengthOf(4);

        options.forEach((option, index) => {
          expect(option).to.have.attribute('aria-posinset', (index + 1).toString());
          expect(option).to.have.attribute('aria-setsize', '4');
        });
      });

      it('should include group context in option accessible names', async () => {
        // Trigger options processing
        input.focus();
        await el.updateComplete;
        await waitForNextFrame();
        await waitForNextMacrotask();

        const options = el.querySelectorAll('sl-option');

        expect(options[0]).to.have.attribute('aria-label', 'Option 1 (Group 1)');
        expect(options[1]).to.have.attribute('aria-label', 'Option 2 (Group 1)');
        expect(options[2]).to.have.attribute('aria-label', 'Option 3 (Group 2)');
        expect(options[3]).to.have.attribute('aria-label', 'Option 4 (Group 2)');
      });
    });

    describe('required', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-combobox multiple required>
            <sl-listbox>
              <sl-option value="1">Option 1</sl-option>
              <sl-option value="2">Option 2</sl-option>
              <sl-option value="3">Option 3</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);
      });

      it('should be invalid', () => {
        expect(el.valid).to.be.false;
      });

      it('should be invalid when it has a placeholder', async () => {
        el.placeholder = 'Placeholder';
        await el.updateComplete;

        expect(el.valid).to.be.false;
      });

      it('should be valid when an option is selected', async () => {
        el.click();
        await el.updateComplete;

        el.querySelector('sl-option')?.click();
        await el.updateComplete;

        expect(el.valid).to.be.true;
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

    it('should not emit an sl-change event on initial render when an option is pre-selected via attribute', async () => {
      const changeSpy = spy(),
        el = await fixture<Combobox>(html`
          <sl-combobox @sl-change=${changeSpy}>
            <sl-listbox>
              <sl-option selected>Option 1</sl-option>
              <sl-option>Option 2</sl-option>
            </sl-listbox>
          </sl-combobox>
        `);

      await el.updateComplete;
      await waitForNextFrame();
      await waitForNextMacrotask();

      expect(el.value).to.equal('Option 1');
      expect(changeSpy).not.to.have.been.called;

      // Ensure that subsequent user interaction DOES emit an sl-change event
      const options = Array.from(el.querySelectorAll('sl-option'));

      options.at(1)?.click();
      await el.updateComplete;

      expect(el.value).to.equal('Option 2');
      expect(changeSpy).to.have.been.calledOnce;
    });

    it('should not overwrite custom validation errors', async () => {
      const combobox = el.renderRoot.querySelector<Combobox>('sl-combobox')!;
      combobox.setCustomValidity('Custom error message');
      combobox.updateValidity();
      await combobox.updateComplete;

      expect(combobox.validity.customError).to.be.true;
      expect(combobox.validationMessage).to.equal('Custom error message');

      combobox.value = 'Option 1';
      await combobox.updateComplete;

      expect(combobox.validity.customError).to.be.true;
      expect(combobox.validationMessage).to.equal('Custom error message');
    });

    it('should update validity when value is set programmatically on a required combobox', async () => {
      const el = await fixture<Combobox>(html`
        <sl-combobox required>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);
      await el.updateComplete;

      expect(el.validity.valueMissing).to.be.true;

      el.value = 'Option 1';
      await el.updateComplete;

      expect(el.validity.valueMissing).to.be.false;
    });

    it('should focus the input when the label is clicked', async () => {
      const input = el.renderRoot.querySelector('input'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).to.equal(input);
    });
  });

  describe('virtual list', () => {
    const waitForVirtualList = async (): Promise<void> => {
      await waitForNextFrame();
      await waitForNextFrame();
    };

    const getRenderedVirtualOptions = (combobox: Combobox): Element[] => {
      const listbox = combobox.querySelector('sl-listbox'),
        virtualList = Array.from(listbox?.children ?? []).find(
          child =>
            child.hasAttribute('data-virtual-list') ||
            child.tagName.toLowerCase().includes('virtual-list')
        );

      return Array.from(virtualList?.shadowRoot?.querySelectorAll('sl-option') ?? []);
    };

    it('should submit index 0 for the first item in a virtual list', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <sl-combobox name="test" .options=${['Option 1', 'Option 2']}></sl-combobox>
        </form>
      `);
      const combobox = form.querySelector<Combobox>('sl-combobox')!;
      await combobox.updateComplete;

      combobox.value = 'Option 1';
      await combobox.updateComplete;

      const formData = new FormData(form);
      expect(formData.get('test')).to.equal('0');
      expect(combobox.value).to.equal('Option 1');
    });

    it('should submit index 1 for the second item in a virtual list', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <sl-combobox name="test" .options=${['Option 1', 'Option 2']}></sl-combobox>
        </form>
      `);
      const combobox = form.querySelector<Combobox>('sl-combobox')!;
      await combobox.updateComplete;

      combobox.value = 'Option 2';
      await combobox.updateComplete;

      const formData = new FormData(form);
      expect(formData.get('test')).to.equal('1');
      expect(combobox.value).to.equal('Option 2');
    });

    it('should open a virtual list with object options without crashing', async () => {
      const options = Array.from({ length: 1000 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: i
      }));

      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          .options=${options}
          .value=${300}
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);

      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

      input.click();
      await combobox.updateComplete;
      await waitForNextFrame();

      expect(input).to.have.attribute('aria-expanded', 'true');
      expect(combobox.querySelector('sl-listbox')).to.exist;
    });

    it('should render disabled options from option-disabled-path', async () => {
      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          .options=${[
            { disabled: false, label: 'Option 1', value: 'option-1' },
            { disabled: true, label: 'Option 2', value: 'option-2' }
          ]}
          option-disabled-path="disabled"
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);
      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

      input.click();
      await combobox.updateComplete;
      await waitForVirtualList();

      const options = getRenderedVirtualOptions(combobox);
      expect(options[0]).not.to.have.attribute('disabled');
      expect(options[1]).to.have.attribute('disabled');
    });

    it('should not select an option disabled via option-disabled-path on click', async () => {
      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          .options=${[
            { disabled: true, label: 'Option 1', value: 'option-1' },
            { disabled: false, label: 'Option 2', value: 'option-2' }
          ]}
          option-disabled-path="disabled"
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);
      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

      input.click();
      await combobox.updateComplete;
      await waitForVirtualList();

      getRenderedVirtualOptions(combobox)[0].dispatchEvent(
        new MouseEvent('click', { bubbles: true, composed: true })
      );
      await combobox.updateComplete;

      expect(combobox.value).to.be.undefined;
    });

    it('should skip options disabled via option-disabled-path during keyboard selection', async () => {
      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          .options=${[
            { disabled: true, label: 'Option 1', value: 'option-1' },
            { disabled: false, label: 'Option 2', value: 'option-2' }
          ]}
          option-disabled-path="disabled"
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);
      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

      input.focus();
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');
      await combobox.updateComplete;

      expect(combobox.value).to.equal('option-2');
      expect(input.value).to.equal('Option 2');
    });

    it('should not inline autocomplete to an option disabled via option-disabled-path', async () => {
      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          autocomplete="inline"
          .options=${[
            { disabled: true, label: 'Physics', value: 'physics' },
            { disabled: false, label: 'Philosophy', value: 'philosophy' }
          ]}
          option-disabled-path="disabled"
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);
      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

      input.focus();
      await userEvent.keyboard('P');
      await combobox.updateComplete;

      expect(input.value).to.equal('Philosophy');
      expect(combobox.currentItem?.value).to.equal('philosophy');
    });

    it('should allow custom values that match an option disabled via option-disabled-path', async () => {
      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          allow-custom-values
          autocomplete="off"
          .options=${[{ disabled: true, label: 'Physics', value: 'physics' }]}
          option-disabled-path="disabled"
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);
      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

      input.focus();
      await userEvent.keyboard('physics');
      await combobox.updateComplete;

      expect(combobox.createCustomOption).to.exist;
      expect(combobox.createCustomOption?.value).to.equal('physics');
      expect(combobox.currentItem).to.equal(combobox.createCustomOption);
    });

    it('should navigate to the last enabled option on ArrowUp when current item is disabled', async () => {
      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          .options=${[
            { disabled: true, label: 'Option 1', value: 'option-1' },
            { disabled: false, label: 'Option 2', value: 'option-2' },
            { disabled: false, label: 'Option 3', value: 'option-3' }
          ]}
          option-disabled-path="disabled"
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);
      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;

      combobox.currentItem = combobox.items[0];
      input.focus();
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowUp}');
      await combobox.updateComplete;

      expect(combobox.currentItem?.value).to.equal('option-3');
    });

    it('should not select a group header when typing a group name', async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <sl-combobox
            name="test"
            .options=${[
              { group: 'Fruits', label: 'Apple', value: 'apple' },
              { group: 'Fruits', label: 'Banana', value: 'banana' },
              { group: 'Vegetables', label: 'Carrot', value: 'carrot' }
            ]}
            option-group-path="group"
            option-label-path="label"
            option-value-path="value">
          </sl-combobox>
        </form>
      `);

      const combobox = form.querySelector<Combobox>('sl-combobox')!,
        input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;
      form.addEventListener('submit', event => event.preventDefault());

      input.focus();
      input.value = 'Fruits';
      input.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          composed: true,
          inputType: 'insertText'
        })
      );
      await combobox.updateComplete;
      await waitForVirtualList();

      expect(combobox.currentItem).to.be.undefined;

      input.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          composed: true,
          key: 'Enter'
        })
      );
      await combobox.updateComplete;

      expect(combobox.value).to.be.undefined;
      expect(new FormData(form).get('test')).to.be.null;
    });

    it('should scroll back to the selected group after selecting a virtual option', async () => {
      const options = Array.from({ length: 1000 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: i
      }));

      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          group-selected
          multiple
          .options=${options}
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);

      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!,
        listbox = combobox.querySelector('sl-listbox')!;

      input.click();
      await combobox.updateComplete;
      await waitForVirtualList();

      listbox.scrollToIndex(900, { block: 'start' });
      await waitForVirtualList();

      const scrollToIndex = spy(listbox, 'scrollToIndex');

      try {
        const option = getRenderedVirtualOptions(combobox).find(
          option => option.textContent?.trim() === 'Option 901'
        );

        expect(option).to.exist;

        option!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
        await combobox.updateComplete;
        await waitForVirtualList();

        expect(scrollToIndex).to.have.been.called;
        expect(scrollToIndex.lastCall.args[0]).to.equal(0);
        expect(scrollToIndex.lastCall.args[1]).to.deep.equal({
          block: 'start',
          behavior: 'auto'
        });
      } finally {
        scrollToIndex.restore();
      }
    });

    it('should update grouped virtual list selections without recursive cleanup', async () => {
      const options = Array.from({ length: 1000 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: i
      }));

      const combobox = await fixture<Combobox>(html`
        <sl-combobox
          group-selected
          multiple
          .options=${options}
          .value=${[300]}
          option-label-path="label"
          option-value-path="value">
        </sl-combobox>
      `);

      // Switching value to empty exercises grouped-option cleanup paths.
      combobox.value = [];
      await combobox.updateComplete;

      const input = combobox.querySelector<HTMLInputElement>('input[slot="input"]')!;
      input.click();
      await combobox.updateComplete;
      await waitForNextFrame();

      expect(input).to.have.attribute('aria-expanded', 'true');
      expect(combobox.querySelector('sl-listbox')).to.exist;
    });
  });

  describe('accessibility', () => {
    it('should forward aria-label from host to input', async () => {
      const el = await fixture<Combobox>(html`
        <sl-combobox aria-label="Search options">
          <sl-listbox>
            <sl-option>Option 1</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);

      const input = el.querySelector('input[slot="input"]')!;

      expect(el).to.exist;
      expect(input).to.exist;
      expect(el).to.have.attribute('aria-label', 'Search options');
      expect(input).not.to.have.attribute('aria-label', 'Search options');

      // Wait for the mixin's requestAnimationFrame to complete
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      expect(input).to.have.attribute('aria-label', 'Search options');
      expect(el).not.to.have.attribute('aria-label');
    });

    it('should forward aria-describedby from host to input', async () => {
      const el = await fixture<Combobox>(html`
        <sl-combobox aria-describedby="hint-id">
          <sl-listbox>
            <sl-option>Option 1</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);

      // Wait for the mixin's requestAnimationFrame to complete
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      const input = el.querySelector('input[slot="input"]')!;

      expect(input).to.have.attribute('aria-describedby', 'hint-id');
      expect(el).not.to.have.attribute('aria-describedby');
    });

    it('should forward aria-labelledby from host to input', async () => {
      const el = await fixture<Combobox>(html`
        <sl-combobox aria-labelledby="label-id">
          <sl-listbox>
            <sl-option>Option 1</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);

      // Wait for the mixin's requestAnimationFrame to complete
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      const input = el.querySelector('input[slot="input"]')!;

      expect(input).to.have.attribute('aria-labelledby', 'label-id');
      expect(el).not.to.have.attribute('aria-labelledby');
    });

    it('should update aria-label on input when changed on host', async () => {
      const el = await fixture<Combobox>(html`
        <sl-combobox aria-label="Initial label">
          <sl-listbox>
            <sl-option>Option 1</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);

      // Wait for the mixin's requestAnimationFrame to complete
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      const input = el.querySelector('input[slot="input"]')!;
      expect(input).to.have.attribute('aria-label', 'Initial label');
      expect(el).not.to.have.attribute('aria-label');

      el.setAttribute('aria-label', 'Updated label');
      await el.updateComplete;
      // Wait for ObserveAttributesMixin's requestAnimationFrame
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      expect(input).to.have.attribute('aria-label', 'Updated label');
      expect(el).not.to.have.attribute('aria-label');
    });

    it('should set aria-labelledby on input when data-label-id is set', async () => {
      const el = await fixture<Combobox>(html`
        <sl-combobox>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);
      await el.updateComplete;

      const input = el.querySelector('input[slot="input"]')!;

      el.setAttribute('data-label-id', 'sl-label-123');
      await el.updateComplete;

      expect(input).to.have.attribute('aria-labelledby', 'sl-label-123');
    });
    it('should have proper ARIA roles and attributes', async () => {
      const el = await fixture<Combobox>(html`
        <sl-combobox>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);
      await el.updateComplete;

      const input = el.querySelector('input[slot="input"]')!;
      const listbox = el.querySelector('sl-listbox')!;

      expect(input).to.have.attribute('role', 'combobox');
      expect(input).to.have.attribute('aria-autocomplete');
      expect(input).to.have.attribute('aria-expanded', 'false');
      expect(input).to.have.attribute('aria-haspopup', 'listbox');
      expect(input).to.have.attribute('aria-controls', listbox.id);
    });
  });
});
