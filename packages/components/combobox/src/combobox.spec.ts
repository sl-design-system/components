import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/listbox/register.js';
import { html } from 'lit';
import '../register.js';
import { type Combobox } from './combobox.js';

describe('sl-combobox', () => {
  let el: Combobox, input: HTMLInputElement, listbox: HTMLElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-combobox>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      `);
      input = el.querySelector<HTMLInputElement>('input[slot="input"]')!;
      listbox = el.querySelector('sl-listbox')!;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should autocomplete both the input and list', () => {
      expect(el.autocomplete).to.equal('both');
      expect(input).to.have.attribute('aria-autocomplete', 'both');
    });

    it('should not filter the results in the list', () => {
      expect(el.filterResults).not.to.be.true;
    });

    it('should not support multiple selection', () => {
      expect(el.multiple).not.to.be.true;
    });

    it('should not have a placeholder', () => {
      expect(el.placeholder).to.be.undefined;
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'Placeholder';
      await el.updateComplete;

      expect(el.placeholder).to.equal('Placeholder');
      expect(input).to.have.attribute('placeholder', 'Placeholder');
    });

    it('should not be readonly', () => {
      expect(el.readonly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
      expect(input).to.have.attribute('readonly');
    });

    it('should not be required', () => {
      expect(el.required).not.to.be.true;
      expect(el.internals.ariaRequired).not.to.equal('true');
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(el.internals.ariaRequired).to.equal('true');
    });

    describe('input', () => {
      it('should exist', () => {
        expect(input).to.exist;
      });

      it('should have a combobox role', () => {
        expect(input).to.have.attribute('role', 'combobox');
      });

      it('should have autocomplete off', () => {
        expect(input).to.have.attribute('autocomplete', 'off');
      });

      it('should have an aria-haspopup attribute', () => {
        expect(input).to.have.attribute('aria-haspopup', 'listbox');
      });

      it('should not be expanded', () => {
        expect(input).to.have.attribute('aria-expanded', 'false');
      });

      it('should be expanded when the list is visible', async () => {
        input.click();
        await el.updateComplete;

        expect(input).to.have.attribute('aria-expanded', 'true');
      });

      it('should link the input to the listbox', () => {
        expect(input).to.have.attribute('aria-controls', listbox.id);
      });
    });
  });
});
