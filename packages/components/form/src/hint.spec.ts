import { html } from 'lit';
import { Hint } from './hint.js';
import { expect, fixture } from '@open-wc/testing';
import '../register.js';

describe('sl-hint', () => {
  let el: Hint;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-hint>My hint</sl-hint>`);
    });

    it('should have a default size of md', () => {
      expect(el).to.have.attribute('size', 'md');
    });

    it('should not have an error slot', () => {
      expect(el).not.to.have.attribute('slot', 'hint');
    });

    it('should have an error-text slot in the light DOM', () => {
      expect(el.firstElementChild).to.be.an.instanceof(HTMLSlotElement);
      expect(el.firstElementChild).to.have.attribute('name', 'hint-text');
    });
  });

  describe('in a form field', () => {
    beforeEach(async () => {
      const field = await fixture(html`
        <sl-form-field>
          <sl-hint>My hint</sl-hint>
        </sl-form-field>
      `);

      el = field.querySelector('sl-hint')!;
    });

    it('should have an error slot', () => {
      expect(el).to.have.attribute('slot', 'hint');
    });
  });
});
