import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { Menu, MenuButton } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';
import { isPopoverOpen } from '@sl-design-system/shared';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Tooltip } from './tooltip.js';

class TooltipAssignedSlotHost extends LitElement {
  override render() {
    return html`
      <span id="internal-description">Internal description</span>
      <span id="secondary-description">Secondary description</span>
      <slot name="actions"></slot>
      <slot></slot>
    `;
  }
}

class TooltipAssignedSlotAnchor extends LitElement {
  readonly internals = this.attachInternals();

  getProxyTarget(): HTMLButtonElement | null {
    return this.renderRoot.querySelector('button');
  }

  override render() {
    return html`<button type="button" aria-describedby="tooltip"><slot></slot></button>`;
  }
}

if (!customElements.get('tooltip-assigned-slot-host')) {
  customElements.define('tooltip-assigned-slot-host', TooltipAssignedSlotHost);
}

if (!customElements.get('tooltip-assigned-slot-anchor')) {
  customElements.define('tooltip-assigned-slot-anchor', TooltipAssignedSlotAnchor);
}

describe('sl-tooltip', () => {
  let el: HTMLElement;
  let button: Button;
  let tooltip: Tooltip;

  const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const showTooltip = async () => {
    const pointerOverEvent = new Event('pointerover', { bubbles: true });
    button?.dispatchEvent(pointerOverEvent);
    await tooltip.updateComplete;
    return await waitFor(Tooltip.hoverShowDelay + 10);
  };

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button aria-describedby="tooltip" fill="outline" style="margin-top: 100px"
            >Button element</sl-button
          >
          <sl-tooltip id="tooltip"
            >Message with lots of long text, that exceeds 150px easily</sl-tooltip
          >
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
    });

    it('should not show the tooltip by default', () => {
      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on focusin and focusout', async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <button id="focus-target" type="button" aria-describedby="tooltip">Button element</button>
          <button id="outside-target" type="button">Outside focus target</button>
          <sl-tooltip id="tooltip"
            >Message with lots of long text, that exceeds 150px easily</sl-tooltip
          >
        </div>
      `);
      const focusButton = el.querySelector<HTMLButtonElement>('#focus-target')!,
        outsideButton = el.querySelector<HTMLButtonElement>('#outside-target')!;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
      await tooltip.updateComplete;

      const originalMatches = Element.prototype.matches;
      const focusVisibleSpy = vi.spyOn(Element.prototype, 'matches').mockImplementation(function (
        this: Element,
        selector: string
      ): boolean {
        if (selector === ':focus-visible' && this === focusButton) {
          return true;
        }

        return originalMatches.call(this, selector);
      });

      try {
        focusButton.focus();
        focusButton.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
        await tooltip.updateComplete;
        await new Promise(resolve => requestAnimationFrame(resolve));
        await tooltip.updateComplete;

        expect(tooltip.matches(':popover-open')).to.be.true;
      } finally {
        focusVisibleSpy.mockRestore();
      }

      focusButton.blur();
      focusButton.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      outsideButton.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on pointerover and pointerout', async () => {
      const pointerOver = new Event('pointerover', { bubbles: true });
      button?.dispatchEvent(pointerOver);
      await waitFor(Tooltip.hoverShowDelay + 10);
      expect(tooltip.matches(':popover-open')).to.be.true;

      const pointerEvent = new Event('pointerout', { bubbles: true });
      button?.dispatchEvent(pointerEvent);
      await waitFor(Tooltip.hoverHideDelay + 10);
      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should not run hide logic on pointerout when tooltip is closed', async () => {
      const hidePopoverSpy = vi.spyOn(tooltip, 'hidePopover');

      try {
        expect(isPopoverOpen(tooltip)).to.be.false;

        tooltip.dispatchEvent(new Event('pointerout', { bubbles: true }));
        await waitFor(Tooltip.hoverShowDelay + 10);

        expect(hidePopoverSpy).not.toHaveBeenCalled();
      } finally {
        hidePopoverSpy.mockRestore();
      }
    });

    it('should ignore unrelated focusout events while open', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);
      expect(tooltip.matches(':popover-open')).to.be.true;

      const other = document.createElement('input');
      el.appendChild(other);
      other.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));

      await tooltip.updateComplete;
      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should not switch to focus-open mode on focusin without focus-visible when already open', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);
      expect(tooltip.matches(':popover-open')).to.be.true;

      button?.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      button?.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));

      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should still close on focusout after pointerover when it was opened by focus', async () => {
      button?.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;
      expect(tooltip.matches(':popover-open')).to.be.true;

      // Pointer over while open should not flip internal mode from focus-open to hover-open.
      button?.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));

      const originalMatches = button.matches.bind(button);
      const matchesSpy = vi
        .spyOn(button, 'matches')
        .mockImplementation((selector: string): boolean => {
          if (
            selector === ':hover' ||
            selector === ':focus-visible' ||
            selector === ':focus-within'
          ) {
            return false;
          }

          return originalMatches(selector);
        });

      try {
        button?.blur();
        button?.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
        await waitFor(Tooltip.hoverShowDelay + 10);

        expect(tooltip.matches(':popover-open')).to.be.false;
      } finally {
        matchesSpy.mockRestore();
      }
    });

    it('should stay open on focusout when the anchor remains hovered', async () => {
      await tooltip.updateComplete;

      const proxyTarget = (
          button as HTMLElement & { getProxyTarget?(): Element | null }
        ).getProxyTarget?.(),
        originalElementMatches = Element.prototype.matches;
      const focusVisibleSpy = vi.spyOn(Element.prototype, 'matches').mockImplementation(function (
        this: Element,
        selector: string
      ): boolean {
        if (selector === ':focus-visible' && (this === button || this === proxyTarget)) {
          return true;
        }

        return originalElementMatches.call(this, selector);
      });

      button?.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;
      focusVisibleSpy.mockRestore();

      expect(tooltip.matches(':popover-open')).to.be.true;

      const proxyTargetForHover = (
          button as HTMLElement & { getProxyTarget?(): Element | null }
        ).getProxyTarget?.(),
        currentAnchor = tooltip.anchorElement,
        originalMatches = Element.prototype.matches;
      const matchesSpy = vi.spyOn(Element.prototype, 'matches').mockImplementation(function (
        this: Element,
        selector: string
      ): boolean {
        const isAnchorTarget =
          this === button || this === proxyTargetForHover || this === currentAnchor;

        if (selector === ':hover' && isAnchorTarget) {
          return true;
        }

        if (selector === ':focus-within' && isAnchorTarget) {
          return false;
        }

        return originalMatches.call(this, selector);
      });

      try {
        button?.blur();
        button?.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
        await waitFor(Tooltip.hoverShowDelay + 10);

        expect(tooltip.matches(':popover-open')).to.be.true;
      } finally {
        matchesSpy.mockRestore();
      }
    });

    it('should restore the tooltip to the focused shared anchor after unhovering another shared anchor', async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <button id="first" type="button" aria-describedby="tooltip">First button</button>
          <button id="second" type="button" aria-describedby="tooltip">Second button</button>
          <sl-tooltip id="tooltip">Shared tooltip</sl-tooltip>
        </div>
      `);

      const firstButton = el.querySelector<HTMLButtonElement>('#first')!,
        secondButton = el.querySelector<HTMLButtonElement>('#second')!;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
      await tooltip.updateComplete;

      const originalMatches = Element.prototype.matches;
      const focusVisibleSpy = vi.spyOn(Element.prototype, 'matches').mockImplementation(function (
        this: Element,
        selector: string
      ): boolean {
        if (selector === ':focus-visible' && this === firstButton) {
          return true;
        }

        return originalMatches.call(this, selector);
      });

      firstButton.focus();
      firstButton.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;
      focusVisibleSpy.mockRestore();

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.anchorElement).to.equal(firstButton);

      secondButton.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.anchorElement).to.equal(secondButton);

      secondButton.dispatchEvent(new Event('pointerout', { bubbles: true, composed: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.anchorElement).to.equal(firstButton);
    });

    it('should toggle the tooltip on focus and Escape key pressed', async () => {
      button?.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;
      expect(tooltip.matches(':popover-open')).to.be.true;

      await userEvent.keyboard('{Escape}');

      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on pointerover and Escape key pressed', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);
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

    it('should show the tooltip on sl-close dispatched outside the tooltip root while anchor keeps focus', async () => {
      button?.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;

      // Keep the anchor focused, but close the tooltip first so reopening can only come from sl-close handling.
      if (tooltip.matches(':popover-open')) {
        tooltip.hidePopover();
      }

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;
      expect(tooltip.matches(':popover-open')).to.be.false;

      // Dispatch sl-close from outside the tooltip root (e.g. document-level overlay close).
      const overlay = document.createElement('div');
      document.body.append(overlay);
      overlay.dispatchEvent(new CustomEvent('sl-close', { bubbles: true, composed: true }));
      overlay.remove();

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should keep the tooltip open when focus moves between focusable children in the same anchor', async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <div aria-describedby="tooltip" tabindex="-1">
            <button type="button">First child</button>
            <button type="button">Second child</button>
          </div>
          <sl-tooltip id="tooltip"
            >Message with lots of long text, that exceeds 150px easily</sl-tooltip
          >
        </div>
      `);

      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      const [firstChildButton, secondChildButton] = Array.from(
        el.querySelectorAll<HTMLButtonElement>('button')
      );

      firstChildButton.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;

      secondChildButton.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('linked via aria-labelledby', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button aria-labelledby="tooltip" fill="outline" style="margin-top: 100px"
            >Button element</sl-button
          >
          <sl-tooltip id="tooltip"
            >Message with lots of long text, that exceeds 150px easily</sl-tooltip
          >
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
    });

    it('should show the tooltip on pointerover', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('multiple ids', () => {
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
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should hide the tooltip on pointerout when its id is one of multiple ids', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;

      button?.dispatchEvent(new Event('pointerout', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.false;
    });
  });

  describe('multiple ids with aria-labelledby', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <span id="other-label">Other label</span>
          <sl-button aria-labelledby="other-label tooltip"
            >Button with multiple label ids
          </sl-button>
          <sl-tooltip id="tooltip">Tooltip label</sl-tooltip>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
    });

    it('should show the tooltip when its id is one of multiple ids in aria-labelledby', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('ElementInternals ariaDescribedByElements', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <sl-button>Button</sl-button>
          <sl-tooltip id="tooltip">Tooltip via ElementInternals</sl-tooltip>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      // Manually set ariaDescribedByElements
      if (button.internals) {
        button.internals.ariaDescribedByElements = [tooltip];
      }
    });

    it('should show tooltip when referenced via ElementInternals ariaDescribedByElements', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should hide tooltip on pointerout when referenced via ElementInternals', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;

      button?.dispatchEvent(new Event('pointerout', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should show tooltip on focus when referenced via ElementInternals', async () => {
      button?.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('ElementInternals ariaLabelledByElements', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <sl-button>Button</sl-button>
          <sl-tooltip id="tooltip">Tooltip label via ElementInternals</sl-tooltip>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      // Manually set ariaLabelledByElements
      if (button.internals) {
        button.internals.ariaLabelledByElements = [tooltip];
      }
    });

    it('should show tooltip when referenced via ElementInternals ariaLabelledByElements', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should hide tooltip on pointerout when referenced via ElementInternals ariaLabelledByElements', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;

      button?.dispatchEvent(new Event('pointerout', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.false;
    });
  });

  describe('ElementInternals with multiple elements', () => {
    let otherElement: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <span id="other-element">Other element</span>
          <sl-button>Button</sl-button>
          <sl-tooltip id="tooltip">Tooltip message</sl-tooltip>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
      otherElement = el.querySelector('#other-element') as HTMLElement;

      // Set multiple elements in ariaDescribedByElements
      if (button.internals) {
        button.internals.ariaDescribedByElements = [otherElement, tooltip];
      }
    });

    it('should show tooltip when it is one of multiple elements in ariaDescribedByElements', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('Element ariaDescribedByElements', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <sl-button>Button</sl-button>
          <sl-tooltip id="tooltip">Tooltip via Element property</sl-tooltip>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      // Set ariaDescribedByElements directly on the element (not via ElementInternals)
      button.ariaDescribedByElements = [tooltip];
    });

    it('should show tooltip when referenced via Element ariaDescribedByElements', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should hide tooltip on pointerout when referenced via Element ariaDescribedByElements', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;

      button?.dispatchEvent(new Event('pointerout', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should show tooltip on focus when referenced via Element ariaDescribedByElements', async () => {
      button?.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('Element ariaLabelledByElements', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <sl-button>Button</sl-button>
          <sl-tooltip id="tooltip">Tooltip label via Element property</sl-tooltip>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      // Set ariaLabelledByElements directly on the element (not via ElementInternals)
      button.ariaLabelledByElements = [tooltip];
    });

    it('should show tooltip when referenced via Element ariaLabelledByElements', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should hide tooltip on pointerout when referenced via Element ariaLabelledByElements', async () => {
      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;

      button?.dispatchEvent(new Event('pointerout', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should show tooltip on focus when referenced via Element ariaLabelledByElements', async () => {
      button?.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('with an open popover', () => {
    let menuButton: MenuButton;
    let innerButton: Button;
    let menu: Menu;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <sl-menu-button aria-describedby="tooltip" fill="outline">
            <span slot="button">Settings</span>
            <sl-menu-item>Rename...</sl-menu-item>
            <sl-menu-item>Delete...</sl-menu-item>
          </sl-menu-button>
          <sl-tooltip id="tooltip">Open settings menu</sl-tooltip>
        </div>
      `);

      menuButton = el.querySelector('sl-menu-button') as MenuButton;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      // Wait for menu-button to set up aria references on the inner button
      await tooltip.updateComplete;

      innerButton = menuButton.shadowRoot!.querySelector('sl-button') as Button;
      menu = menuButton.shadowRoot!.querySelector('sl-menu') as Menu;
    });

    it('should show tooltip on pointerover of the menu-button', async () => {
      menuButton.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should not show tooltip on pointerover of a menu item when the menu is open', async () => {
      innerButton.click();
      await tooltip.updateComplete;

      expect(menu.matches(':popover-open')).to.be.true;

      const menuItem = el.querySelector('sl-menu-item') as HTMLElement;

      menuItem.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should not show tooltip on focusin of a menu item when the menu is open', async () => {
      innerButton.click();
      await tooltip.updateComplete;

      expect(menu.matches(':popover-open')).to.be.true;

      const menuItem = el.querySelector('sl-menu-item') as HTMLElement;

      menuItem.focus();
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should show tooltip on pointerover of the menu-button after the menu is closed', async () => {
      innerButton.click();
      await tooltip.updateComplete;
      innerButton.click();
      await tooltip.updateComplete;

      expect(menu.matches(':popover-open')).to.be.false;

      menuButton.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
    });
  });

  describe('with a slotted anchor inside a shadow-root host', () => {
    let assignedSlotHost: TooltipAssignedSlotHost;
    let anchor: Button;
    let internalDescription: HTMLElement;
    let secondaryDescription: HTMLElement;
    let outsideButton: HTMLButtonElement;
    let proxyTarget: HTMLButtonElement;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <tooltip-assigned-slot-host>
            <sl-button aria-describedby="tooltip">Anchor</sl-button>
          </tooltip-assigned-slot-host>
          <button id="outside-focus-target" type="button">Outside</button>
          <sl-tooltip id="tooltip">Tooltip via assigned slot</sl-tooltip>
        </div>
      `);

      assignedSlotHost = el.querySelector('tooltip-assigned-slot-host') as TooltipAssignedSlotHost;
      anchor = el.querySelector('sl-button') as Button;
      outsideButton = el.querySelector('#outside-focus-target') as HTMLButtonElement;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
      internalDescription = assignedSlotHost.shadowRoot!.querySelector(
        '#internal-description'
      ) as HTMLElement;
      secondaryDescription = assignedSlotHost.shadowRoot!.querySelector(
        '#secondary-description'
      ) as HTMLElement;
      proxyTarget = anchor.renderRoot.querySelector('button') as HTMLButtonElement;

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
    });

    it('should move into the assigned slot root, preserve internals relations, and reopen on repeated focus', async () => {
      expect(anchor.assignedSlot).to.exist;
      expect(anchor.assignedSlot?.getRootNode()).to.equal(assignedSlotHost.shadowRoot);

      anchor.internals.ariaDescribedByElements = [internalDescription, secondaryDescription];
      proxyTarget.focus();
      document.dispatchEvent(new CustomEvent('sl-close', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.getRootNode()).to.equal(assignedSlotHost.shadowRoot);
      expect(tooltip.matches(':popover-open')).to.be.true;
      expect([...anchor.internals.ariaDescribedByElements]).to.include.members([
        internalDescription,
        secondaryDescription,
        tooltip
      ]);
      expect(tooltip.anchorElement).to.equal(anchor);

      proxyTarget.blur();
      proxyTarget.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));
      outsideButton.focus();
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.false;

      proxyTarget.focus();
      document.dispatchEvent(new CustomEvent('sl-close', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.anchorElement).to.equal(anchor);
      expect([...anchor.internals.ariaDescribedByElements]).to.include.members([
        internalDescription,
        secondaryDescription,
        tooltip
      ]);
    });
  });

  describe('with a slotted proxy anchor inside a shadow-root host', () => {
    let assignedSlotHost: TooltipAssignedSlotHost;
    let anchor: TooltipAssignedSlotAnchor;
    let anchorContent: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <tooltip-assigned-slot-host>
            <tooltip-assigned-slot-anchor>
              <span id="anchor-content">Anchor</span>
            </tooltip-assigned-slot-anchor>
          </tooltip-assigned-slot-host>
          <sl-tooltip id="tooltip">Tooltip via nested slot path</sl-tooltip>
        </div>
      `);

      assignedSlotHost = el.querySelector('tooltip-assigned-slot-host') as TooltipAssignedSlotHost;
      anchor = el.querySelector('tooltip-assigned-slot-anchor') as TooltipAssignedSlotAnchor;
      anchorContent = el.querySelector('#anchor-content') as HTMLElement;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
    });

    it('should ignore unrelated slots from the event path when finding the assigned slot root', async () => {
      anchorContent.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.anchorElement).to.equal(anchor);
      expect(tooltip.getRootNode()).to.equal(assignedSlotHost.shadowRoot);
    });
  });

  describe('with shared slotted proxy anchors inside a shadow-root host', () => {
    let assignedSlotHost: TooltipAssignedSlotHost;
    let anchors: TooltipAssignedSlotAnchor[];
    let anchorContents: HTMLElement[];

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <tooltip-assigned-slot-host>
            <tooltip-assigned-slot-anchor slot="actions">
              <span id="shared-anchor-content-1">Anchor 1</span>
            </tooltip-assigned-slot-anchor>
            <tooltip-assigned-slot-anchor slot="actions">
              <span id="shared-anchor-content-2">Anchor 2</span>
            </tooltip-assigned-slot-anchor>
          </tooltip-assigned-slot-host>
          <sl-tooltip id="tooltip">Shared tooltip via proxy targets</sl-tooltip>
        </div>
      `);

      assignedSlotHost = el.querySelector('tooltip-assigned-slot-host') as TooltipAssignedSlotHost;
      anchors = Array.from(el.querySelectorAll('tooltip-assigned-slot-anchor'));
      anchorContents = [
        el.querySelector('#shared-anchor-content-1') as HTMLElement,
        el.querySelector('#shared-anchor-content-2') as HTMLElement
      ];
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
    });

    it('should reopen for another shared proxy anchor after moving into the assigned slot root', async () => {
      anchorContents[0].dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.anchorElement).to.equal(anchors[0]);
      expect(tooltip.getRootNode()).to.equal(assignedSlotHost.shadowRoot);

      anchorContents[0].dispatchEvent(new Event('pointerout', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.false;

      anchorContents[1].dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.anchorElement).to.equal(anchors[1]);
      expect(tooltip.getRootNode()).to.equal(assignedSlotHost.shadowRoot);
    });
  });

  describe('with a slotted native anchor inside a shadow-root host', () => {
    let assignedSlotHost: TooltipAssignedSlotHost;
    let anchor: HTMLButtonElement;
    let externalDescription: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <tooltip-assigned-slot-host>
            <button id="native-anchor" aria-describedby="external-description tooltip">
              Anchor
            </button>
          </tooltip-assigned-slot-host>
          <span id="external-description">External description</span>
          <sl-tooltip id="tooltip">Tooltip via assigned slot</sl-tooltip>
        </div>
      `);

      assignedSlotHost = el.querySelector('tooltip-assigned-slot-host') as TooltipAssignedSlotHost;
      anchor = el.querySelector('#native-anchor') as HTMLButtonElement;
      externalDescription = el.querySelector('#external-description') as HTMLElement;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
    });

    it('should keep explicit aria-describedby anchors in the light DOM when they cannot preserve the relation after reparenting', async () => {
      expect(anchor.assignedSlot?.getRootNode()).to.equal(assignedSlotHost.shadowRoot);

      anchor.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.getRootNode()).to.equal(anchor.ownerDocument);
      expect(Array.from(anchor.ariaDescribedByElements ?? [])).to.include.members([
        externalDescription,
        tooltip
      ]);
    });
  });

  describe('with native anchors that keep the tooltip in the light DOM', () => {
    let slottedAnchor: HTMLButtonElement;
    let defaultAnchor: HTMLButtonElement;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <tooltip-assigned-slot-host>
            <button
              id="slotted-anchor"
              slot="actions"
              aria-describedby="external-description tooltip"
            >
              Slotted anchor
            </button>
            <button id="default-anchor" aria-describedby="external-description tooltip">
              Default anchor
            </button>
          </tooltip-assigned-slot-host>
          <span id="external-description">External description</span>
          <sl-tooltip id="tooltip">Tooltip via assigned slot</sl-tooltip>
        </div>
      `);

      slottedAnchor = el.querySelector('#slotted-anchor') as HTMLButtonElement;
      defaultAnchor = el.querySelector('#default-anchor') as HTMLButtonElement;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
    });

    it('should sync and clear the tooltip slot when reparenting is skipped', async () => {
      slottedAnchor.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.getAttribute('slot')).to.equal('actions');

      slottedAnchor.dispatchEvent(new Event('pointerout', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      defaultAnchor.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.hasAttribute('slot')).to.be.false;
    });
  });

  describe('when switching from a shadow-root anchor to a light DOM anchor', () => {
    let assignedSlotHost: TooltipAssignedSlotHost;
    let shadowAnchor: Button;
    let nativeAnchor: HTMLButtonElement;
    let externalDescription: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="block-size: 400px; inline-size: 400px;">
          <tooltip-assigned-slot-host>
            <sl-button id="shadow-anchor" slot="actions" aria-describedby="tooltip"
              >Shadow anchor</sl-button
            >
            <button id="native-anchor" aria-describedby="external-description tooltip">
              Native anchor
            </button>
          </tooltip-assigned-slot-host>
          <span id="external-description">External description</span>
          <sl-tooltip id="tooltip">Tooltip via assigned slot</sl-tooltip>
        </div>
      `);

      assignedSlotHost = el.querySelector('tooltip-assigned-slot-host') as TooltipAssignedSlotHost;
      shadowAnchor = el.querySelector('#shadow-anchor') as Button;
      nativeAnchor = el.querySelector('#native-anchor') as HTMLButtonElement;
      externalDescription = el.querySelector('#external-description') as HTMLElement;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
    });

    it('should move back into the current anchor tree when reparenting is not allowed', async () => {
      shadowAnchor.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.getRootNode()).to.equal(assignedSlotHost.shadowRoot);

      shadowAnchor.dispatchEvent(new Event('pointerout', { bubbles: true, composed: true }));
      nativeAnchor.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(tooltip.getRootNode()).to.equal(nativeAnchor.getRootNode());
      expect(tooltip.previousElementSibling).to.equal(nativeAnchor);
      expect(Array.from(nativeAnchor.ariaDescribedByElements ?? [])).to.include.members([
        externalDescription,
        tooltip
      ]);
    });
  });

  describe('Tooltip lazy()', () => {
    let el: HTMLElement, button: Button, innerButton: HTMLButtonElement, tooltip: Tooltip;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button>Button</sl-button>
        </div>
      `);

      button = el.querySelector('sl-button')!;
      innerButton = button.renderRoot.querySelector('button')!;
    });

    it('should create a tooltip lazily on pointerover with default aria-describedby', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip));

      button.dispatchEvent(new Event('pointerover', { bubbles: true }));

      await tooltip.updateComplete;

      expect(tooltip).to.exist;
      expect(tooltip!.id).to.match(/sl-tooltip-(\d+)/);

      const describedBy = button.getAttribute('aria-describedby'),
        describedByElements = button.ariaDescribedByElements ?? [],
        proxyTarget = (
          button as HTMLElement & { getProxyTarget?(): Element | null }
        ).getProxyTarget?.(),
        proxyDescribedBy =
          proxyTarget instanceof Element ? proxyTarget.getAttribute('aria-describedby') : null,
        proxyDescribedByElements =
          proxyTarget instanceof Element && 'ariaDescribedByElements' in proxyTarget
            ? (proxyTarget.ariaDescribedByElements ?? [])
            : [],
        hasAriaDescribedBy =
          describedBy?.split(/\s+/).includes(tooltip!.id) === true ||
          describedByElements.includes(tooltip);

      expect(
        hasAriaDescribedBy ||
          proxyDescribedBy?.split(/\s+/).includes(tooltip!.id) === true ||
          proxyDescribedByElements.includes(tooltip)
      ).to.be.true;
      expect(button.hasAttribute('aria-labelledby')).to.be.false;

      await waitFor(Tooltip.hoverShowDelay + 10);
      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(innerButton.ariaDescribedByElements).to.include(tooltip);
      expect(innerButton.ariaLabelledByElements).to.be.null;
    });

    it('should keep pending hover show timer cancellable after unrelated focusout', async () => {
      Tooltip.lazy(button, createdTooltip => {
        tooltip = createdTooltip;
      });

      button?.dispatchEvent(new Event('pointerover', { bubbles: true }));
      expect(tooltip).to.exist;

      const other = document.createElement('input');
      el.appendChild(other);
      other.dispatchEvent(new Event('focusout', { bubbles: true, composed: true }));

      button?.dispatchEvent(new Event('pointerout', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 50);

      expect(tooltip.matches(':popover-open')).to.be.false;
    });

    it('should reopen on repeated hover for a button that forwards ARIA to an inner control', async () => {
      Tooltip.lazy(button, createdTooltip => {
        tooltip = createdTooltip;
      });

      button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(innerButton.ariaDescribedByElements).to.include(tooltip);

      innerButton.dispatchEvent(new Event('pointerout', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.false;

      innerButton.dispatchEvent(new Event('pointerover', { bubbles: true, composed: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverShowDelay + 10);

      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(innerButton.ariaDescribedByElements).to.include(tooltip);
    });

    it('should create a tooltip lazily on focusin', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip));

      button.focus();

      await tooltip.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await tooltip.updateComplete;

      expect(tooltip).to.exist;
      expect(tooltip.matches(':popover-open')).to.be.true;
      expect(innerButton.ariaDescribedByElements).to.include(tooltip);
    });

    it('should use aria-labelledby when ariaRelation is label', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip), { ariaRelation: 'label' });

      button.dispatchEvent(new Event('pointerover', { bubbles: true }));

      await tooltip.updateComplete;

      expect(tooltip).to.exist;
      expect(innerButton.ariaDescribedByElements).to.be.null;
      expect(innerButton.ariaLabelledByElements).to.include(tooltip);
    });

    it('should only create the tooltip once', async () => {
      Tooltip.lazy(button, createdTooltip => (tooltip = createdTooltip));

      button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      button.dispatchEvent(new Event('pointerover', { bubbles: true })); // second should be ignored

      await tooltip.updateComplete;

      expect(el.querySelectorAll('sl-tooltip')).to.have.lengthOf(1);
      expect(tooltip).to.exist;
    });
  });

  describe('delay semantics', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button aria-describedby="tooltip">Button</sl-button>
          <sl-tooltip id="tooltip">Tooltip</sl-tooltip>
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
      tooltip = el.querySelector('sl-tooltip') as Tooltip;
    });

    it('should stay closed before the fixed hover show delay elapses', async () => {
      button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, Tooltip.hoverShowDelay - 100));
      expect(tooltip.matches(':popover-open')).to.be.false;

      await new Promise(resolve => setTimeout(resolve, 150));
      expect(tooltip.matches(':popover-open')).to.be.true;
    });

    it('should stay open before the fixed hover hide delay elapses', async () => {
      button.dispatchEvent(new Event('pointerover', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, Tooltip.hoverShowDelay + 10));
      expect(tooltip.matches(':popover-open')).to.be.true;

      button.dispatchEvent(new Event('pointerout', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, Tooltip.hoverHideDelay - 50));
      expect(tooltip.matches(':popover-open')).to.be.true;

      await new Promise(resolve => setTimeout(resolve, 100));
      expect(tooltip.matches(':popover-open')).to.be.false;
    });
  });
});
