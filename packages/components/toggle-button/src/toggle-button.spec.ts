import { expect, fixture } from '@open-wc/testing';
import { a11ySnapshot, sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type ToggleButton } from './toggle-button.js';

describe('sl-toggle-button', () => {
  let el: ToggleButton;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-toggle-button>
          <sl-icon name="far-gear"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>`
      );
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a button role', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-confusing-void-expression
      const { role } = (await a11ySnapshot({ selector: 'sl-toggle-button' })) as any;

      expect(role).to.equal('button');
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
      expect(el).not.to.have.attribute('pressed');
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el).not.to.match(':disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should emit a click event when clicked', () => {
      const clickEvent = new Event('click');
      const onToggle = spy();
      expect(el).not.to.have.attribute('pressed');

      el.addEventListener('sl-toggle', onToggle);

      el.dispatchEvent(clickEvent);

      expect(onToggle).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the enter key', async () => {
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

    it('should have a tabindex of -1', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '-1');
    });

    it('should not emit a click event when the button is disabled', async () => {
      const clickEvent = new Event('click');
      const preventDefaultSpy = spy(clickEvent, 'preventDefault');
      const stopPropagationSpy = spy(clickEvent, 'stopPropagation');

      el.disabled = true;
      await el.updateComplete;

      el.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).to.have.been.called;
      expect(stopPropagationSpy).to.have.been.called;
    });
  });
});
