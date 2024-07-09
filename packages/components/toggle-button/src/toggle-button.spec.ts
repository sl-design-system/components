import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/icon/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type ToggleButton } from './toggle-button.js';

describe('sl-toggle-button', () => {
  let el: ToggleButton;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-button>
          <sl-icon name="far-gear"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
    });

    it('should have a button role', () => {
      expect(el.role).to.equal('button');
    });

    it('should have a tabindex', () => {
      expect(el).to.have.attribute('tabindex', '0');
    });

    it('should allow for a custom tabindex', async () => {
      el.tabIndex = 10;
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '10');
    });

    it('should remember the tabindex when being enabled', async () => {
      el.tabIndex = 10;
      await el.updateComplete;

      el.setAttribute('disabled', '');
      await el.updateComplete;

      el.removeAttribute('disabled');
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '10');
    });

    it('should be size medium', () => {
      expect(el).to.have.attribute('size', 'md');
    });

    it('should be small size when set', async () => {
      el.size = 'sm';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'sm');
    });

    it('should be large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should have a default fill', () => {
      expect(el).to.have.attribute('fill', 'ghost');
    });

    it('should not be pressed by default', () => {
      expect(el.pressed).not.to.have.true;
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el).not.to.match(':disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should toggle the state on click', () => {
      const clickEvent = new Event('click');
      const onToggle = spy();
      expect(el).not.to.have.attribute('pressed');

      el.addEventListener('sl-toggle', onToggle);

      el.dispatchEvent(clickEvent);

      expect(onToggle).to.have.been.calledOnce;
    });

    it('should toggle the pressed state when pressing the enter key', async () => {
      const onToggle = spy();
      expect(el).not.to.have.attribute('pressed');

      el.addEventListener('sl-toggle', onToggle);
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(onToggle).to.have.been.calledOnce;
      expect(el).to.have.attribute('pressed');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-toggle-button disabled>
          <sl-icon name="far-gear"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>`
      );
    });

    it('should have the :disabled pseudo class', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.match(':disabled');
    });

    it('should not emit a click event when the toggle-button is disabled', async () => {
      const clickEvent = new Event('click');
      const onToggle = spy();
      expect(el).not.to.have.attribute('pressed');

      el.addEventListener('sl-toggle', onToggle);

      el.dispatchEvent(clickEvent);
      await el.updateComplete;

      expect(onToggle).not.to.have.been.calledOnce;
    });
  });

  describe('pressed', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-button pressed>
          <sl-icon name="far-gear"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
    });

    it('should not be pressed by default', () => {
      expect(el.pressed).to.be.true;
    });
  });
});
