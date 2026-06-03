import '@sl-design-system/icon/register.js';
import '@sl-design-system/toggle-button/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
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

      await userEvent.click(buttons[0]);
      await el.updateComplete;

      expect(buttons[0]).to.match(':state(pressed)');
      expect(buttons[1]).not.to.match(':state(pressed)');
      expect(buttons[2]).not.to.match(':state(pressed)');

      await userEvent.click(buttons[1]);
      await el.updateComplete;

      expect(buttons[0]).not.to.match(':state(pressed)');
      expect(buttons[1]).to.match(':state(pressed)');
      expect(buttons[2]).not.to.match(':state(pressed)');
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

      await userEvent.click(buttons[0]);
      await el.updateComplete;

      expect(buttons[0]).to.match(':state(pressed)');
      expect(buttons[1]).not.to.match(':state(pressed)');
      expect(buttons[2]).not.to.match(':state(pressed)');

      await userEvent.click(buttons[1]);
      await el.updateComplete;

      expect(buttons[0]).to.match(':state(pressed)');
      expect(buttons[1]).to.match(':state(pressed)');
      expect(buttons[2]).not.to.match(':state(pressed)');
    });
  });
});
