import type { TextInput } from '@sl-design-system/text-input';
import type { Label } from './label.js';
import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-input/register.js';
import { html } from 'lit';
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
      const input = el.querySelector('input');

      expect(el.querySelector('label')?.htmlFor).to.equal(input!.id);
    });

    it('should unlink the label when the for property is reset', async () => {
      slLabel.for = undefined;
      await slLabel.updateComplete;

      expect(el.querySelector('label')?.htmlFor).to.equal('')
    });

    it('should not mark the label as optional', () => {
      expect(slLabel.optional).to.be.false;
      expect(slLabel.renderRoot.querySelector('.optional')).not.to.exist;
    });

    it('should not mark the label as required', async () => {
      slInput.required = true;
      await slInput.updateComplete;

      expect(slLabel.required).to.be.false;
      expect(slLabel.renderRoot.querySelector('.required')).not.to.exist;
    });

    it('should have a medium size', () => {
      expect(slLabel).to.have.attribute('size', 'md');
    });

    it('should not be disabled', () => {
      expect(slLabel.disabled).to.be.false;
      expect(slLabel).not.to.have.attribute('disabled');
    });

    it('should be disabled when the form control is disabled', async () => {
      slInput.disabled = true;
      await slInput.updateComplete;

      // This is for the mutation observer callback updating the disabled property
      await slLabel.updateComplete;

      // This is for the disabled property changing the attribute
      await slLabel.updateComplete;

      expect(slLabel.disabled).to.be.true;
      expect(slLabel).to.have.attribute('disabled');
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
      const slLabel = el.querySelector('sl-label') as Label,
        optional = slLabel.renderRoot.querySelector('.optional');

      expect(optional).to.exist;
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
      const label = el.querySelector('sl-label') as Label,
        required = label.renderRoot.querySelector('.required');

      expect(required).to.exist;
      expect(required).to.have.text('(required)');
    });

    it('should not mark the optional labels', () => {
      el.querySelectorAll<Label>('sl-label:not(:first-of-type)').forEach((label: Label) => {
        const requiredOrOptional = label.renderRoot.querySelector('.required, .optional');

        expect(requiredOrOptional).to.be.null;
      });
    });
  });

  describe('size', () => {
    it('should adopt the size of the switch', async () => {
      el = await fixture(html`
        <form>
          <sl-label for="switch">Label</sl-label>
          <sl-switch id="switch" size="sm">Toggle me</sl-switch>
        </form>
      `);

      expect(el.querySelector('sl-label')).to.have.attribute('size', 'sm');
    });

    it('should adopt the size of the text input', async () => {
      el = await fixture(html`
        <form>
          <sl-label for="input">Label</sl-label>
          <sl-text-input id="input"></sl-text-input>
        </form>
      `);

      expect(el.querySelector('sl-label')).to.have.attribute('size', 'md');
    });

    it('should adopt the size of the checkbox group', async () => {
      el = await fixture(html`
        <form>
          <sl-label for="group">Label</sl-label>
          <sl-checkbox-group id="group" size="lg">
            <sl-checkbox>Checkbox 1</sl-checkbox>
            <sl-checkbox>Checkbox 2</sl-checkbox>
            <sl-checkbox>Checkbox 3</sl-checkbox>
          </sl-checkbox-group>
        </form>
      `);

      expect(el.querySelector('sl-label')).to.have.attribute('size', 'lg');
    });

    it('should only adopt supported sizes', async () => {
      el = await fixture(html`
        <form>
          <sl-label for="input">Label</sl-label>
          <sl-text-input id="input" size="asdf"></sl-text-input>
        </form>
      `);

      expect(el.querySelector('sl-label')).to.have.attribute('size', 'md');
    });
  });
});
