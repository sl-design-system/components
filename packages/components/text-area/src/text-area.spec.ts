import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { TextArea } from './text-area.js';

describe('sl-text-area', () => {
  let el: TextArea, textArea: HTMLTextAreaElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area></sl-text-area>`);
      textArea = el.querySelector('textarea')!;
    });

    it('should have a textarea slot', () => {
      const slot = el.renderRoot.querySelector('slot[name="textarea"]');

      expect(slot).to.exist;
    });

    it('should be valid', () => {
      expect(el.valid).to.be.true;
    });

    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
      expect(el).not.to.have.attribute('disabled');
      expect(el.querySelector('textarea')?.disabled).to.be.false;
    });

    it('should be disabled if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.querySelector('textarea')?.disabled).to.be.true;
    });

    it('should not be required', () => {
      expect(el.required).not.to.be.true;
      expect(el.querySelector('textarea')?.required).to.be.false;
    });

    it('should be required if set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.querySelector('textarea')?.required).to.be.true;
    });

    it('should not have a value', () => {
      expect(el.value).to.equal('');
      expect(el.querySelector('textarea')?.value).to.equal('');
    });

    it('should have a value when set', async () => {
      el.value = 'my value';
      await el.updateComplete;

      expect(el.querySelector('textarea')?.value).to.equal('my value');
    });

    it('should have a value after typing', async () => {
      el.focus();
      await userEvent.keyboard('Lorem');
      await el.updateComplete;

      expect(el.value).to.equal('Lorem');
      expect(el.querySelector('textarea')?.value).to.equal('Lorem');
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should have a large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should have a wrap property of soft', () => {
      expect(el.wrap).to.equal('soft');
      expect(el.querySelector('textarea')?.wrap).to.equal('soft');
    });

    it('should have a wrap property of hard when set', async () => {
      el.wrap = 'hard';
      await el.updateComplete;

      expect(el.querySelector('textarea')?.wrap).to.equal('hard');
    });

    it('should not be readonly', () => {
      expect(el.readonly).not.to.be.true;
      expect(el.querySelector('textarea')?.readOnly).to.be.false;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el.querySelector('textarea')?.readOnly).to.be.true;
    });

    it('should have autocomplete turned off', () => {
      expect(el.querySelector('textarea')?.autocomplete).to.equal('off');
    });

    it('should have an autocomplete when set', async () => {
      el.autocomplete = 'username';
      await el.updateComplete;

      expect(el.querySelector('textarea')?.autocomplete).to.equal('username');
    });

    it('should not have a placeholder by default', () => {
      expect(el).not.to.have.attribute('placeholder');
      expect(el.placeholder).to.be.undefined;
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'my placeholder';
      await el.updateComplete;

      expect(el.querySelector('textarea')?.placeholder).to.equal('my placeholder');
    });

    it('should not have a minlength by default', () => {
      expect(el).not.to.have.attribute('minlength');
      expect(el.minLength).to.be.undefined;
    });

    it('should have a minlength when set', async () => {
      el.minLength = 2;
      await el.updateComplete;

      expect(el.querySelector('textarea')?.minLength).to.equal(2);
    });

    it('should not have a maxlength by default', () => {
      expect(el).not.to.have.attribute('maxlength');
      expect(el.maxLength).to.be.undefined;
    });

    it('should have a maxlength when set', async () => {
      el.maxLength = 2;
      await el.updateComplete;

      expect(el.querySelector('textarea')?.maxLength).to.equal(2);
    });

    it('should resize vertically', () => {
      expect(el).to.have.attribute('resize', 'vertical');
      expect(el.resize).to.equal('vertical');
      expect(textArea.style.resize).to.equal('vertical');
    });

    it('should resize automatically when set', async () => {
      el.resize = 'auto';
      await el.updateComplete;

      expect(el).to.have.attribute('resize', 'auto');
    });

    it('should set resize to none when set', async () => {
      el.resize = 'none';
      await el.updateComplete;

      expect(el).to.have.attribute('resize', 'none');
      expect(el.resize).to.equal('none');
      expect(textArea.style.resize).to.equal('none');
    });

    it('should proxy the aria-disabled attribute to the textarea element', async () => {
      el.setAttribute('aria-disabled', 'true');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-disabled');
      expect(el.textarea).to.have.attribute('aria-disabled', 'true');
    });

    it('should proxy the aria-label attribute to the textarea element', async () => {
      el.setAttribute('aria-label', 'Label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-label');
      expect(el.textarea).to.have.attribute('aria-label', 'Label');
    });

    it('should proxy the aria-labelledby attribute to the textarea element', async () => {
      el.setAttribute('aria-labelledby', 'id');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-labelledby');
      expect(el.textarea).to.have.attribute('aria-labelledby', 'id');
    });

    it('should proxy the aria-required attribute to the textarea element', async () => {
      el.setAttribute('aria-required', 'true');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-required');
      expect(el.textarea).to.have.attribute('aria-required', 'true');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after typing in the input', async () => {
      el.focus();
      await userEvent.keyboard('L');

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after typing in the input', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      el.focus();
      await userEvent.keyboard('L');

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after textarea loses focus', () => {
      textArea.focus();
      textArea.blur();

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);

      textArea.focus();
      textArea.blur();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should focus the textarea when focusing the element', () => {
      el.focus();

      expect(document.activeElement).to.equal(textArea);
    });

    it('should emit an sl-focus event when focusing the input', () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      textArea.focus();

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the input', async () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      textArea.focus();
      await userEvent.tab();

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when typing in the input', async () => {
      const onInput = spy();

      el.addEventListener('sl-change', onInput);
      textArea.focus();
      await userEvent.keyboard('Lorem');

      expect(onInput.callCount).to.equal(5);
    });

    it('should emit an sl-validate event when calling reportValidity', () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.reportValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when typing text', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.focus();
      await userEvent.keyboard('Lorem');

      expect(onValidate).to.have.been.callCount(5);
    });
  });

  describe('rows', () => {
    it('should default to 3 rows when not set', async () => {
      el = await fixture(html`<sl-text-area></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(textArea.rows).to.equal(3);
    });

    it('should set the --_sl-text-area-rows CSS variable to 3 by default', async () => {
      el = await fixture(html`<sl-text-area></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('3');
    });

    it('should use the specified number of rows when set', async () => {
      el = await fixture(html`<sl-text-area rows="5"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(el.rows).to.equal(5);
      expect(textArea.rows).to.equal(5);
    });

    it('should update the --_sl-text-area-rows CSS variable when rows is set', async () => {
      el = await fixture(html`<sl-text-area rows="5"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('5');
    });

    it('should fall back to 3 rows when set to 0', async () => {
      el = await fixture(html`<sl-text-area rows="0"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(textArea.rows).to.equal(3);
      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('3');
    });

    it('should fall back to 3 rows when set to a negative value', async () => {
      el = await fixture(html`<sl-text-area rows="-5"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(textArea.rows).to.equal(3);
      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('3');
    });

    it('should update rows and CSS variable when property changes', async () => {
      el = await fixture(html`<sl-text-area rows="3"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      el.rows = 7;
      await el.updateComplete;

      expect(textArea.rows).to.equal(7);
      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('7');
    });

    it('should fall back to 3 when property changes to invalid value', async () => {
      el = await fixture(html`<sl-text-area rows="5"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      el.rows = 0;
      await el.updateComplete;

      expect(textArea.rows).to.equal(3);
      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('3');
    });

    it('should maintain CSS variable with resize="vertical"', async () => {
      el = await fixture(html`<sl-text-area rows="6" resize="vertical"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(textArea.rows).to.equal(6);
      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('6');
      expect(textArea.style.resize).to.equal('vertical');
    });

    it('should maintain CSS variable with resize="auto"', async () => {
      el = await fixture(html`<sl-text-area rows="4" resize="auto"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(textArea.rows).to.equal(4);
      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('4');
    });

    it('should maintain CSS variable with resize="none"', async () => {
      el = await fixture(html`<sl-text-area rows="8" resize="none"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;

      expect(textArea.rows).to.equal(8);
      expect(textArea.style.getPropertyValue('--_sl-text-area-rows')).to.equal('8');
      expect(textArea.style.resize).to.equal('none');
    });
  });

  describe('required', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area required></sl-text-area>`);
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
    });

    it('should have a validation message', () => {
      expect(el.validationMessage).to.equal('Please fill out this field.');
    });

    it('should have a custom validation message after calling setCustomValidity', () => {
      el.setCustomValidity('Custom validation message');

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message if calling setCustomValidity in the sl-validate handler', async () => {
      el.addEventListener('sl-validate', () => el.setCustomValidity('Custom validation message'));

      el.focus();
      await userEvent.keyboard('L');

      expect(el.validationMessage).to.equal('Custom validation message');
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

    it('should be valid after typing', async () => {
      el.focus();
      await userEvent.keyboard('asdf ');
      await el.updateComplete;

      expect(el.valid).to.equal(true);
    });
  });

  describe('maxlength', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area maxlength="3"></sl-text-area>`);
    });

    it('should be valid', () => {
      expect(el.valid).to.be.true;
    });

    it('should not allow typing more characters than the maxlength', async () => {
      el.focus();
      await userEvent.keyboard('qwerty');
      await el.updateComplete;

      expect(el.value).to.equal('qwe');
    });
  });

  describe('minlength', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area minlength="3"></sl-text-area>`);
      el.focus();
      await userEvent.keyboard('a');
      await el.updateComplete;
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
    });

    it('should have a validation message', () => {
      expect(el.validationMessage).to.equal(
        'Please lengthen this text to 3 characters or more (you are currently using 1 character).'
      );
    });

    it('should have a localized validation message', () => {
      expect(el.getLocalizedValidationMessage()).to.equal(
        'Please enter at least 3 characters (you currently have 1 character).'
      );
    });

    it('should be valid after typing', async () => {
      el.focus();
      await userEvent.keyboard('dsf');
      await el.updateComplete;

      expect(el.valid).to.equal(true);
    });
  });

  describe('show-valid', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area show-valid></sl-text-area>`);
    });

    it('should reflect the attribute', () => {
      expect(el.showValid).to.be.true;
    });

    it('should not have a valid icon', () => {
      expect(el.renderRoot.querySelector('sl-icon')).to.be.null;
    });

    it('should have a valid icon after reporting', async () => {
      el.reportValidity();
      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.class('valid');
    });
  });

  describe('resize', () => {
    describe('vertical (default)', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-text-area></sl-text-area>`);
        textArea = el.querySelector('textarea')!;
      });

      it('should default to vertical', () => {
        expect(el.resize).to.equal('vertical');
        expect(el).to.have.attribute('resize', 'vertical');
        expect(textArea.style.resize).to.equal('vertical');
      });

      it('should not set a custom height', () => {
        expect(textArea.style.height).to.equal('');
      });
    });

    describe('none', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-text-area resize="none"></sl-text-area>`);
        textArea = el.querySelector('textarea')!;
      });

      it('should have resize set to none', () => {
        expect(el.resize).to.equal('none');
        expect(el).to.have.attribute('resize', 'none');
        expect(textArea.style.resize).to.equal('none');
      });

      it('should not set a custom height', () => {
        expect(textArea.style.height).to.equal('');
      });
    });

    describe('switching between resize types', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-text-area></sl-text-area>`);
        textArea = el.querySelector('textarea')!;
      });

      it('should update from vertical to auto', async () => {
        expect(el.resize).to.equal('vertical');

        el.resize = 'auto';
        await el.updateComplete;

        expect(el.resize).to.equal('auto');
        expect(textArea.style.resize).to.equal('none');
        expect(textArea.style.height).to.not.equal('');
      });

      it('should update from auto to vertical and restore default height', async () => {
        el.resize = 'auto';
        await el.updateComplete;

        const customHeight = textArea.style.height;
        expect(customHeight).to.not.equal('');

        el.resize = 'vertical';
        await el.updateComplete;

        expect(el.resize).to.equal('vertical');
        expect(textArea.style.resize).to.equal('vertical');
        expect(textArea.style.height).to.equal('74px');
      });

      it('should update from vertical to none', async () => {
        el.resize = 'none';
        await el.updateComplete;

        expect(el.resize).to.equal('none');
        expect(textArea.style.resize).to.equal('none');
      });

      it('should update from none to auto', async () => {
        el.resize = 'none';
        await el.updateComplete;

        el.resize = 'auto';
        await el.updateComplete;

        expect(el.resize).to.equal('auto');
        expect(textArea.style.resize).to.equal('none');
        expect(textArea.style.height).to.not.equal('');
      });
    });
  });

  describe('auto resize', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area resize="auto"></sl-text-area>`);
      textArea = el.querySelector('textarea')!;
    });

    it('should have resize set to auto', () => {
      expect(el.resize).to.equal('auto');
      expect(el).to.have.attribute('resize', 'auto');
      expect(textArea.style.resize).to.equal('none');
    });

    it('should set the textarea height based on scrollHeight', () => {
      expect(textArea.style.height).to.not.equal('');
      expect(textArea.style.height).to.not.equal('auto');
    });

    it('should update height when content changes', async () => {
      const initialHeight = textArea.style.height;

      el.focus();
      await userEvent.keyboard('Line 1\nLine 2\nLine 3\nLine 4\nLine 5');
      await el.updateComplete;

      // The height should be updated after adding multiple lines
      expect(textArea.style.height).to.not.equal(initialHeight);
      expect(textArea.style.height).to.not.equal('auto');
    });

    it('should recalculate height on input', async () => {
      el.focus();

      await userEvent.keyboard('Short text');
      await el.updateComplete;

      const shortHeight = textArea.style.height;

      await userEvent.keyboard(
        '\nLonger text that spans multiple lines\nAnd another line\nAnd yet another line'
      );
      await el.updateComplete;

      const longHeight = textArea.style.height;

      expect(longHeight).to.not.equal(shortHeight);
    });

    it('should restore the default height when resize is changed from auto to vertical', async () => {
      el.resize = 'vertical';
      await el.updateComplete;

      expect(textArea.style.height).to.equal('74px');
      expect(textArea.style.resize).to.equal('vertical');
    });
  });

  describe('slotted textarea', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-text-area>
          <textarea
            id="foo"
            placeholder="I am a custom textarea"
            spellcheck="true"
            slot="textarea"></textarea>
        </sl-text-area>
      `);
    });

    it('should use the slotted textarea', () => {
      expect(el.textarea).to.equal(el.querySelector('textarea#foo'));
    });

    it('should overwrite any properties managed by the component', () => {
      const textarea = el.querySelector('textarea');

      expect(textarea?.placeholder).to.equal('');
      expect(textarea?.spellcheck).to.be.true;
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-form-field label="Label">
            <sl-text-area @sl-form-control=${this.onFormControl}></sl-text-area>
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

    it('should focus the textarea when the label is clicked', async () => {
      const textarea = el.renderRoot.querySelector('textarea'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).to.equal(textarea);
    });
  });

  describe('show-count', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-area show-count="5"></sl-text-area>`);
    });

    it('should become invalid when the soft limit is exceeded', async () => {
      el.focus();
      await userEvent.keyboard('abcdef');
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el).to.have.attribute('show-validity', 'invalid');
    });

    it('should not show a validation message before reportValidity', async () => {
      el.focus();
      await userEvent.keyboard('abcdef');
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'invalid');
      expect(el.getLocalizedValidationMessage()).to.equal('');
    });

    it('should show validation message after reportValidity when over the soft limit', async () => {
      el.focus();
      await userEvent.keyboard('abcdef');
      await el.updateComplete;

      el.reportValidity();
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'invalid');
      expect(el.validationMessage).to.equal('Please remove at least 1 character.');
    });

    it('should render count text before reportValidity when over the soft limit', async () => {
      el.focus();
      await userEvent.keyboard('abcdef');
      await el.updateComplete;

      const count = el.renderRoot.querySelector('.count');

      expect(count).to.exist;
      expect(count?.textContent?.trim()).to.equal('1 character too many');
    });

    it('should hide count text after reportValidity when over the soft limit', async () => {
      el.focus();
      await userEvent.keyboard('abcdefghijklmnopqrs');
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.count')?.textContent?.trim()).to.equal(
        '14 characters too many'
      );

      el.reportValidity();
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.count')).to.be.null;
      expect(el.validationMessage).to.equal('Please remove at least 14 characters.');
    });

    it('should connect count span to textarea with ariaDescribedByElements when count is visible', async () => {
      const textarea = el.querySelector('textarea')!;
      const count = el.renderRoot.querySelector('.count');

      await el.updateComplete;

      expect(count).to.exist;
      expect(count).to.have.attribute('id');
      expect(textarea.getAttribute('aria-describedby')).to.include(`${count!.id}-description`);

      // If ariaDescribedByElements is supported, it must include the count description element.
      const linkedElements = textarea.ariaDescribedByElements;
      if (linkedElements !== null && linkedElements !== undefined) {
        const descriptions = Array.from(linkedElements);
        expect(descriptions.some(el => el.textContent?.trim() === '5 characters remaining')).to.be
          .true;
      }
    });

    it('should include hint element in ariaDescribedByElements when both hint and count are present', async () => {
      const textarea = el.querySelector('textarea')!;

      // Simulate what form-field does: add a hint element and append its ID to aria-describedby.
      const hintEl = document.createElement('span');
      hintEl.id = 'test-hint-123';
      hintEl.textContent = 'Hint text';
      document.body.append(hintEl);

      textarea.setAttribute('aria-describedby', 'test-hint-123');

      // Wait for the MutationObserver to fire and re-sync.
      await new Promise(resolve => setTimeout(resolve, 50));

      const linkedElements = textarea.ariaDescribedByElements;

      if (linkedElements !== null && linkedElements !== undefined) {
        const list = Array.from(linkedElements);
        // Both hint and count description should be in element references
        expect(list.some(el => el.id === 'test-hint-123')).to.be.true;
        expect(list.some(el => el.textContent?.trim() === '5 characters remaining')).to.be.true;
      }

      // String attribute should also have both IDs
      const describedBy = textarea.getAttribute('aria-describedby') ?? '';
      expect(describedBy).to.include('test-hint-123');
      expect(describedBy).to.include('-description');

      hintEl.remove();
    });

    it('should preserve existing aria-describedby ids when count is visible', async () => {
      const textarea = el.querySelector('textarea')!;

      textarea.setAttribute('aria-describedby', 'sl-form-field-hint-1');
      // Wait for MutationObserver to fire and re-sync.
      await new Promise(resolve => setTimeout(resolve, 50));

      const describedBy = textarea.getAttribute('aria-describedby') ?? '';

      expect(describedBy).to.include('sl-form-field-hint-1');
      expect(describedBy).to.include('sl-text-area-count-');
      expect(describedBy).to.include('-description');
    });

    it('should keep count description element in accessibility tree', async () => {
      const textarea = el.querySelector('textarea')!;

      await el.updateComplete;

      const describedById = textarea.getAttribute('aria-describedby');

      expect(describedById).to.exist;

      const description = describedById
        ?.split(/\s+/)
        .filter(Boolean)
        .find(id => id.includes('sl-text-area-count-') && id.endsWith('-description'));

      const element = description ? el.querySelector(`#${description}`) : null;

      expect(element).to.exist;
      expect(element).not.to.have.attribute('hidden');
    });

    it('should clear count from ariaDescribedByElements when count is hidden', async () => {
      const textarea = el.querySelector('textarea')!;
      const probe = document.createElement('textarea');
      const probeTarget = document.createElement('span');
      let supportsAriaDescribedByElements = false;

      try {
        probe.ariaDescribedByElements = [probeTarget];
        supportsAriaDescribedByElements = (probe.ariaDescribedByElements ?? []).includes(
          probeTarget
        );
      } catch {
        supportsAriaDescribedByElements = false;
      }

      el.focus();
      await userEvent.keyboard('abcdefghijklmnopqrs');
      await el.updateComplete;

      const initialCountId = el.renderRoot.querySelector('.count')?.id;

      el.reportValidity();
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.count')).to.be.null;

      if (supportsAriaDescribedByElements) {
        expect(textarea.ariaDescribedByElements ?? []).to.deep.equal([]);
      } else {
        expect(textarea.getAttribute('aria-describedby') ?? '').not.to.include(initialCountId!);
      }
    });

    it('should remove show-validity after going back under the soft limit', async () => {
      el.focus();
      await userEvent.keyboard('abcdef');
      await el.updateComplete;
      expect(el).to.have.attribute('show-validity', 'invalid');

      const textarea = el.querySelector('textarea')!;
      textarea.value = 'abc';
      textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await el.updateComplete;

      expect(el).not.to.have.attribute('show-validity', 'invalid');
      expect(el.valid).to.be.true;
      expect(el.validationMessage).to.equal('');
    });

    it('should keep showing validation message on overflow after returning under limit once', async () => {
      el.focus();
      await userEvent.keyboard('abcdef');
      await el.updateComplete;

      el.reportValidity();
      await el.updateComplete;

      const textarea = el.querySelector('textarea')!;

      textarea.value = 'abc';
      textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await el.updateComplete;

      textarea.value = 'abcdefghijklmnopqrs';
      textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.count')).to.be.null;
      expect(el.validationMessage).to.equal('Please remove at least 14 characters.');
    });

    it('should show overflow validation after required reportValidity was called earlier', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.reportValidity()).to.be.false;
      expect(el.validationMessage).to.equal('Please fill out this field.');

      const textarea = el.querySelector('textarea')!;

      textarea.value = 'abcdefghijklmnopqrs';
      textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.count')).to.be.null;
      expect(el.validationMessage).to.equal('Please remove at least 14 characters.');
    });

    it('should expose count in ariaDescribedByElements when used inside form-field', async () => {
      const wrapped = await fixture(html`
        <sl-form-field label="Label" hint="Hint text">
          <sl-text-area show-count="5"></sl-text-area>
        </sl-form-field>
      `);
      const area = wrapped.querySelector('sl-text-area') as TextArea,
        textarea = area.querySelector('textarea')!;

      await area.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(textarea.getAttribute('aria-describedby') ?? '').to.include('-description');

      const describedByElements = textarea.ariaDescribedByElements;

      if (describedByElements !== null && describedByElements !== undefined) {
        expect(
          Array.from(describedByElements).some(
            el => el.id.includes('sl-text-area-count-') && el.id.endsWith('-description')
          )
        ).to.be.true;
      }
    });
  });
});
