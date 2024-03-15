import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/text-field/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { Form } from './form.js';
import { type Label } from './label.js';

describe('sl-form', () => {
  let el: Form;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-form>
          <sl-form-field label="Foo">
            <sl-text-field name="foo" value="lorem"></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Bar">
            <sl-text-field name="bar" required></sl-text-field>
          </sl-form-field>
        </sl-form>
      `);
    });

    it('should register the form fields', () => {
      expect(el.fields).to.have.length(2);
      expect(el.fields[0]).to.equal(el.querySelector('sl-form-field[label="Foo"]'));
      expect(el.fields[1]).to.equal(el.querySelector('sl-form-field[label="Bar"]'));
    });

    it('should automatically register new form fields', async () => {
      const field = document.createElement('sl-form-field'),
        textField = document.createElement('sl-text-field');
      field.appendChild(textField);
      el.appendChild(field);

      await el.updateComplete;

      expect(el.fields).to.have.length(3);
      expect(el.fields[2]).to.equal(field);
    });

    it('should automatically unregister removed form fields', async () => {
      el.querySelector('sl-form-field')?.remove();
      await el.updateComplete;

      expect(el.fields).to.have.length(1);
      expect(el.fields[0]).to.equal(el.querySelector('sl-form-field[label="Bar"]'));
    });

    it('should be valid if all fields are valid', async () => {
      expect(el.valid).to.be.false;

      el.querySelector<HTMLElement>('sl-text-field[name="bar"]')?.focus();
      await sendKeys({ type: 'asdf' });

      expect(el.valid).to.be.true;
    });

    it('should report validity of all form fields', () => {
      const fields = el.querySelectorAll('sl-text-field');

      fields.forEach(f => spy(f, 'reportValidity'));

      expect(el.reportValidity()).to.be.false;
      expect(fields[0].reportValidity).to.have.been.calledOnce;
      expect(fields[1].reportValidity).to.have.been.calledOnce;
    });

    it('should have a value for the form', async () => {
      expect(el.value).to.deep.equal({ foo: 'lorem', bar: '' });

      el.querySelector<HTMLElement>('sl-text-field[name="bar"]')?.focus();
      await sendKeys({ type: 'asdf' });

      expect(el.value).to.deep.equal({ foo: 'lorem', bar: 'asdf' });
    });

    it('should mark required fields', () => {
      const allRequired = Array.from(el.querySelectorAll('sl-form-field')).every(field => field.mark === 'required');

      expect(allRequired).to.be.true;
    });

    it('should highlight required fields in the label', () => {
      const labels = Array.from(el.querySelectorAll<Label>('sl-label')).map(label =>
        label.shadowRoot?.textContent?.trim()
      );

      expect(labels).to.eql(['', '(required)']);
    });
  });

  describe('mark optional fields', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-form>
          <sl-form-field label="Foo">
            <sl-text-field name="foo" value="lorem"></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Bar">
            <sl-text-field name="bar" required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Baz">
            <sl-text-field name="baz" required></sl-text-field>
          </sl-form-field>
        </sl-form>
      `);
    });

    it('should mark optional fields', () => {
      const allOptional = Array.from(el.querySelectorAll('sl-form-field')).every(field => field.mark === 'optional');

      expect(allOptional).to.be.true;
    });

    it('should highlight optional fields in the label', () => {
      const labels = Array.from(el.querySelectorAll<Label>('sl-label')).map(label =>
        label.shadowRoot?.textContent?.trim()
      );

      expect(labels).to.eql(['(optional)', '', '']);
    });
  });
});
