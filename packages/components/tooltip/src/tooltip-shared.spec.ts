import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Tooltip } from './tooltip.js';

describe('sl-tooltip shared', () => {
  let el: HTMLElement;
  let buttons: Button[];
  let tooltip: Tooltip;

  const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const waitForPopoverToOpen = async (popover: HTMLElement, timeout = 1500): Promise<void> => {
    const startedAt = Date.now();

    while (!popover.matches(':popover-open') && Date.now() - startedAt < timeout) {
      await waitFor(25);
    }

    if (!popover.matches(':popover-open')) {
      const id = (popover as HTMLElement & { id?: string }).id;
      throw new Error(
        `Timed out after ${timeout}ms waiting for popover${id ? ` with id "${id}"` : ''} to open.`
      );
    }
  };

  const waitForPopoverToClose = async (popover: HTMLElement, timeout = 1000): Promise<void> => {
    const startedAt = Date.now();

    while (popover.matches(':popover-open') && Date.now() - startedAt < timeout) {
      await waitFor(25);
    }

    if (popover.matches(':popover-open')) {
      const id = (popover as HTMLElement & { id?: string }).id;
      throw new Error(
        `Timed out after ${timeout}ms waiting for popover${id ? ` with id "${id}"` : ''} to close.`
      );
    }
  };

  beforeEach(async () => {
    el = await fixture(html`
      <div style="display: flex; gap: 8px;">
        <sl-button id="btn1" aria-describedby="tooltip">Button 1</sl-button>
        <sl-button id="btn2" aria-describedby="tooltip">Button 2</sl-button>
        <sl-tooltip id="tooltip">Shared Tooltip</sl-tooltip>
      </div>
    `);
    buttons = Array.from(el.querySelectorAll('sl-button'));
    tooltip = el.querySelector('sl-tooltip') as Tooltip;
  });

  it('should not stay open when moving rapidly between buttons and then out', async () => {
    // 1. Hover first button
    buttons[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await waitForPopoverToOpen(tooltip);

    expect(tooltip.matches(':popover-open')).to.be.true;
    expect(tooltip.anchorElement).to.equal(buttons[0]);

    // 2. Move rapidly to second button (wait less than hover show delay)
    // Dispatch pointerout on 0 and pointerover on 1 simultaneously (same tick)
    buttons[0].dispatchEvent(new Event('pointerout', { bubbles: true }));
    buttons[1].dispatchEvent(new Event('pointerover', { bubbles: true }));

    // 3. Immediately move out of second button (same tick or very next)
    buttons[1].dispatchEvent(new Event('pointerout', { bubbles: true }));
    await userEvent.hover(document.body);

    // Wait for any pending timers/event queue work.
    await tooltip.updateComplete;
    await waitForPopoverToClose(tooltip, Tooltip.hoverShowDelay + Tooltip.hoverHideDelay + 250);

    // The tooltip should be closed.
    expect(tooltip.matches(':popover-open')).to.be.false;
  });

  it('should hide even if multiple pointerover events are fired for different buttons', async () => {
    // Hover btn 1
    buttons[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await waitForPopoverToOpen(tooltip);

    expect(tooltip.matches(':popover-open')).to.be.true;

    // Pointerover btn 2 while the tooltip is already open; this should switch/update the active anchor.
    // After pointerout from all anchors, the tooltip should still close.
    buttons[1].dispatchEvent(new Event('pointerover', { bubbles: true }));

    // Now move out of BOTH (simulated jump out)
    buttons[0].dispatchEvent(new Event('pointerout', { bubbles: true }));
    buttons[1].dispatchEvent(new Event('pointerout', { bubbles: true }));
    await userEvent.hover(document.body);

    await tooltip.updateComplete;
    await waitForPopoverToClose(tooltip, Tooltip.hoverShowDelay + Tooltip.hoverHideDelay + 250);
    expect(tooltip.matches(':popover-open')).to.be.false;
  });

  it('should update anchor immediately when moving between buttons while open', async () => {
    // 1. Hover first button and wait for it to open
    buttons[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await waitForPopoverToOpen(tooltip);
    expect(tooltip.matches(':popover-open')).to.be.true;
    expect(tooltip.anchorElement).to.equal(buttons[0]);
    const firstInsetInlineStart = tooltip.style.insetInlineStart;

    // 2. Move to second button
    // The anchor should update IMMEDIATELY without waiting for hover show delay again
    buttons[1].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await tooltip.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));

    expect(tooltip.anchorElement).to.equal(buttons[1]);
    expect(tooltip.style.insetInlineStart).not.to.equal(firstInsetInlineStart);
  });

  it('should update anchor immediately when tabbing between buttons', async () => {
    // 1. Focus first button and wait for it to open
    buttons[0].focus();
    await tooltip.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    await tooltip.updateComplete;
    expect(tooltip.matches(':popover-open')).to.be.true;
    expect(tooltip.anchorElement).to.equal(buttons[0]);

    // 2. Focus second button
    // The anchor should update IMMEDIATELY (well, after focusin and rAF)
    buttons[1].focus();
    await tooltip.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    await tooltip.updateComplete;

    expect(tooltip.anchorElement).to.equal(buttons[1]);
  });

  it('should move the anchor to the next shared button when tabbing in a button bar', async () => {
    const tabFixture = await fixture(html`
      <div>
        <sl-button-bar>
          <sl-button id="tab-btn-1" aria-describedby="tab-tooltip">Button 1</sl-button>
          <sl-button id="tab-btn-2" aria-describedby="tab-tooltip">Button 2</sl-button>
          <sl-button id="tab-btn-3" aria-describedby="tab-tooltip">Button 3</sl-button>
        </sl-button-bar>
        <sl-tooltip id="tab-tooltip">Shared Tooltip</sl-tooltip>
      </div>
    `);

    const tabButtons = Array.from(tabFixture.querySelectorAll<HTMLElement>('sl-button'));
    const tabTooltip = tabFixture.querySelector('sl-tooltip') as Tooltip;

    tabButtons[0].focus();
    await tabTooltip.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    await tabTooltip.updateComplete;

    expect(tabTooltip.matches(':popover-open')).to.be.true;
    expect(tabTooltip.anchorElement).to.equal(tabButtons[0]);

    await userEvent.tab();
    await tabTooltip.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    await tabTooltip.updateComplete;

    expect(tabTooltip.anchorElement).to.equal(tabButtons[1]);
  });

  it('should reopen on a different shared button in a button bar after closing', async () => {
    const sharedFixture = await fixture(html`
      <div>
        <sl-button-bar>
          <sl-button id="shared-btn-1" aria-describedby="shared-tooltip">Button 1</sl-button>
          <sl-button id="shared-btn-2" aria-describedby="shared-tooltip">Button 2</sl-button>
          <sl-button id="shared-btn-3" aria-describedby="shared-tooltip">Button 3</sl-button>
        </sl-button-bar>
        <sl-tooltip id="shared-tooltip">Shared Tooltip</sl-tooltip>
      </div>
    `);

    const sharedButtons = Array.from(sharedFixture.querySelectorAll<HTMLElement>('sl-button'));
    const sharedTooltip = sharedFixture.querySelector('sl-tooltip') as Tooltip;

    await userEvent.hover(sharedButtons[0]);
    await sharedTooltip.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    await waitFor(Tooltip.hoverShowDelay + 10);
    await sharedTooltip.updateComplete;

    expect(sharedTooltip.matches(':popover-open')).to.be.true;
    expect(sharedTooltip.anchorElement).to.equal(sharedButtons[0]);

    await userEvent.hover(document.body);
    await sharedTooltip.updateComplete;
    await waitForPopoverToClose(sharedTooltip, 250);
    expect(sharedTooltip.matches(':popover-open')).to.be.false;

    await userEvent.hover(sharedButtons[1]);
    await sharedTooltip.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    await waitFor(Tooltip.hoverShowDelay + 10);
    await sharedTooltip.updateComplete;

    expect(sharedTooltip.matches(':popover-open')).to.be.true;
    expect(sharedTooltip.anchorElement).to.equal(sharedButtons[1]);
  });

  it('should close after rapid pointer transitions for shared anchors connected via ElementInternals', async () => {
    const internalsFixture = await fixture(html`
      <div style="display: flex; gap: 8px;">
        <sl-button id="internals-btn-1">Button 1</sl-button>
        <sl-button id="internals-btn-2">Button 2</sl-button>
        <sl-tooltip id="internals-tooltip">Shared Tooltip</sl-tooltip>
      </div>
    `);

    const internalsButtons = Array.from(internalsFixture.querySelectorAll<Button>('sl-button'));
    const internalsTooltip = internalsFixture.querySelector('sl-tooltip') as Tooltip;

    if (internalsButtons[0].internals && internalsButtons[1].internals) {
      internalsButtons[0].internals.ariaDescribedByElements = [internalsTooltip];
      internalsButtons[1].internals.ariaDescribedByElements = [internalsTooltip];
    }

    internalsButtons[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await waitFor(Tooltip.hoverShowDelay + 50);
    expect(internalsTooltip.matches(':popover-open')).to.be.true;

    internalsButtons[0].dispatchEvent(new Event('pointerout', { bubbles: true }));
    internalsButtons[1].dispatchEvent(new Event('pointerover', { bubbles: true }));
    internalsButtons[1].dispatchEvent(new Event('pointerout', { bubbles: true }));
    await userEvent.hover(document.body);

    await internalsTooltip.updateComplete;
    await waitForPopoverToClose(
      internalsTooltip,
      Tooltip.hoverShowDelay + Tooltip.hoverHideDelay + 250
    );
    expect(internalsTooltip.matches(':popover-open')).to.be.false;
  });
});
