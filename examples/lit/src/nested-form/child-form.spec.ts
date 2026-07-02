import { type Form } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { type TextField } from '@sl-design-system/text-field';
import '@sl-design-system/text-field/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import { ChildForm } from './child-form.js';

try {
  customElements.define('example-child-form-test', ChildForm);
} catch {
  /* empty */
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

    await new Promise(resolve => setTimeout(resolve, 50));

    form.value = {
      user: {
        firstName: 'Frans',
        lastName: 'de Boer',
        address: {
          postalCode: '8989AA',
          houseNumber: '17',
          street: 'Wiardaplantage',
          city: 'Leeuwarden'
        }
      }
    };

    const childForm = form.querySelector<ChildForm>('example-child-form-test')!;
    await childForm.updateComplete;
    await childForm.renderRoot.querySelector<Form>('sl-form')!.updateComplete;

    const parentTextField = (name: string): TextField | null =>
        form.querySelector(`sl-text-field[name="${name}"]`),
      childTextField = (name: string): TextField | null =>
        childForm.renderRoot.querySelector(`sl-text-field[name="${name}"]`);

    expect(parentTextField('user.firstName')?.value).to.equal('Frans');
    expect(parentTextField('user.lastName')?.value).to.equal('de Boer');
    expect(childTextField('postalCode')?.value).to.equal('8989AA');
    expect(childTextField('houseNumber')?.value).to.equal('17');
    expect(childTextField('street')?.value).to.equal('Wiardaplantage');
    expect(childTextField('city')?.value).to.equal('Leeuwarden');
  });
});
