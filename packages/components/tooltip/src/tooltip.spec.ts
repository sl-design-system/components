import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Tooltip } from './tooltip.js';

describe('sl-tooltip', () => {
  let el: HTMLElement;
  let button: Button;
  let tooltip: Tooltip;

  const showTooltip = async () => {
    const focusinEvent = new Event('pointerover', { bubbles: true });
    button?.dispatchEvent(focusinEvent);
    await tooltip.updateComplete;
    return await new Promise(resolve => setTimeout(resolve));
  };

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button aria-describedby="tooltip" fill="outline" style="margin-top: 100px">Button element</sl-button>
          <sl-tooltip id="tooltip">Message with lots of long text, that exceeds 150px easily</sl-tooltip>
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
    });

    it('should not show the tooltip by default', () => {
      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on focusin and focusout', async () => {
      button?.focus();
      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(tooltip.matches(':popover-open')).to.be.true;

      const focusoutEvent = new Event('focusout', { bubbles: true });
      button?.dispatchEvent(focusoutEvent);
      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on pointerover and pointerout', () => {
      const pointerOver = new Event('pointerover', { bubbles: true });
      button?.dispatchEvent(pointerOver);
      expect(tooltip.matches(':popover-open')).to.be.true;

      const pointerEvent = new Event('pointerout', { bubbles: true });
      button?.dispatchEvent(pointerEvent);
      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on focus and Escape key pressed', async () => {
      button?.focus();
      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(tooltip.matches(':popover-open')).to.be.true;

      await userEvent.keyboard('{Escape}');
      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on pointerover and Escape key pressed', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      expect(tooltip.matches(':popover-open')).to.be.true;

      await userEvent.keyboard('{Escape}');
      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should be positioned at the top by default', () => {
      expect(tooltip.position).to.equal('top');
    });

    it('should set the position to the position option chosen', async () => {
      tooltip.setAttribute('position', 'bottom');
      await tooltip.updateComplete;

      expect(tooltip.position).to.equal('bottom');
    });

    it('should not have a maxWidth by default', async () => {
      tooltip.setAttribute('max-width', '150');
      await tooltip.updateComplete;

      await showTooltip();

      expect(getComputedStyle(tooltip).maxInlineSize).to.equal('150px');
    });
  });

  describe('linked via aria-labelledby', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button aria-labelledby="tooltip" fill="outline" style="margin-top: 100px">Button element</sl-button>
          <sl-tooltip id="tooltip">Message with lots of long text, that exceeds 150px easily</sl-tooltip>
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
    });

    it('should show the tooltip on pointerover', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('Tooltip lazy()', () => {
    let el: HTMLElement;
    let button: Button;
    let tooltip: Tooltip;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button>Button</sl-button>
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
    });

    it('should create a tooltip lazily on pointerover with default aria-describedby', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip));

      button.dispatchEvent(new Event('pointerover', { bubbles: true }));

      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve));

      expect(tooltip).to.exist;
      expect(tooltip!.id).to.match(/sl-tooltip-(\d+)/);
      expect(button).to.have.attribute('aria-describedby', tooltip?.id);
      expect(button).not.to.have.attribute('aria-labelledby');
      expect(tooltip!.matches(':popover-open')).to.be.true;
    });

    it('should create a tooltip lazily on focusin', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip));

      button.dispatchEvent(new Event('focusin', { bubbles: true }));

      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve));

      expect(tooltip).to.exist;
      expect(button).to.have.attribute('aria-describedby', tooltip?.id);
      expect(tooltip!.matches(':popover-open')).to.be.true;
    });

    it('should use aria-labelledby when ariaRelation is label', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip), { ariaRelation: 'label' });

      button.dispatchEvent(new Event('pointerover', { bubbles: true }));

      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve));

      expect(tooltip).to.exist;
      expect(button).to.have.attribute('aria-labelledby', tooltip?.id);
      expect(button).not.to.have.attribute('aria-describedby');
    });

    it('should only create the tooltip once', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip));

      button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      button.dispatchEvent(new Event('pointerover', { bubbles: true })); // second should be ignored

      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve));

      expect(el.querySelectorAll('sl-tooltip').length).to.equal(1);
      expect(tooltip).to.exist;
    });
  });
});
