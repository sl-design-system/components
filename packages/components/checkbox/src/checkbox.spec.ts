import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import '@sl-design-system/infotip/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Checkbox } from './checkbox.js';

/**
 * Returns the text of a node as the accessible name computation sees it: `<slot>` elements resolve
 * to the nodes assigned to them, rather than to their (empty) own text content.
 */
function flattenedText(node: Node): string {
  if (node instanceof HTMLSlotElement) {
    return node.assignedNodes({ flatten: true }).map(flattenedText).join(' ');
  } else if (node instanceof Element) {
    return Array.from(node.childNodes).map(flattenedText).join(' ');
  }

  return node.textContent ?? '';
}

/**
 * The accessible name is built from the elements the checkbox points `ariaLabelledByElements` at.
 * One of those lives in the shadow DOM and wraps the default slot, so the text has to be
 * flattened.
 */
function accessibleName(el: Checkbox): string {
  return (el.internals.ariaLabelledByElements ?? [])
    .map(flattenedText)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('sl-checkbox', () => {
  let el: Checkbox;

  it('should ignore non-infotip elements assigned to the infotip slot', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label
        <span slot="infotip">Not an infotip</span>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip).to.be.undefined;
  });

  it('should set an infotip describe label based on the checkbox label', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip?.size).to.equal('sm');
    expect(el.infotip?.describes).to.equal('Label');
  });

  it('should not overwrite user-set describes on infotip', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label
        <sl-infotip slot="infotip" describes="Custom description">More info</sl-infotip>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip?.describes).to.equal('Custom description');
  });

  it('should extract text from multiple nodes for infotip describes', async () => {
    el = await fixture(html`
      <sl-checkbox>
        <span>Part 1</span> <span>Part 2</span>
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip?.describes).to.equal('Part 1 Part 2');
  });

  it('should normalize whitespace in label text for infotip describes', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label with extra spaces
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip?.describes).to.equal('Label with extra spaces');
  });

  it('should not check checkbox when clicking infotip', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-checkbox>
    `);

    const infotip = el.querySelector('sl-infotip') as HTMLElement;

    await userEvent.click(infotip);
    await el.updateComplete;

    expect(el.checked).not.to.be.true;
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should be a form associated custom element', () => {
      expect(Checkbox.formAssociated).to.be.true;
      expect(el.internals).to.exist;
      expect(el.formControlElement).to.equal(el);
    });

    it('should not render anything into the light DOM', () => {
      expect(el.children).to.have.length(0);
    });

    it('should have a checkbox role', () => {
      expect(el.internals.role).to.equal('checkbox');
    });

    it('should be focusable', () => {
      expect(el.tabIndex).to.equal(0);
    });

    it('should not be checked', () => {
      expect(el.checked).not.to.be.true;
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should be checked when set', async () => {
      el.checked = true;
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should have a size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
    });

    it('should not be indeterminate', () => {
      expect(el).not.to.have.attribute('indeterminate');
      expect(el.indeterminate).not.to.be.true;
    });

    it('should be indeterminate when set', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      expect(el).to.have.attribute('indeterminate');
      expect(el.internals.ariaChecked).to.equal('mixed');
    });

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

    it('should use the slotted text as the accessible name', () => {
      expect(accessibleName(el)).to.equal('Hello world');
    });

    it('should update the accessible name when the slotted text changes', async () => {
      el.textContent = 'Goodbye world';

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(accessibleName(el)).to.equal('Goodbye world');
    });

    it('should not have the no-label state', () => {
      expect(el).not.to.match(':state(no-label)');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after clicking the checkbox', () => {
      el.click();

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after clicking the checkbox', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.click();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after losing focus', async () => {
      el.focus();
      el.blur();

      await new Promise(resolve => setTimeout(resolve));

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.focus();
      el.blur();

      await new Promise(resolve => setTimeout(resolve));

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should toggle the state to checked when clicking the element', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(el.internals.ariaChecked).to.equal('true');

      el.click();
      await el.updateComplete;

      expect(el).not.to.have.attribute('checked');
      expect(el.checked).to.be.false;
      expect(el.internals.ariaChecked).to.equal('false');
    });

    it('should change the state to checked on when pressing enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
    });

    it('should change the state to checked on when pressing space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
    });

    it('should toggle the state when calling toggle()', async () => {
      el.toggle();
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(el.dirty).to.be.true;

      el.toggle();
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it('should set the state when calling toggle() with a value', async () => {
      el.toggle(true);
      await el.updateComplete;

      expect(el.checked).to.be.true;

      // Forcing the same value again should leave it checked
      el.toggle(true);
      await el.updateComplete;

      expect(el.checked).to.be.true;

      el.toggle(false);
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it('should emit an sl-change event when calling toggle()', () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.toggle();

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when clicking an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the space key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the enter key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-focus event when focusing the group', async () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      el.focus();
      await new Promise(resolve => setTimeout(resolve));

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the group', () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      el.focus();
      el.blur();

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when calling reportValidity', () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.reportValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event after click', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should re-attach its event listeners after being reconnected', async () => {
      const onChange = spy();
      const parent = el.parentElement!;

      el.addEventListener('sl-change', onChange);

      parent.removeChild(el);
      parent.appendChild(el);
      await el.updateComplete;

      el.click();
      await el.updateComplete;

      expect(el.checked).to.be.true;
      expect(onChange).to.have.been.calledOnce;
    });
  });

  describe('without a label', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox></sl-checkbox>`);
    });

    it('should have the no-label state', () => {
      expect(el).to.match(':state(no-label)');
    });

    it('should not have an accessible name of its own', () => {
      expect(accessibleName(el)).to.equal('');
    });

    it('should remove the no-label state once it has a label', async () => {
      el.textContent = 'Now labelled';

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.match(':state(no-label)');
      expect(accessibleName(el)).to.equal('Now labelled');
    });
  });

  describe('aria', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should keep aria attributes on the host', async () => {
      el.setAttribute('aria-describedby', 'my-description');
      await new Promise(resolve => setTimeout(resolve, 50));

      // The host *is* the form control, so ARIA is no longer proxied anywhere
      expect(el).to.have.attribute('aria-describedby', 'my-description');
    });

    it('should let an aria-label on the host override the slotted label', async () => {
      el.setAttribute('aria-label', 'Overridden');
      await new Promise(resolve => setTimeout(resolve, 50));

      // The internals label is a default; the host attribute takes precedence over it
      expect(el).to.have.attribute('aria-label', 'Overridden');
      expect(accessibleName(el)).to.equal('Hello world');
    });

    it('should let ariaLabelledByElements on the host override the slotted label', async () => {
      // This is how an sl-tooltip labels its anchor
      const tooltip = document.createElement('span');
      tooltip.textContent = 'Tooltip';
      el.insertAdjacentElement('afterend', tooltip);

      el.ariaLabelledByElements = [tooltip];
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.ariaLabelledByElements).to.deep.equal([tooltip]);

      tooltip.remove();
    });

    it('should mark the host as disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el.internals.ariaDisabled).to.equal('true');
      expect(el.tabIndex).to.equal(-1);
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox disabled>Hello world</sl-checkbox>`);
    });

    it('should be marked as disabled', () => {
      expect(el.disabled).to.be.true;
      expect(el.internals.ariaDisabled).to.equal('true');
    });

    it('should not be reachable with the keyboard', () => {
      expect(el.tabIndex).to.equal(-1);
    });

    it('should not change the state to checked when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
    });

    it('should not change the state to checked on enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await new Promise(resolve => setTimeout(resolve));

      expect(el.checked).not.to.be.true;
    });

    it('should not change the state to checked on space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');
      await new Promise(resolve => setTimeout(resolve));

      expect(el.checked).not.to.be.true;
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should be invalid when required and no option is selected', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validity.valueMissing).to.be.true;
    });

    it('should have no validation message when valid', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should be valid when checked and required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;

      el.click();
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should not have a show-validity attribute when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el).not.to.have.attribute('show-validity');
    });

    it('should have an invalid show-validity attribute when required and reported', async () => {
      el.required = true;
      await el.updateComplete;

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

    it('should have a validation message when unchecked and required', async () => {
      el.required = true;
      await el.updateComplete;

      // Check the localized validation message, since the native one can change
      expect(el.getLocalizedValidationMessage()).to.equal('Please check this box.');
    });

    it('should have a custom validation message when it has a custom-validity attribute', async () => {
      el.setAttribute('custom-validity', 'Custom validation message');
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message after calling setCustomValidity', async () => {
      el.setCustomValidity('Custom validation message');
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message when calling setCustomValidity on validate', async () => {
      el.addEventListener('sl-validate', () => el.setCustomValidity('Custom validation message'));

      el.required = true;
      await el.updateComplete;

      el.click();
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });
  });

  describe('form association', () => {
    let form: HTMLFormElement;

    beforeEach(async () => {
      form = await fixture(html`
        <form>
          <sl-checkbox name="answer" value="yes">Hello world</sl-checkbox>
        </form>
      `);

      el = form.querySelector('sl-checkbox')!;
      await el.updateComplete;
    });

    it('should be associated with the form', () => {
      expect(el.form).to.equal(form);
    });

    it('should not contribute a value when unchecked', () => {
      expect(Array.from(new FormData(form).entries())).to.deep.equal([]);
    });

    it('should contribute its value when checked', async () => {
      el.click();
      await el.updateComplete;

      expect(Array.from(new FormData(form).entries())).to.deep.equal([['answer', 'yes']]);
    });

    it('should restore the initial state when the form is reset', async () => {
      el.click();
      await el.updateComplete;
      expect(el.checked).to.be.true;

      form.reset();
      await el.updateComplete;

      expect(el.checked).to.be.false;
    });

    it('should restore a checked checkbox when the form is reset', async () => {
      const initiallyChecked = await fixture<HTMLFormElement>(html`
          <form><sl-checkbox checked name="on">Hello world</sl-checkbox></form>
        `),
        checkbox = initiallyChecked.querySelector('sl-checkbox')!;

      checkbox.click();
      await checkbox.updateComplete;
      expect(checkbox.checked).to.be.false;

      initiallyChecked.reset();
      await checkbox.updateComplete;

      expect(checkbox.checked).to.be.true;
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-form-field label="Label">
            <sl-checkbox @sl-form-control=${this.onFormControl}>Checkbox</sl-checkbox>
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

    it('should focus the checkbox when the label is clicked', async () => {
      const checkbox = el.renderRoot.querySelector('sl-checkbox'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).to.equal(checkbox);
    });

    it('should toggle the checkbox when the label is clicked', async () => {
      const checkbox = el.renderRoot.querySelector('sl-checkbox'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(checkbox).to.have.attribute('checked');
      expect(checkbox?.checked).to.be.true;
    });

    it('should include the field label in the accessible name', async () => {
      const checkbox = el.renderRoot.querySelector('sl-checkbox')!;

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(accessibleName(checkbox)).to.equal('Label Checkbox');
    });
  });
});
