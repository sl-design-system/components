import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/text-field/register.js';
import { LitElement, type TemplateResult, html } from 'lit';
import { query } from 'lit/decorators.js';
import '../register.js';
import { FormController } from './form-controller.js';
import { type FormValidationErrors } from './form-validation-errors.js';

class TestComponent extends LitElement {
  @query('sl-form-validation-errors') errors!: FormValidationErrors;

  form = new FormController(this);

  override render(): TemplateResult {
    return html`
      <sl-form>
        <sl-form-validation-errors .controller=${this.form}></sl-form-validation-errors>
        <sl-text-field name="foo" aria-label="Foo"></sl-text-field>
      </sl-form>
    `;
  }
}

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
    let el: TestComponent;

    beforeEach(async () => {
      try {
        customElements.define('test-component', TestComponent);
      } catch {
        /* empty */
      }

      el = await fixture(html`<test-component></test-component>`);
    });

    it('should not be displayed', () => {
      expect(el.errors).to.exist;

      // FIXME: expect(el.errors).not.to.be.displayed; does not work
      expect(getComputedStyle(el.errors).display).to.equal('none');
    });
  });
});
