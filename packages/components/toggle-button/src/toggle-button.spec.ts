import '@sl-design-system/icon/register.js';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy, stub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { type ToggleButton } from './toggle-button.js';

describe('sl-toggle-button', () => {
  let el: ToggleButton, button: HTMLButtonElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-button>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
      button = el.renderRoot.querySelector('button')!;
    });

    it('should have a native button in the shadow DOM', () => {
      expect(button).to.exist;
      expect(button).to.have.attribute('type', 'button');
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
      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be marked as icon only', () => {
      expect(el).to.match(':state(icon-only)');
    });

    it('should delegate focus to the inner button', () => {
      el.focus();

      expect(document.activeElement).to.equal(el);
      expect(el.shadowRoot?.activeElement).to.equal(button);
    });

    it('should toggle the pressed state when clicked', async () => {
      await userEvent.click(button);
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'true');
      expect(el.pressed).to.be.true;

      await userEvent.click(button);
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should toggle the pressed state when pressing enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'true');
      expect(el.pressed).to.be.true;

      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should toggle the pressed state when pressing space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'true');
      expect(el.pressed).to.be.true;

      el.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should emit an sl-toggle event on click', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      await userEvent.click(button);
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
      await userEvent.keyboard('{Enter}');
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
      await userEvent.keyboard('{Space}');
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
      button = el.renderRoot.querySelector('button')!;
    });

    it('should not toggle the pressed state when clicked', async () => {
      button.click();

      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should not toggle the pressed state when pressing enter', async () => {
      el.focus();

      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should not toggle the pressed state when pressing space', async () => {
      el.focus();

      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should not emit an sl-toggle event when clicked', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', onToggle);
      button.click();
      await el.updateComplete;

      expect(onToggle).not.to.have.been.called;
    });

    it('should not emit a click event when clicked', async () => {
      const onClick = spy();

      el.addEventListener('click', onClick);
      button.click();
      await el.updateComplete;

      expect(onClick).not.to.have.been.called;
    });

    it('should disable the inner button', () => {
      expect(button).to.have.attribute('disabled');
    });

    it('should remove disabled from the inner button when re-enabled', async () => {
      el.disabled = false;
      await el.updateComplete;

      expect(el).not.to.have.attribute('disabled');
      expect(button).not.to.have.attribute('disabled');
    });

    it('should preserve a consumer-provided aria-disabled value when re-enabled', async () => {
      el = await fixture(html`
        <sl-toggle-button aria-disabled="true" disabled>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
      button = el.renderRoot.querySelector('button')!;

      el.disabled = false;
      await el.updateComplete;

      expect(el).not.to.have.attribute('disabled');
      expect(button).to.have.attribute('aria-disabled', 'true');
    });
  });

  describe('aria-disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-toggle-button aria-disabled="true">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
      button = el.renderRoot.querySelector('button')!;
    });

    it('should proxy the aria-disabled attribute to the inner button', () => {
      expect(button).to.have.attribute('aria-disabled', 'true');

      el.removeAttribute('aria-disabled');

      expect(button).not.to.have.attribute('aria-disabled');
    });

    it('should be focusable', () => {
      el.focus();

      expect(document.activeElement).to.equal(el);
    });

    it('should not toggle the pressed state when clicked', async () => {
      button.click();
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should not toggle the pressed state when pressing enter', async () => {
      el.focus();

      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(button).to.have.attribute('aria-pressed', 'false');
      expect(el.pressed).not.to.be.true;
    });

    it('should not emit an sl-toggle event when clicked', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', onToggle);
      button.click();
      await el.updateComplete;

      expect(onToggle).not.to.have.been.called;
    });

    it('should not emit a click event when clicked', async () => {
      const onClick = spy();

      el.addEventListener('click', onClick);
      button.click();
      await el.updateComplete;

      expect(onClick).not.to.have.been.called;
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
      button = el.renderRoot.querySelector('button')!;
    });

    it('should have an aria-pressed attribute set to true', () => {
      expect(button).to.have.attribute('aria-pressed', 'true');
    });

    it('should have a true pressed state when the attribute it set', () => {
      expect(el.pressed).to.be.true;
    });
  });

  describe('developer feedback', () => {
    let errorStub: sinon.SinonStub;

    beforeEach(() => (errorStub = stub(console, 'error')));

    afterEach(() => errorStub.restore());

    it('should log an error when the default icon is missing', async () => {
      el = await fixture(html`<sl-toggle-button></sl-toggle-button>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorStub).to.have.been.calledWith(
        'There needs to be an sl-icon in the "default" slot for the component to work'
      );
    });

    it('should log an error when the pressed icon is missing', async () => {
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
    });

    it('should log an error when the default and pressed icons are the same', async () => {
      el = await fixture(html`
        <sl-toggle-button>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="far-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorStub).to.have.been.calledWith(
        'Do not use the same icon for both states of the toggle button.'
      );
    });

    it('should not log an error if only text is slotted', async () => {
      el = await fixture(html`<sl-toggle-button>Toggle me</sl-toggle-button>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(errorStub).not.to.have.been.called;
    });
  });

  describe('tooltip', () => {
    it('should not have a tooltip by default', async () => {
      el = await fixture(html`
        <sl-toggle-button>
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);

      expect(el.tooltip).to.be.undefined;
      expect(el.renderRoot.querySelector('sl-tooltip')).to.be.null;
    });

    it('should have a tooltip when set', async () => {
      el = await fixture(html`
        <sl-toggle-button tooltip="Settings">
          <sl-icon name="far-gear" slot="default"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>
      `);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      const tooltip = el.renderRoot.querySelector('sl-tooltip')!,
        innerButton = el.renderRoot.querySelector('button');

      await tooltip.updateComplete;

      expect(tooltip).to.exist;
      expect(tooltip).to.have.trimmed.text('Settings');
      expect(innerButton?.ariaLabelledByElements).to.include(tooltip);
    });

    it('should use the tooltip as the description for the text button', async () => {
      el = await fixture(html`<sl-toggle-button tooltip="Tooltip">Settings</sl-toggle-button>`);

      await new Promise(resolve => setTimeout(resolve, 50));

      const tooltip = el.renderRoot.querySelector('sl-tooltip'),
        innerButton = el.renderRoot.querySelector('button');

      expect(tooltip).to.exist;
      expect(tooltip).to.have.trimmed.text('Tooltip');
      expect(innerButton?.ariaDescribedByElements).to.include(tooltip);
    });
  });
});
