import { type Button } from '@sl-design-system/button';
import '@sl-design-system/form/register.js';
import { type Popover } from '@sl-design-system/popover';
import { getForwardedAccessibleName } from '@sl-design-system/shared/helpers/forward-aria.js';
import { type TextField } from '@sl-design-system/text-field';
import '@sl-design-system/text-field/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Infotip } from './infotip.js';

describe('sl-infotip', () => {
  let el: Infotip, button: Button, popover: Popover;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-infotip>More info about this field.</sl-infotip>`);

      button = el.renderRoot.querySelector('sl-button')!;
      popover = el.renderRoot.querySelector('sl-popover')!;
    });

    it('should render a trigger button', () => {
      expect(el.renderRoot.querySelector('sl-button')).to.exist;
    });

    it('should have an accessible label on the button', () => {
      expect(getForwardedAccessibleName(button)).to.have.equal('More information');
    });

    it('should have a ghost fill on the button', () => {
      expect(button).to.have.attribute('fill', 'ghost');
    });

    it('should have a default icon of info', () => {
      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'info');
    });

    it('should render the slotted content inside the popover', () => {
      const content = el.renderRoot
        .querySelector<HTMLSlotElement>('slot:not([name])')
        ?.assignedNodes({ flatten: true })
        .map(node => node.textContent?.trim?.() || '')
        .join('');

      expect(content).to.equal('More info about this field.');
    });

    it('should not have the popover open by default', () => {
      expect(popover).not.to.match(':popover-open');
    });

    it('should focus the trigger button when focusing the host', async () => {
      el.focus();
      await new Promise(resolve => setTimeout(resolve));

      expect((el.renderRoot as ShadowRoot).activeElement).to.equal(button);
    });

    it('should open the popover when clicking the trigger button', async () => {
      await userEvent.click(button);

      expect(popover).to.match(':popover-open');
    });

    it('should open the popover when pressing Enter after focusing the host', async () => {
      el.focus();
      await new Promise(resolve => setTimeout(resolve));
      await userEvent.keyboard('{Enter}');

      expect(popover).to.match(':popover-open');
    });

    it('should close the popover when clicking the trigger button again', async () => {
      await userEvent.click(button);
      await userEvent.click(button);

      expect(popover).not.to.match(':popover-open');
    });

    it('should close the popover when pressing Escape', async () => {
      await userEvent.click(button);
      await userEvent.keyboard('{Escape}');

      expect(popover).not.to.match(':popover-open');
    });
  });

  describe('custom icon', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-infotip>
          <sl-icon name="clock" slot="icon"></sl-icon>
          More info about this field.
        </sl-infotip>
      `);
    });

    it('should display the custom icon in the icon slot', () => {
      const icon = el.querySelector('sl-icon'),
        elements = el.renderRoot
          .querySelector<HTMLSlotElement>('slot[name="icon"]')
          ?.assignedElements({ flatten: true });

      expect(elements?.at(0)).to.equal(icon);
    });
  });

  describe('accessibility', () => {
    let textField: TextField;

    beforeEach(async () => {
      const formField = await fixture(html`
        <sl-form-field>
          <sl-label>
            Username
            <sl-infotip slot="infotip">This field requires a unique identifier.</sl-infotip>
          </sl-label>
          <sl-text-field placeholder="Username"></sl-text-field>
        </sl-form-field>
      `);

      el = formField.querySelector('sl-infotip')!;
      textField = formField.querySelector('sl-text-field')!;
    });

    it('should have a contentId for the content copy', () => {
      expect(el.contentId).to.be.a('string').and.not.be.empty;
    });

    it('should have the input aria-describedby the infotip popover', () => {
      const input = textField.querySelector('input')!,
        describedby = input.getAttribute('aria-describedby') ?? '';

      expect(describedby).to.include(el.contentId);
    });
  });
});
