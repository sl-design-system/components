import { getForwardedAccessibleName } from '@sl-design-system/shared/helpers/forward-aria.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Infotip } from './infotip.js';

describe('sl-infotip', () => {
  let el: Infotip;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-infotip>More info about this field.</sl-infotip>`);
    });

    it('should render a trigger button', () => {
      expect(el.renderRoot.querySelector('sl-button')).to.exist;
    });

    it('should have an accessible label on the button', () => {
      const button = el.renderRoot.querySelector('sl-button')!;

      expect(getForwardedAccessibleName(button)).to.have.equal('More information');
    });

    it('should have a ghost fill on the button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.have.attribute('fill', 'ghost');
    });

    it('should have a default icon of far-circle-info', () => {
      expect(el.icon).to.equal('far-circle-info');
    });

    it('should not have an explicit max-width', () => {
      expect(el.maxWidth).to.be.undefined;
    });

    it('should not have the popover open by default', () => {
      expect(el.popoverEl).not.to.match(':popover-open');
    });
  });

  describe('toggle', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-infotip>More info about this field.</sl-infotip>`);
    });

    it('should open the popover when clicking the trigger button', async () => {
      const button = el.renderRoot.querySelector('sl-button')!;
      await userEvent.click(button);
      expect(el.popoverEl).to.match(':popover-open');
    });

    it('should close the popover when clicking the trigger button again', async () => {
      const button = el.renderRoot.querySelector('sl-button')!;
      await userEvent.click(button);
      await userEvent.click(button);
      expect(el.popoverEl).not.to.match(':popover-open');
    });

    it('should close the popover when pressing Escape', async () => {
      const button = el.renderRoot.querySelector('sl-button')!;
      await userEvent.click(button);
      await userEvent.keyboard('{Escape}');
      expect(el.popoverEl).not.to.match(':popover-open');
    });
  });

  describe('slot', () => {
    it('should render slotted content inside the popover', async () => {
      el = await fixture(html`<sl-infotip><strong>Bold info text</strong></sl-infotip>`);
      expect(el.renderRoot.querySelector('slot')).to.exist;
      expect(el.querySelector('strong')).to.exist;
    });
  });

  describe('icon', () => {
    it('should pass the icon name to sl-icon', async () => {
      el = await fixture(html`<sl-infotip icon="far-circle-question">Info</sl-infotip>`);
      const icon = el.renderRoot.querySelector('sl-icon');
      expect(icon).to.have.attribute('name', 'far-circle-question');
    });
  });
});
