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

      // Give the form time to register the controls
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should register the form controls', () => {
      expect(el.controls).to.have.length(2);
      expect(el.controls[0]).to.equal(el.querySelector('sl-text-field[name="foo"]'));
      expect(el.controls[1]).to.equal(el.querySelector('sl-text-field[name="bar"]'));
    });

    it('should automatically register new form controls', async () => {
      const field = document.createElement('sl-form-field'),
        textField = document.createElement('sl-text-field');
      field.appendChild(textField);
      el.appendChild(field);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.controls).to.have.length(3);
      expect(el.controls[2]).to.equal(textField);
    });

    it('should automatically unregister removed form controls', async () => {
      el.querySelector('sl-form-field')?.remove();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.controls).to.have.length(1);
      expect(el.controls[0]).to.equal(el.querySelector('sl-text-field[name="bar"]'));
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

    it('should be valid if all controls are valid', async () => {
      expect(el.valid).to.be.false;

      el.querySelector<HTMLElement>('sl-text-field[name="bar"]')?.focus();
      await sendKeys({ type: 'asdf' });

      expect(el.valid).to.be.true;
    });

    it('should report validity of all form controls', () => {
      const controls = el.querySelectorAll('sl-text-field');

      controls.forEach(c => spy(c, 'reportValidity'));

      expect(el.reportValidity()).to.be.false;
      expect(controls[0].reportValidity).to.have.been.calledOnce;
      expect(controls[1].reportValidity).to.have.been.calledOnce;
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

    it('should have a value', () => {
      expect(el.value).to.deep.equal({ foo: 'lorem', bar: '' });
    });

    it('should update the value when a field changes', async () => {
      el.querySelector<HTMLElement>('sl-text-field[name="bar"]')?.focus();
      await sendKeys({ type: 'asdf' });

      expect(el.value).to.deep.equal({ foo: 'lorem', bar: 'asdf' });
    });

    it('should be pristine', () => {
      expect(el.dirty).to.be.false;
      expect(el.pristine).to.be.true;
    });

    it('should be dirty after modifying a field', async () => {
      el.querySelector<HTMLElement>('sl-text-field[name="foo"]')?.focus();
      await sendKeys({ type: 'asdf' });

      expect(el.dirty).to.be.true;
      expect(el.pristine).to.be.false;
    });

    it('should be invalid', () => {
      expect(el.invalid).to.be.true;
      expect(el.valid).to.be.false;
    });

    it('should be valid after modifying a field', async () => {
      el.querySelector<HTMLElement>('sl-text-field[name="bar"]')?.focus();
      await sendKeys({ type: 'asdf' });

      expect(el.invalid).to.be.false;
      expect(el.valid).to.be.true;
    });

    it('should be untouched', () => {
      expect(el.touched).to.be.false;
      expect(el.untouched).to.be.true;
    });

    it('should be touched after focusing a field', () => {
      const input = el.querySelector<HTMLElement>('sl-text-field[name="bar"] input');

      input?.focus();
      input?.blur();

      expect(el.touched).to.be.true;
      expect(el.untouched).to.be.false;
    });

    it('should emit an sl-submit event when requestSubmit() is called and the form is valid', async () => {
      const onSubmit = spy();

      el.addEventListener('sl-submit', onSubmit);
      el.requestSubmit();

      expect(onSubmit).to.not.have.been.calledOnce;

      el.querySelector<HTMLElement>('sl-text-field[name="bar"]')?.focus();
      await sendKeys({ type: 'asdf' });

      el.requestSubmit();

      expect(onSubmit).to.have.been.calledOnce;
    });
  });

  describe('reset', () => {
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
      // Give the form time to register the controls
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should reset the form', async () => {
      expect(el.value).to.deep.equal({ foo: 'lorem', bar: '' });
      el.querySelector<HTMLElement>('sl-text-field[name="foo"]')?.focus();
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });
      await sendKeys({ press: 'Backspace' });

      el.querySelector<HTMLElement>('sl-text-field[name="bar"]')?.focus();
      await sendKeys({ type: 'asdf' });

      expect(el.value).to.deep.equal({ foo: '', bar: 'asdf' });

      el.reset();

      expect(el.value).to.deep.equal({ foo: 'lorem', bar: '' });
    });

    it('should emit an sl-reset event when reset() is called', () => {
      const onReset = spy();

      el.addEventListener('sl-reset', onReset);
      el.reset();

      expect(onReset).to.have.been.calledOnce;
    });
  });

  describe('array values', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-form>
          <sl-form-field label="Items">
            <sl-text-field name="items[0]" value="Lorem"></sl-text-field>
            <sl-text-field name="items[1]" value="Ipsum"></sl-text-field>
            <sl-text-field name="items[2]" value="Dolar"></sl-text-field>
          </sl-form-field>
        </sl-form>
      `);

      // Give the form time to register the controls
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have an array value', () => {
      expect(el.value).to.deep.equal({ items: ['Lorem', 'Ipsum', 'Dolar'] });
    });

    it('should update the value when a control is added', async () => {
      const textField = document.createElement('sl-text-field');
      textField.name = 'items[3]';
      textField.value = 'Sit';

      el.querySelector('sl-form-field')?.appendChild(textField);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.value).to.deep.equal({ items: ['Lorem', 'Ipsum', 'Dolar', 'Sit'] });
    });

    it('should update the value when a control is removed', async () => {
      el.querySelector('sl-text-field[name="items[2]"]')?.remove();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.value).to.deep.equal({ items: ['Lorem', 'Ipsum'] });
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
