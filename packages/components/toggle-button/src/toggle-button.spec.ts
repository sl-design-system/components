import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/icon/register.js';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
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

    it('should be large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not be pressed by default', () => {
      expect(el.pressed).not.to.have.true;
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el).not.to.match(':disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should toggle the state on click', async () => {
      const clickEvent = new Event('click');
      const onToggle = spy();
      expect(el).not.to.have.attribute('pressed');

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      el.dispatchEvent(clickEvent);
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;
      expect(el).to.have.attribute('pressed');
      expect(el.pressed).to.be.true;
    });

    it('should toggle the pressed state when pressing the enter key', async () => {
      const onToggle = spy();
      expect(el).not.to.have.attribute('pressed');
      expect(el.pressed).to.be.false;

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;
      expect(el).to.have.attribute('pressed');
      expect(el.pressed).to.be.true;
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

    it('should have a true pressed state when the attribute it set ', () => {
      expect(el.pressed).to.be.true;
    });
  });
});
