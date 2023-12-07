import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/text-field/register.js';
import { html } from 'lit';
import '../register.js';

describe('sl-form-field', () => {
  let el: HTMLElement;

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
});
