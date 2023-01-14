import type { Input } from '../input/index.js';
import type { Label } from './label.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../input/register.js';
import './register.js';

describe('sl-label', () => {
  let el: HTMLElement, slLabel: Label, slInput: Input;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <form>
          <sl-label for="input">My label</sl-label>
          <sl-input id="input"></sl-input>
        </form>
      `);

      slLabel = el.querySelector('sl-label') as Label;
      slInput = el.querySelector('sl-input') as Input;
    });

    it('should render the label in the light DOM', () => {
      const label = el.querySelector('label');
      
      expect(label).to.have.text('My label');
    });
    
    it('should link the label to the form control', () => {
      const input = el.querySelector('input'),
        label = el.querySelector('label');

      expect(input?.id).to.match(/sl-input-\d+/);
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
      expect(slLabel.required).to.be.false;
      expect(slLabel.renderRoot.querySelector('.required')).to.be.null;
    });
  });

  describe('slotted label', () => {

  });

  describe('optional label', () => {

  });

  describe('required label', () => {

  });
});
