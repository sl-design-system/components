import { type Form } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { type TextField } from '@sl-design-system/text-field';
import '@sl-design-system/text-field/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import { ChildForm } from './child-form.js';

if (!customElements.get('example-child-form-test')) {
  customElements.define('example-child-form-test', ChildForm);
}

async function waitForControls(form: Form, names: string[]): Promise<void> {
  for (
    let i = 0;
    i < 10 && !names.every(name => form.controls.some(control => control.name === name));
    i++
  ) {
    await new Promise(requestAnimationFrame);
  }

  expect(form.controls.map(control => control.name)).to.include.members(names);
}

async function waitForFieldValue(field: TextField | null, value: string): Promise<void> {
  for (let i = 0; i < 10 && field?.value !== value; i++) {
    await new Promise(requestAnimationFrame);
  }

  expect(field?.value).to.equal(value);
}

describe('example-child-form', () => {
  it('should set child form values from the parent form value', async () => {
    const form = await fixture<Form>(html`
      <sl-form>
        <sl-form-field label="First name">
          <sl-text-field name="user.firstName" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Last name">
          <sl-text-field name="user.lastName" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Address">
          <example-child-form-test name="user.address" required></example-child-form-test>
        </sl-form-field>
      </sl-form>
    `);

    await waitForControls(form, ['user.firstName', 'user.lastName', 'user.address']);
    const childForm = form.querySelector<ChildForm>('example-child-form-test')!;
    await childForm.updateComplete;

    const addressForm = childForm.renderRoot.querySelector<Form>('sl-form')!;
    await waitForControls(addressForm, ['postalCode', 'houseNumber', 'street', 'city']);
    await addressForm.updateComplete;
    await new Promise(requestAnimationFrame);

    form.value = {
      user: {
        firstName: 'Captain',
        lastName: 'Debug',
        address: {
          postalCode: '404OK',
          houseNumber: '42',
          street: 'Breakpoint Boulevard',
          city: 'Stacktrace City'
        }
      }
    };
    await form.updateComplete;
    await childForm.updateComplete;
    await new Promise(requestAnimationFrame);
    await addressForm.updateComplete;

    const parentTextField = (name: string): TextField | null =>
        form.querySelector<TextField>(`sl-text-field[name="${name}"]`),
      childTextField = (name: string): TextField | null =>
        childForm.renderRoot.querySelector<TextField>(`sl-text-field[name="${name}"]`);

    await waitForFieldValue(parentTextField('user.firstName'), 'Captain');
    await waitForFieldValue(parentTextField('user.lastName'), 'Debug');
    await waitForFieldValue(childTextField('postalCode'), '404OK');
    await waitForFieldValue(childTextField('houseNumber'), '42');
    await waitForFieldValue(childTextField('street'), 'Breakpoint Boulevard');
    await waitForFieldValue(childTextField('city'), 'Stacktrace City');
  });
});
