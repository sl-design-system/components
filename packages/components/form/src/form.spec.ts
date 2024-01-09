import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/text-field/register.js';
import { html } from 'lit';
import '../register.js';
import { Form } from './form.js';

describe('sl-form', () => {
  let el: Form;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-form>
        <sl-form-field>
          <sl-text-field></sl-text-field>
        </sl-form-field>
      </sl-form>
    `);
  });

  it('should register the form fields', () => {
    expect(el.fields).to.have.length(1);
    expect(el.fields[0]).to.equal(el.querySelector('sl-form-field'));
  });

  it('should automatically register new form fields', async () => {
    const field = document.createElement('sl-form-field'),
      textField = document.createElement('sl-text-field');
    field.appendChild(textField);
    el.appendChild(field);

    await el.updateComplete;

    expect(el.fields).to.have.length(2);
    expect(el.fields[1]).to.equal(field);
  });

  it('should automatically unregister removed form fields', async () => {
    el.querySelector('sl-form-field')?.remove();
    await el.updateComplete;

    expect(el.fields).to.have.length(0);
  });
});
