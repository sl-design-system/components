import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { Tooltip } from './tooltip.js';

describe('sl-tooltip shared', () => {
  let el: HTMLElement;
  let buttons: Button[];
  let tooltip: Tooltip;

  const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  beforeEach(async () => {
    el = await fixture(html`
      <div style="display: flex; gap: 8px;">
        <sl-button id="btn1" aria-describedby="tooltip">Button 1</sl-button>
        <sl-button id="btn2" aria-describedby="tooltip">Button 2</sl-button>
        <sl-tooltip id="tooltip" show-delay="150" hide-delay="0">Shared Tooltip</sl-tooltip>
      </div>
    `);
    buttons = Array.from(el.querySelectorAll('sl-button'));
    tooltip = el.querySelector('sl-tooltip') as Tooltip;
  });

  it('should not stay open when moving rapidly between buttons and then out', async () => {
    // 1. Hover first button
    buttons[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await waitFor((tooltip.showDelay ?? 150) + (tooltip.hideDelay ?? 0) + 50);

    expect(tooltip).to.match(':popover-open');
    expect(tooltip.anchorElement).to.equal(buttons[0]);

    // 2. Move rapidly to second button (wait less than showDelay)
    // Dispatch pointerout on 0 and pointerover on 1 simultaneously (same tick)
    buttons[0].dispatchEvent(new Event('pointerout', { bubbles: true }));
    buttons[1].dispatchEvent(new Event('pointerover', { bubbles: true }));

    // 3. Immediately move out of second button (same tick or very next)
    buttons[1].dispatchEvent(new Event('pointerout', { bubbles: true }));

    // Wait for any pending timers (showDelay + hideDelay + buffer)
    await tooltip.updateComplete;
    await waitFor((tooltip.showDelay ?? 150) + (tooltip.hideDelay ?? 0) + 50);

    // The tooltip should be closed.
    expect(tooltip).not.to.match(':popover-open');
  });

  it('should hide even if multiple pointerover events are fired for different buttons', async () => {
    // Hover btn 1
    buttons[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await waitFor((tooltip.showDelay ?? 150) + (tooltip.hideDelay ?? 0) + 50);

    expect(tooltip).to.match(':popover-open');

    // Pointerover btn 2 (clears btn 1 hide timer if it existed, but here we are already open)
    // This clears the btn 1 "show" timer (already done) and starts btn 2 "show" timer.
    buttons[1].dispatchEvent(new Event('pointerover', { bubbles: true }));

    // Now move out of BOTH (simulated jump out)
    buttons[0].dispatchEvent(new Event('pointerout', { bubbles: true }));
    buttons[1].dispatchEvent(new Event('pointerout', { bubbles: true }));

    await tooltip.updateComplete;
    await waitFor((tooltip.showDelay ?? 150) + (tooltip.hideDelay ?? 0) + 50);
    await waitFor((tooltip.showDelay ?? 150) + (tooltip.hideDelay ?? 0) + 50);
    expect(tooltip).not.to.match(':popover-open');
  });

  it('should update anchor immediately when moving between buttons while open', async () => {
    // 1. Hover first button and wait for it to open
    buttons[0].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await waitFor((tooltip.showDelay ?? 150) + 50);
    expect(tooltip).to.match(':popover-open');
    expect(tooltip.anchorElement).to.equal(buttons[0]);

    // 2. Move to second button
    // The anchor should update IMMEDIATELY without waiting for showDelay again
    buttons[1].dispatchEvent(new Event('pointerover', { bubbles: true }));
    await tooltip.updateComplete;

    expect(tooltip.anchorElement).to.equal(buttons[1]);
  });

  it('should update anchor immediately when tabbing between buttons', async () => {
    // 1. Focus first button and wait for it to open
    buttons[0].focus();
    await tooltip.updateComplete;
    await waitFor((tooltip.showDelay ?? 150) + 50);
    expect(tooltip).to.match(':popover-open');
    expect(tooltip.anchorElement).to.equal(buttons[0]);

    // 2. Focus second button
    // The anchor should update IMMEDIATELY (well, after focusin and rAF)
    buttons[1].focus();
    await tooltip.updateComplete;
    await new Promise(resolve => requestAnimationFrame(resolve));
    await tooltip.updateComplete;

    expect(tooltip.anchorElement).to.equal(buttons[1]);
  });
});
