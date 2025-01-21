import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/text-field/register.js';
import { LitElement, type TemplateResult, html } from 'lit';
import { query } from 'lit/decorators.js';
import { spy, stub } from 'sinon';
import '../register.js';
import { FormController } from './form-controller.js';
import { type FormValidationErrors } from './form-validation-errors.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-form-validation-errors', () => {
  describe('defaults', () => {
    let el: FormValidationErrors;

    beforeEach(async () => {
      el = await fixture(html`<sl-form-validation-errors></sl-form-validation-errors>`);
    });

    it('should not be displayed', () => {
      expect(el).not.to.be.displayed;
    });

    it('should render an inline-message', () => {
      const inlineMessage = el.renderRoot.querySelector('sl-inline-message');

      expect(inlineMessage).to.exist;
      expect(inlineMessage?.variant).to.be.undefined;
    });

    it('should have text that everything is valid', () => {
      expect(el.renderRoot).to.have.trimmed.text('All fields are valid.');
    });
  });

  describe('with invalid controls', () => {
    class TestComponent extends LitElement {
      @query('sl-form-validation-errors') errors!: FormValidationErrors;

      form = new FormController(this);

      override render(): TemplateResult {
        return html`
          <sl-form>
            <sl-form-validation-errors .controller=${this.form}></sl-form-validation-errors>

            <sl-form-field label="Foo">
              <sl-text-field name="foo" required></sl-text-field>
            </sl-form-field>

            <sl-form-field label="Bar">
              <sl-text-field name="bar" required></sl-text-field>
            </sl-form-field>
          </sl-form>
        `;
      }
    }

    let el: TestComponent;

    beforeEach(async () => {
      try {
        customElements.define('test-component', TestComponent);
      } catch {
        /* empty */
      }

      el = await fixture(html`<test-component></test-component>`);
      await new Promise(resolve => setTimeout(resolve, 50));

      stub(el.form, 'invalid').get(() => true);
      stub(el.form, 'showValidity').get(() => true);
      await new Promise(resolve => setTimeout(resolve, 50));

      el.form.dispatchEvent(new Event('sl-update'));

      // Give all components time to update/render
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should be displayed if invalid and validity is shown', () => {
      expect(el.errors).to.be.displayed;
    });

    it('should have a danger variant when invalid', () => {
      expect(el.errors.variant).to.equal('danger');
      expect(el.errors.renderRoot.querySelector('sl-inline-message')).to.have.attribute('variant', 'danger');
    });

    it('should indicate that there are fields with errors', () => {
      const inlineMessage = el.errors.renderRoot.querySelector('sl-inline-message');

      expect(inlineMessage).to.contain.text('The following fields have errors:');
    });

    it('should link to the invalid controls', () => {
      const links = Array.from(el.errors.renderRoot.querySelectorAll<HTMLAnchorElement>('li a'));

      expect(links).to.have.length(2);
      expect(links.map(l => l.hash)).to.deep.equal(['#sl-form-field-control-6', '#sl-form-field-control-7']);
      expect(links.map(l => l.textContent?.trim())).to.deep.equal(['Foo', 'Bar']);
    });

    it('should focus the control when the link is clicked', () => {
      const textField = el.renderRoot.querySelector('sl-text-field')!,
        focusSpy = spy(textField, 'focus');

      el.errors.renderRoot.querySelector<HTMLAnchorElement>('li a')?.click();

      expect(focusSpy).to.have.been.called;
    });
  });

  describe('with valid controls', () => {
    class TestComponent extends LitElement {
      @query('sl-form-validation-errors') errors!: FormValidationErrors;

      form = new FormController(this);

      override render(): TemplateResult {
        return html`
          <sl-form>
            <sl-form-validation-errors .controller=${this.form}></sl-form-validation-errors>

            <sl-form-field label="Foo">
              <sl-text-field name="foo"></sl-text-field>
            </sl-form-field>

            <sl-form-field label="Bar">
              <sl-text-field name="bar"></sl-text-field>
            </sl-form-field>
          </sl-form>
        `;
      }
    }

    let el: TestComponent;

    beforeEach(async () => {
      try {
        customElements.define('test-component', TestComponent);
      } catch {
        /* empty */
      }

      el = await fixture(html`<test-component></test-component>`);

      // Simulate the form being invalid and then valid
      el.errors.validity = 'invalid';
      await el.errors.updateComplete;

      stub(el.form, 'invalid').get(() => false);
      stub(el.form, 'showValidity').get(() => true);

      el.form.dispatchEvent(new Event('sl-update'));

      // Give all components time to update/render
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should be displayed if valid and validity is shown', () => {
      expect(el.errors).to.be.displayed;
    });

    it('should have a success variant when invalid', () => {
      expect(el.errors.variant).to.equal('success');
      expect(el.errors.renderRoot.querySelector('sl-inline-message')).to.have.attribute('variant', 'success');
    });

    it('should indicate that all fields with valid', () => {
      const inlineMessage = el.errors.renderRoot.querySelector('sl-inline-message');

      expect(inlineMessage).to.contain.text('All fields are valid.');
    });
  });
});
