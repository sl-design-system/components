import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import { html } from 'lit';
import '../register.js';
import { ToggleGroup } from './toggle-group.js';

describe('sl-toggle-group', () => {
  let el: ToggleGroup;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-group>
          <sl-toggle-button>
            <sl-icon name="check" slot="default"></sl-icon>
            <sl-icon name="check-solid" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button>
            <sl-icon name="check" slot="default"></sl-icon>
            <sl-icon name="check-solid" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button>
            <sl-icon name="check" slot="default"></sl-icon>
            <sl-icon name="check-solid" slot="pressed"></sl-icon>
          </sl-toggle-button>
        </sl-toggle-group>
      `);
    });

    it('should not support multiple pressed buttons at the same time', () => {
      expect(el.multiple).not.to.be.true;
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

    it('should not have a size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should propagate disabled to the buttons', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-toggle-button'));

      el.disabled = true;
      await el.updateComplete;

      expect(buttons.every(b => b.disabled)).to.be.true;
    });

    it('should have a size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should propagate size to the buttons', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-toggle-button'));

      el.size = 'lg';
      await el.updateComplete;

      expect(buttons.map(b => b.size)).to.deep.equal(['lg', 'lg', 'lg']);
    });

    it('should only allow one button to be pressed at a time', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-toggle-button'));

      buttons[0].click();
      await el.updateComplete;

      expect(buttons[0].pressed).to.be.true;
      expect(buttons[1].pressed).to.be.false;
      expect(buttons[2].pressed).to.be.false;

      buttons[1].click();
      await el.updateComplete;

      expect(buttons[0].pressed).to.be.false;
      expect(buttons[1].pressed).to.be.true;
      expect(buttons[2].pressed).to.be.false;
    });
  });

  describe('multiple', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-group multiple>
          <sl-toggle-button>
            <sl-icon name="check" slot="default"></sl-icon>
            <sl-icon name="check-solid" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button>
            <sl-icon name="check" slot="default"></sl-icon>
            <sl-icon name="check-solid" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button>
            <sl-icon name="check" slot="default"></sl-icon>
            <sl-icon name="check-solid" slot="pressed"></sl-icon>
          </sl-toggle-button>
        </sl-toggle-group>
      `);
    });

    it('should be set to multiple', () => {
      expect(el.multiple).to.be.true;
    });

    it('should allow multiple buttons to be pressed at the same time', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-toggle-button'));

      buttons[0].click();
      await el.updateComplete;

      expect(buttons[0].pressed).to.be.true;
      expect(buttons[1].pressed).to.be.false;
      expect(buttons[2].pressed).to.be.false;

      buttons[1].click();
      await el.updateComplete;

      expect(buttons[0].pressed).to.be.true;
      expect(buttons[1].pressed).to.be.true;
      expect(buttons[2].pressed).to.be.false;
    });
  });
});
