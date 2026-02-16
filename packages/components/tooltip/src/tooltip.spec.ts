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
      expect(tooltip).not.to.match(':popover-open');
    });

    it('should toggle the tooltip on focusin and focusout', async () => {
      button?.focus();
      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(tooltip).to.match(':popover-open');

      const focusoutEvent = new Event('focusout', { bubbles: true });
      button?.dispatchEvent(focusoutEvent);
      expect(tooltip).not.to.match(':popover-open');
    });

    it('should toggle the tooltip on pointerover and pointerout', () => {
      const pointerOver = new Event('pointerover', { bubbles: true });
      button?.dispatchEvent(pointerOver);
      expect(tooltip).to.match(':popover-open');

      const pointerEvent = new Event('pointerout', { bubbles: true });
      button?.dispatchEvent(pointerEvent);
      expect(tooltip).not.to.match(':popover-open');
    });

    it('should toggle the tooltip on focus and Escape key pressed', async () => {
      button?.focus();
      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(tooltip).to.match(':popover-open');

      await userEvent.keyboard('{Escape}');
      expect(tooltip).not.to.match(':popover-open');
    });

    it('should toggle the tooltip on pointerover and Escape key pressed', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      expect(tooltip).to.match(':popover-open');

      await userEvent.keyboard('{Escape}');
      expect(tooltip).not.to.match(':popover-open');
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

      expect(tooltip).to.match(':popover-open');
    });
  });

  describe('multiple ids', () => {
    let button: Button;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <span id="other-element">Other element</span>
          <sl-button aria-describedby="other-element tooltip"> Button</sl-button>
          <sl-tooltip id="tooltip">Tooltip message</sl-tooltip>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
    });

    it('should show the tooltip when its id is one of multiple ids in aria-describedby', async () => {
      const pointerOver = new Event('pointerover', { bubbles: true });

      button?.dispatchEvent(pointerOver);
      await tooltip.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(tooltip).to.match(':popover-open');
    });

    it('should hide the tooltip on pointerout when its id is one of multiple ids', async () => {
      const pointerOver = new Event('pointerover', { bubbles: true });

      button?.dispatchEvent(pointerOver);
      await tooltip.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(tooltip).to.match(':popover-open');

      const pointerOut = new Event('pointerout', { bubbles: true });
      button?.dispatchEvent(pointerOut);

      expect(tooltip).not.to.match(':popover-open');
    });
  });

  describe('multiple ids with aria-labelledby', () => {
    let button: Button;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <span id="other-label">Other label</span>
          <sl-button aria-labelledby="other-label tooltip">Button with multiple label ids </sl-button>
          <sl-tooltip id="tooltip">Tooltip label</sl-tooltip>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
    });

    it('should show the tooltip when its id is one of multiple ids in aria-labelledby', async () => {
      const pointerOver = new Event('pointerover', { bubbles: true });

      button?.dispatchEvent(pointerOver);
      await tooltip.updateComplete;
      await new Promise(resolve => setTimeout(resolve));

      expect(tooltip).to.match(':popover-open');
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
      expect(tooltip).to.match(':popover-open');
    });

    it('should create a tooltip lazily on focusin', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip));

      button.dispatchEvent(new Event('focusin', { bubbles: true }));

      // Give some time for the tooltip to open
      await new Promise(resolve => setTimeout(resolve));

      expect(tooltip).to.exist;
      expect(button).to.have.attribute('aria-describedby', tooltip?.id);
      expect(tooltip).to.match(':popover-open');
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
