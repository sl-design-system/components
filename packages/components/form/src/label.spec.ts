import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/switch/register.js';
import { type TextField } from '@sl-design-system/text-field';
import '@sl-design-system/text-field/register.js';
import { html } from 'lit';
import '../register.js';
import { type Form } from './form.js';
import { type Label } from './label.js';

describe('sl-label', () => {
  describe('defaults', () => {
    let el: Form, slLabel: Label, slInput: TextField;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-form>
          <sl-form-field>
            <sl-label for="input">My label</sl-label>
            <sl-text-field id="input"></sl-text-field>
          </sl-form-field>
        </sl-form>
      `);

      slLabel = el.querySelector('sl-label') as Label;
      slInput = el.querySelector('sl-text-field') as TextField;
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

      expect(el.querySelector('label')?.htmlFor).to.equal('');
    });

    it('should not mark the label', () => {
      expect(slLabel.mark).to.equal('required');
      expect(slLabel.renderRoot.querySelector('.optional')).not.to.exist;
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
    let el: Label;

    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-label for="input">
            <label slot="label">Slotted label</label>
          </sl-label>
          <sl-text-field id="input"></sl-text-field>
        </div>
      `);
    });

    it('should use the slotted label', () => {
      const label = el.querySelector('label');

      expect(label).to.have.trimmed.text('Slotted label');
    });

    it('should link the label to the input', () => {
      const label = el.querySelector('label');

      expect(label?.htmlFor).to.match(/sl-text-field-\d+/);
    });
  });

  describe('size', () => {
    let el: HTMLElement;

    it('should adopt the size of the switch', async () => {
      el = await fixture(html`
        <form>
          <sl-label for="switch">Label</sl-label>
          <sl-switch id="switch" size="sm">Toggle me</sl-switch>
        </form>
      `);

      expect(el.querySelector('sl-label')).to.have.attribute('size', 'sm');
    });

    it('should adopt the size of the text field', async () => {
      el = await fixture(html`
        <form>
          <sl-label for="text">Label</sl-label>
          <sl-text-field id="text"></sl-text-field>
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
          <sl-text-field id="input" size="asdf"></sl-text-field>
        </form>
      `);

      expect(el.querySelector('sl-label')).to.have.attribute('size', 'md');
    });
  });

  describe('optional', () => {
    let el: Label;

    beforeEach(async () => {
      el = await fixture(html`<sl-label mark="optional">My label</sl-label>`);
    });

    it('should mark the label', () => {
      expect(el.renderRoot.querySelector('.optional')).to.have.trimmed.text('(optional)');
      expect(el.renderRoot.querySelector('.required')).not.to.exist;
    });

    it('should not mark the label if the control is required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.optional')).not.to.exist;
      expect(el.renderRoot.querySelector('.required')).not.to.exist;
    });
  });

  describe('required', () => {
    let el: Label;

    beforeEach(async () => {
      el = await fixture(html`<sl-label mark="required">My label</sl-label>`);
    });

    it('should not mark the label', () => {
      expect(el.renderRoot.querySelector('.optional')).not.to.exist;
      expect(el.renderRoot.querySelector('.required')).not.to.exist;
    });

    it('should mark the label if the control is required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.optional')).not.to.exist;
      expect(el.renderRoot.querySelector('.required')).to.have.trimmed.text('(required)');
    });
  });
});
