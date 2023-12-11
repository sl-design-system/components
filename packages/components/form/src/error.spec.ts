import { html } from 'lit';
import { Error } from './error.js';
import { expect, fixture } from '@open-wc/testing';
import '../register.js';

describe('sl-error', () => {
  let el: Error;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-error>My error</sl-error>`);
    });

    it('should have a default size of md', () => {
      expect(el).to.have.attribute('size', 'md');
    });

    it('should not have an error slot', () => {
      expect(el).not.to.have.attribute('slot', 'error');
    });

    it('should have an error-text slot in the light DOM', () => {
      expect(el.firstElementChild).to.be.an.instanceof(HTMLSlotElement);
      expect(el.firstElementChild).to.have.attribute('name', 'error-text');
    });
  });

  describe('in a form field', () => {
    beforeEach(async () => {
      const field = await fixture(html`
        <sl-form-field>
          <sl-error>My error</sl-error>
        </sl-form-field>
      `);

      el = field.querySelector('sl-error')!;
    });

    it('should have an error slot', () => {
      expect(el).to.have.attribute('slot', 'error');
    });
  });
});
