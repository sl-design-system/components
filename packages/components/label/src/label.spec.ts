import type { TextInput } from '@sl-design-system/text-input';
import type { Label } from './label.js';
import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/text-input/register.js';
import {html} from 'lit';
import '../register.js';

describe('sl-label', () => {
  let el: HTMLElement, slLabel: Label, slInput: TextInput;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <form>
          <sl-label for="input">My label</sl-label>
          <sl-text-input id="input"></sl-text-input>
        </form>
      `);

      slLabel = el.querySelector('sl-label') as Label;
      slInput = el.querySelector('sl-text-input') as TextInput;
    });

    it('should render the label in the light DOM', () => {
      const label = el.querySelector('label');

      expect(label).to.have.text('My label');
    });

    it('should link the label to the form control', () => {
      const input = el.querySelector('input'),
        label = el.querySelector('label');

      expect(input?.id).to.match(/sl-text-input-\d+/);
      expect(label).to.have.attribute('for', input?.id);
    });

    it('should unlink the label when the for property is reset', async () => {
      slLabel.for = undefined;
      await slLabel.updateComplete;

      const label = el.querySelector('label');
      expect(label).not.to.have.attribute('for');
    });

    it('should not mark the label as optional', async () => {
      expect(slLabel.optional).to.be.false;
      expect(slLabel.renderRoot.querySelector('.optional')).to.be.null;
    });

    it('should not mark the label as required', async () => {
      slInput.required = true;
      await slInput.updateComplete;

      expect(slLabel.required).to.be.false;
      expect(slLabel.renderRoot.querySelector('.required')).to.be.null;
    });

    it('should have a label of medium size by default', () => {
      expect(slLabel).to.have.attribute('size', 'md');
    });

    it('should have a label of small size when set', () => {
      slLabel.setAttribute('size', 'sm');

      expect(slLabel).to.have.attribute('size', 'sm');
    });

    it('should not be disabled by default', () => {
      expect(slLabel).not.to.have.attribute('disabled');
      expect(slLabel).not.to.match(':disabled');
    });

    it('should not have no-padding by default', () => {
      expect(slLabel).not.to.have.attribute('no-padding');
    });

    it('should have no-padding when set', () => {
      slLabel.setAttribute('no-padding', '');
      expect(slLabel).to.have.attribute('no-padding');
    });
  });

  describe('slotted label', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <form>
          <sl-label for="input">
            <label slot="label">Slotted label</label>
          </sl-label>
          <sl-text-input id="input"></sl-text-input>
        </form>
      `);

      slLabel = el.querySelector('sl-label') as Label;
      slInput = el.querySelector('sl-text-input') as TextInput;
    });

    it('should use the slotted label', () => {
      const label = slLabel.querySelector('label');

      expect(label).to.have.trimmed.text('Slotted label');
    });

    it('should link the label to the input', () => {
      const label = slLabel.querySelector('label');

      expect(label?.htmlFor).to.match(/sl-text-input-\d+/);
    });
  });

  describe('optional label', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <form>
          <sl-label for="input">My label</sl-label>
          <sl-text-input id="input"></sl-text-input>

          <sl-label for="input2">Input 2</sl-label>
          <sl-text-input id="input2" required></sl-text-input>

          <sl-label for="input3">Input 3</sl-label>
          <sl-text-input id="input3" required></sl-text-input>
        </form>
      `);
    });

    it('should mark it as optional', async () => {
      const slLabel = el.querySelector('sl-label'),
        optional = slLabel?.renderRoot.querySelector('.optional');

      expect(optional).not.to.be.null;
      expect(optional).to.have.text('(optional)');
    });

    it('should not mark the required labels', () => {
      el.querySelectorAll<Label>('sl-label:not(:first-of-type)').forEach((label: Label) => {
        const requiredOrOptional = label.renderRoot.querySelector('.required, .optional');

        expect(requiredOrOptional).to.be.null;
      });
    });
  });


  describe('required label', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <form>
          <sl-label for="input">My label</sl-label>
          <sl-text-input id="input" required></sl-text-input>

          <sl-label for="input2">Input 2</sl-label>
          <sl-text-input id="input2"></sl-text-input>

          <sl-label for="input3">Input 3</sl-label>
          <sl-text-input id="input3"></sl-text-input>
        </form>
      `);
    });

    it('should mark it as required', () => {
      const label = el.querySelector('sl-label'),
        required = label?.renderRoot.querySelector('.required');

      expect(required).not.to.be.null;
      expect(required).to.have.text('(required)');
    });

    it('should not mark the optional labels', () => {
      el.querySelectorAll<Label>('sl-label:not(:first-of-type)').forEach((label: Label) => {
        const requiredOrOptional = label.renderRoot.querySelector('.required, .optional');

        expect(requiredOrOptional).to.be.null;
      });
    });
  });
});
