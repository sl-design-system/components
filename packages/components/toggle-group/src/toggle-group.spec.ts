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

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should not have a size by default', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should propagate disabled to the buttons', async () => {
      const buttons = Array.from(el.querySelectorAll('sl-toggle-button'));

      el.disabled = true;
      await el.updateComplete;

      expect(buttons.every(b => b.disabled)).to.be.true;
    });

    it('should set fill to ghost for all the buttons', () => {
      const buttons = Array.from(el.querySelectorAll('sl-toggle-button'));

      expect(buttons.map(b => b.fill)).to.deep.equal(['ghost', 'ghost', 'ghost']);
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
  });

  describe('text only', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-button-group>
          <sl-toggle-button>Lorem</sl-toggle-button>
          <sl-toggle-button>Ipsum</sl-toggle-button>
          <sl-toggle-button>Dolar</sl-toggle-button>
        </sl-button-group>
      `);
    });
  });
});
