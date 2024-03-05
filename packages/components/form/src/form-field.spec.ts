import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/text-field/register.js';
import { html } from 'lit';
import '../register.js';
import { FormField } from './form-field.js';

describe('sl-form-field', () => {
  let el: FormField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-form-field hint="Hint" label="My label">
          <sl-text-field></sl-text-field>
        </sl-form-field>
      `);
    });

    it('should render the label in the light DOM', () => {
      const label = el.querySelector('sl-label');

      expect(label).to.have.text('My label');
    });

    it('should slot the label in the label slot', () => {
      const label = el.querySelector('sl-label');

      expect(label).to.have.attribute('slot', 'label');
      expect(label?.assignedSlot?.name).to.equal('label');
    });

    it('should render the hint in the light DOM', () => {
      const hint = el.querySelector('sl-hint');

      expect(hint).to.have.text('Hint');
    });

    it('should slot the hint in the hint slot', () => {
      const hint = el.querySelector('sl-hint');

      expect(hint).to.have.attribute('slot', 'hint');
      expect(hint?.assignedSlot?.name).to.equal('hint');
    });

    it('should link the hint to the form control', () => {
      const input = el.querySelector('input');

      expect(el.querySelector('sl-hint')?.id).to.equal(input?.getAttribute('aria-describedby'));
    });

    it('should link the label to the form control', () => {
      const input = el.querySelector('input');

      expect(el.querySelector('label')?.htmlFor).to.equal(input?.id);
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-form-field>
          <sl-text-field required></sl-text-field>
        </sl-form-field>
      `);
    });

    it('should not show validation by default', () => {
      expect(el.querySelector('sl-error')).not.to.exist;
    });

    it('should show validation after calling reportValidity', async () => {
      el.querySelector('sl-text-field')?.reportValidity();
      await el.updateComplete;

      expect(el.querySelector('sl-error')).to.have.text('Please fill in this field.');
    });

    it('should not show validation after calling setCustomValidity', async () => {
      el.querySelector('sl-text-field')?.setCustomValidity('Custom error');
      await el.updateComplete;

      expect(el.querySelector('sl-error')).not.to.exist;
    });

    it('should not show validation after calling setCustomValidity with a promise', async () => {
      el.querySelector('sl-text-field')?.setCustomValidity(Promise.resolve('Custom error'));
      await new Promise(resolve => setTimeout(resolve));

      expect(el.querySelector('sl-error')).not.to.exist;
    });

    it('should show custom validation after calling reportValidity', async () => {
      el.querySelector('sl-text-field')?.setCustomValidity('Custom error');
      el.querySelector('sl-text-field')?.reportValidity();
      await el.updateComplete;

      expect(el.querySelector('sl-error')).to.have.text('Custom error');
    });

    it('should show the builtin validation after resetting the custom validity', async () => {
      const textField = el.querySelector('sl-text-field');

      textField?.setCustomValidity('Custom error');
      textField?.reportValidity();
      await el.updateComplete;

      expect(el.querySelector('sl-error')).to.have.text('Custom error');

      textField?.setCustomValidity('');
      await el.updateComplete;

      expect(el.querySelector('sl-error')).to.have.text('Please fill in this field.');
    });
  });
});
