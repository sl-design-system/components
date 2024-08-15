import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/icon/register.js';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy, stub } from 'sinon';
import '../register.js';
import { type ToggleButton } from './toggle-button.js';

describe('sl-toggle-button', () => {
  let el: ToggleButton;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-button>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
    });

    it('should have a button role', () => {
      expect(el.role).to.equal('button');
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should be large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not be pressed', () => {
      expect(el).to.have.attribute('aria-pressed', 'false');
      expect(el).not.to.have.attribute('pressed');
      expect(el.pressed).to.be.false;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el).not.to.match(':disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be marked as icon only', () => {
      expect(el).to.have.attribute('icon-only');
    });

    it('should toggle the pressed state when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'true');
      expect(el).to.have.attribute('pressed');
      expect(el.pressed).to.be.true;

      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'false');
      expect(el).not.to.have.attribute('pressed');
      expect(el.pressed).to.be.false;
    });

    it('should toggle the pressed state when pressing enter', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'true');
      expect(el).to.have.attribute('pressed');
      expect(el.pressed).to.be.true;

      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'false');
      expect(el).not.to.have.attribute('pressed');
      expect(el.pressed).to.be.false;
    });

    it('should toggle the pressed state when pressing space', async () => {
      el.focus();
      await sendKeys({ press: 'Space' });
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'true');
      expect(el).to.have.attribute('pressed');
      expect(el.pressed).to.be.true;

      el.focus();
      await sendKeys({ press: 'Space' });
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'false');
      expect(el).not.to.have.attribute('pressed');
      expect(el.pressed).to.be.false;
    });

    it('should emit an sl-toggle event on click', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      el.click();
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;
    });

    it('should emit an sl-toggle event when pressing the enter key', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      el.focus();
      await sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;
    });

    it('should emit an sl-toggle event when pressing the space key', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      el.focus();
      await sendKeys({ press: 'Space' });
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-button disabled>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
    });

    it('should have the :disabled pseudo class', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.match(':disabled');
    });

    it('should not toggle the pressed state when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'false');
      expect(el).not.to.have.attribute('pressed');
      expect(el.pressed).to.be.false;
    });

    it('should not toggle the pressed state when pressing enter', async () => {
      el.focus();
      sendKeys({ press: 'Enter' });
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'false');
      expect(el).not.to.have.attribute('pressed');
      expect(el.pressed).to.be.false;
    });

    it('should not toggle the pressed state when pressing space', async () => {
      el.focus();
      sendKeys({ press: 'Space' });
      await el.updateComplete;

      expect(el).to.have.attribute('aria-pressed', 'false');
      expect(el).not.to.have.attribute('pressed');
      expect(el.pressed).to.be.false;
    });

    it('should not emit an sl-toggle event when clicked', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', onToggle);
      el.click();
      await el.updateComplete;

      expect(onToggle).not.to.have.been.called;
    });
  });

  describe('pressed', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-button pressed>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
    });

    it('should have an aria-pressed attribute set to true', () => {
      expect(el).to.have.attribute('aria-pressed', 'true');
    });

    it('should have a true pressed state when the attribute it set', () => {
      expect(el.pressed).to.be.true;
    });
  });

  describe('developer feedback', () => {
    it('should log an error when the default icon is missing', async () => {
      const errorStub = stub(console, 'error');

      el = await fixture(html`<sl-toggle-button></sl-toggle-button>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorStub).to.have.been.calledWith(
        'There needs to be an sl-icon in the "default" slot for the component to work'
      );

      errorStub.restore();
    });

    it('should log an error when the pressed icon is missing', async () => {
      const errorStub = stub(console, 'error');

      el = await fixture(html`
        <sl-toggle-button>
          <sl-icon name="far-gear" slot="default"></sl-icon>
        </sl-toggle-button>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorStub).to.have.been.calledWith(
        'There needs to be an sl-icon in the "pressed" slot for the component to work'
      );

      errorStub.restore();
    });

    it('should log an error when the default and pressed icons are the same', async () => {
      const errorStub = stub(console, 'error');

      el = await fixture(html`
        <sl-toggle-button>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="far-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorStub).to.have.been.calledWith('Do not use the same icon for both states of the toggle button.');

      errorStub.restore();
    });

    it('should not log an error if only text is slotted', async () => {
      const errorStub = stub(console, 'error');

      el = await fixture(html`<sl-toggle-button>Toggle me</sl-toggle-button>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorStub).not.to.have.been.called;

      errorStub.restore();
    });
  });
});
