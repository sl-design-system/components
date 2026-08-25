var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import '@sl-design-system/text-field/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { query } from 'lit/decorators.js';
import { spy, stub } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { FormController } from './form-controller.js';
describe('sl-form-validation-errors', () => {
  describe('defaults', () => {
    let el;
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
      constructor() {
        super(...arguments);
        this.form = new FormController(this);
      }
      render() {
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
    __decorateClass([query('sl-form-validation-errors')], TestComponent.prototype, 'errors', 2);
    let el;
    beforeEach(async () => {
      try {
        customElements.define('test-component', TestComponent);
      } catch {}
      el = await fixture(html`<test-component></test-component>`);
      await new Promise(resolve => setTimeout(resolve, 50));
      stub(el.form, 'invalid').get(() => true);
      stub(el.form, 'showValidity').get(() => true);
      await new Promise(resolve => setTimeout(resolve, 50));
      el.form.dispatchEvent(new Event('sl-update'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    it('should be displayed if invalid and validity is shown', () => {
      expect(el.errors).to.be.displayed;
    });
    it('should have a danger variant when invalid', () => {
      expect(el.errors.variant).to.equal('danger');
      expect(el.errors.renderRoot.querySelector('sl-inline-message')).to.have.attribute(
        'variant',
        'danger'
      );
    });
    it('should indicate that there are fields with errors', () => {
      const inlineMessage = el.errors.renderRoot.querySelector('sl-inline-message');
      expect(inlineMessage).to.contain.text('The following fields have errors:');
    });
    it('should link to the invalid controls', () => {
      const links = Array.from(el.errors.renderRoot.querySelectorAll('li a'));
      expect(links).to.have.length(2);
      expect(links.map(l => l.hash)).to.deep.equal([
        '#sl-form-field-control-6',
        '#sl-form-field-control-7'
      ]);
      expect(links.map(l => l.textContent?.trim())).to.deep.equal(['Foo', 'Bar']);
    });
    it('should focus the control when the link is clicked', () => {
      const textField = el.renderRoot.querySelector('sl-text-field'),
        focusSpy = spy(textField, 'focus');
      el.errors.renderRoot.querySelector('li a')?.click();
      expect(focusSpy).to.have.been.called;
    });
  });
  describe('with valid controls', () => {
    class TestComponent extends LitElement {
      constructor() {
        super(...arguments);
        this.form = new FormController(this);
      }
      render() {
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
    __decorateClass([query('sl-form-validation-errors')], TestComponent.prototype, 'errors', 2);
    let el;
    beforeEach(async () => {
      try {
        customElements.define('test-component', TestComponent);
      } catch {}
      el = await fixture(html`<test-component></test-component>`);
      el.errors.validity = 'invalid';
      await el.errors.updateComplete;
      stub(el.form, 'invalid').get(() => false);
      stub(el.form, 'showValidity').get(() => true);
      el.form.dispatchEvent(new Event('sl-update'));
      await new Promise(resolve => setTimeout(resolve, 50));
    });
    it('should be displayed if valid and validity is shown', () => {
      expect(el.errors).to.be.displayed;
    });
    it('should have a success variant when invalid', () => {
      expect(el.errors.variant).to.equal('success');
      expect(el.errors.renderRoot.querySelector('sl-inline-message')).to.have.attribute(
        'variant',
        'success'
      );
    });
    it('should indicate that all fields with valid', () => {
      const inlineMessage = el.errors.renderRoot.querySelector('sl-inline-message');
      expect(inlineMessage).to.contain.text('All fields are valid.');
    });
  });
});
//# sourceMappingURL=form-validation-errors.spec.js.map
