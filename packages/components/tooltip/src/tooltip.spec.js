import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Tooltip } from './tooltip.js';
class DelegatingAnchor extends LitElement {
  static {
    this.shadowRootOptions = {
      ...LitElement.shadowRootOptions,
      delegatesFocus: true
    };
  }
  render() {
    return html`<button type="button">Anchor</button>`;
  }
}
try {
  customElements.define('delegating-anchor', DelegatingAnchor);
} catch {}
describe('sl-tooltip', () => {
  let el, anchor, tooltip;
  const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms));
  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="btn" type="button">Anchor</button>
          <sl-tooltip for="btn">Tooltip text</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#btn');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should have aria-hidden="true"', () => {
      expect(tooltip).to.have.attribute('aria-hidden', 'true');
    });
    it('should have popover="manual"', () => {
      expect(tooltip).to.have.attribute('popover', 'manual');
    });
    it('should have role="tooltip"', () => {
      expect(tooltip).to.have.attribute('role', 'tooltip');
    });
    it('should have an auto-generated id', () => {
      expect(tooltip.id).to.match(/^sl-tooltip-\d+$/);
    });
    it('should not be open by default', () => {
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should have a hover-bridge part element', () => {
      expect(tooltip.renderRoot.querySelector('[part="hover-bridge"]')).to.exist;
    });
    it('should default trigger to "focus hover"', () => {
      expect(tooltip.trigger).to.equal('focus hover');
    });
    it('should assign slotted text to the default slot', () => {
      const text = tooltip.renderRoot
        .querySelector('slot')
        ?.assignedNodes({ flatten: true })
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent)
        .join();
      expect(text).to.equal('Tooltip text');
    });
  });
  describe('anchor binding', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="anchor" type="button">Anchor</button>
          <sl-tooltip for="anchor" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should bind to the anchor element referenced by the "for" attribute', () => {
      expect(tooltip.anchor).to.equal(anchor);
    });
    it('should set ariaDescribedByElements on the anchor', () => {
      expect(anchor.ariaDescribedByElements).to.include(tooltip);
    });
    it('should set anchor-name on the anchor', () => {
      expect(anchor.style.anchorName).to.equal(`--${tooltip.id}`);
    });
    it('should set position-anchor on the tooltip', () => {
      expect(tooltip.style.positionAnchor).to.equal(`--${tooltip.id}`);
    });
    it('should clear the anchor when "for" is removed', async () => {
      tooltip.removeAttribute('for');
      await tooltip.updateComplete;
      expect(tooltip.anchor).to.be.undefined;
    });
    it('should clear the ARIA relation when "for" is removed', async () => {
      tooltip.removeAttribute('for');
      await tooltip.updateComplete;
      expect(anchor.ariaDescribedByElements ?? []).not.to.include(tooltip);
    });
    it('should clear anchor-name and position-anchor when "for" is removed', async () => {
      tooltip.removeAttribute('for');
      await tooltip.updateComplete;
      expect(anchor.style.anchorName).to.equal('');
      expect(tooltip.style.positionAnchor).to.equal('');
    });
    it('should rebind to the new anchor when "for" changes', async () => {
      const newEl = await fixture(html`
        <div>
          <button id="first" type="button">First</button>
          <button id="second" type="button">Second</button>
          <sl-tooltip for="first" type="description">Tip</sl-tooltip>
        </div>
      `);
      const first = newEl.querySelector('#first');
      const second = newEl.querySelector('#second');
      const tip = newEl.querySelector('sl-tooltip');
      await tip.updateComplete;
      tip.setAttribute('for', 'second');
      await tip.updateComplete;
      expect(tip.anchor).to.equal(second);
      expect(first.style.anchorName).to.equal('');
      expect(first.ariaDescribedByElements ?? []).not.to.include(tip);
      expect(second.style.anchorName).to.equal(`--${tip.id}`);
      expect(second.ariaDescribedByElements).to.include(tip);
      expect(tip.style.positionAnchor).to.equal(`--${tip.id}`);
    });
    it('should not overwrite an existing anchor-name on the anchor', async () => {
      const newEl = await fixture(html`
        <div>
          <button id="pre-named" type="button" style="anchor-name: --my-anchor">Anchor</button>
          <sl-tooltip for="pre-named">Tip</sl-tooltip>
        </div>
      `);
      const preNamed = newEl.querySelector('#pre-named');
      const tip = newEl.querySelector('sl-tooltip');
      await tip.updateComplete;
      expect(preNamed.style.anchorName).to.equal('--my-anchor');
      expect(tip.style.positionAnchor).to.equal('--my-anchor');
    });
    it('should keep an existing anchor-name on the anchor when "for" is removed', async () => {
      const newEl = await fixture(html`
        <div>
          <button id="keep-named" type="button" style="anchor-name: --my-anchor">Anchor</button>
          <sl-tooltip for="keep-named">Tip</sl-tooltip>
        </div>
      `);
      const keepNamed = newEl.querySelector('#keep-named');
      const tip = newEl.querySelector('sl-tooltip');
      await tip.updateComplete;
      tip.removeAttribute('for');
      await tip.updateComplete;
      expect(keepNamed.style.anchorName).to.equal('--my-anchor');
      expect(tip.style.positionAnchor).to.equal('');
    });
    it('should remove the ARIA relation when disconnected', async () => {
      tooltip.remove();
      await tooltip.updateComplete;
      expect(anchor.ariaDescribedByElements ?? []).not.to.include(tooltip);
    });
  });
  describe('multiple anchors', () => {
    let first, second;
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="multi-1" type="button">First</button>
          <button id="multi-2" type="button">Second</button>
          <sl-tooltip for="multi-1 multi-2" type="description">Tip</sl-tooltip>
        </div>
      `);
      first = el.querySelector('#multi-1');
      second = el.querySelector('#multi-2');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    afterEach(() => {
      vi.useRealTimers();
    });
    it('should bind to every element referenced by "for"', () => {
      expect(tooltip.anchors).to.deep.equal([first, second]);
    });
    it('should set the ARIA relation on every anchor', () => {
      expect(first.ariaDescribedByElements).to.include(tooltip);
      expect(second.ariaDescribedByElements).to.include(tooltip);
    });
    it('should position against the first anchor by default', () => {
      expect(tooltip.anchor).to.equal(first);
      expect(first.style.anchorName).to.equal(`--${tooltip.id}`);
      expect(tooltip.style.positionAnchor).to.equal(`--${tooltip.id}`);
    });
    it('should ignore extra whitespace and duplicate ids', async () => {
      tooltip.setAttribute('for', '  multi-2   multi-1  multi-2 ');
      await tooltip.updateComplete;
      expect(tooltip.anchors).to.deep.equal([second, first]);
    });
    it('should show the tooltip when hovering any anchor', async () => {
      vi.useFakeTimers();
      second.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(Tooltip.hoverShowDelay + 10);
      expect(tooltip).to.match(':popover-open');
    });
    it('should reposition to the anchor that triggered it', async () => {
      vi.useFakeTimers();
      second.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(Tooltip.hoverShowDelay + 10);
      expect(tooltip.anchor).to.equal(second);
      expect(second.style.anchorName).to.equal(`--${tooltip.id}`);
      expect(tooltip.style.positionAnchor).to.equal(`--${tooltip.id}`);
      expect(first.style.anchorName).to.equal('');
    });
    it('should not hide the tooltip when moving between anchors', async () => {
      vi.useFakeTimers();
      first.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(Tooltip.hoverShowDelay + 10);
      first.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: second }));
      await vi.advanceTimersByTimeAsync(Tooltip.hoverHideDelay + 10);
      expect(tooltip).to.match(':popover-open');
    });
    it('should clean up anchors that are no longer referenced', async () => {
      tooltip.setAttribute('for', 'multi-1');
      await tooltip.updateComplete;
      expect(tooltip.anchors).to.deep.equal([first]);
      expect(second.ariaDescribedByElements ?? []).not.to.include(tooltip);
      expect(second.style.anchorName).to.equal('');
    });
    it('should remove the ARIA relation from every anchor when disconnected', async () => {
      tooltip.remove();
      await tooltip.updateComplete;
      expect(first.ariaDescribedByElements ?? []).not.to.include(tooltip);
      expect(second.ariaDescribedByElements ?? []).not.to.include(tooltip);
    });
    it('should remove the ARIA relation from every anchor when disabled', async () => {
      tooltip.disabled = true;
      await tooltip.updateComplete;
      expect(first.ariaDescribedByElements ?? []).not.to.include(tooltip);
      expect(second.ariaDescribedByElements ?? []).not.to.include(tooltip);
    });
    it('should move the ARIA relation on every anchor when the type changes', async () => {
      tooltip.type = 'label';
      await tooltip.updateComplete;
      expect(first.ariaDescribedByElements ?? []).not.to.include(tooltip);
      expect(second.ariaDescribedByElements ?? []).not.to.include(tooltip);
      expect(first.ariaLabelledByElements).to.include(tooltip);
      expect(second.ariaLabelledByElements).to.include(tooltip);
    });
  });
  describe('type', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="t-anchor" type="button">Anchor</button>
          <sl-tooltip for="t-anchor">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#t-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should use ariaLabelledByElements by default', () => {
      expect(anchor.ariaLabelledByElements).to.include(tooltip);
      expect(anchor.ariaDescribedByElements ?? []).not.to.include(tooltip);
    });
    it('should use ariaLabelledByElements when type is "label"', async () => {
      tooltip.type = 'label';
      await tooltip.updateComplete;
      expect(anchor.ariaLabelledByElements).to.include(tooltip);
      expect(anchor.ariaDescribedByElements ?? []).not.to.include(tooltip);
    });
    it('should use ariaDescribedByElements when type is "description"', async () => {
      tooltip.type = 'description';
      await tooltip.updateComplete;
      expect(anchor.ariaDescribedByElements ?? []).to.include(tooltip);
      expect(anchor.ariaLabelledByElements ?? []).not.to.include(tooltip);
    });
    it('should not touch the anchor aria-labelledby when initialized with type "description"', async () => {
      const el2 = await fixture(html`
        <div>
          <span id="t-label">Label</span>
          <button aria-labelledby="t-label" id="t-anchor-2" type="button">Anchor</button>
          <sl-tooltip for="t-anchor-2" type="description">Tip</sl-tooltip>
        </div>
      `);
      const anchor2 = el2.querySelector('#t-anchor-2');
      await el2.querySelector('sl-tooltip').updateComplete;
      expect(anchor2).to.have.attribute('aria-labelledby', 't-label');
    });
  });
  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="d-anchor" type="button">Anchor</button>
          <sl-tooltip for="d-anchor" disabled type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#d-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should not open when disabled and mouseover is dispatched', async () => {
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should close when disabled while open', async () => {
      tooltip.disabled = false;
      await tooltip.updateComplete;
      tooltip.showPopover();
      expect(tooltip).to.match(':popover-open');
      tooltip.disabled = true;
      await tooltip.updateComplete;
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should add/remove ariaDescribedByElements reference when enabled/disabled', async () => {
      expect(anchor.ariaDescribedByElements ?? []).not.to.include(tooltip);
      tooltip.disabled = false;
      await tooltip.updateComplete;
      expect(anchor.ariaDescribedByElements ?? []).to.include(tooltip);
      tooltip.disabled = true;
      await tooltip.updateComplete;
      expect(anchor.ariaDescribedByElements ?? []).not.to.include(tooltip);
    });
  });
  describe('open property', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="o-anchor" type="button">Anchor</button>
          <sl-tooltip for="o-anchor" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#o-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should show the tooltip when open is set to true', async () => {
      tooltip.open = true;
      await tooltip.updateComplete;
      expect(tooltip).to.match(':popover-open');
    });
    it('should hide the tooltip when open is set to false after being shown', async () => {
      tooltip.open = true;
      await tooltip.updateComplete;
      tooltip.open = false;
      await tooltip.updateComplete;
      expect(tooltip).not.to.match(':popover-open');
    });
  });
  describe('hover trigger', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="h-anchor" type="button">Anchor</button>
          <sl-tooltip for="h-anchor" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#h-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should show the tooltip after hovering the anchor', async () => {
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);
      expect(tooltip).to.match(':popover-open');
    });
    it('should not show the tooltip before the hover delay elapses', async () => {
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Math.max(0, Tooltip.hoverShowDelay - 10));
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should hide the tooltip when mousing out of the anchor', async () => {
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);
      anchor.dispatchEvent(new Event('mouseout', { bubbles: true }));
      await tooltip.updateComplete;
      await waitFor(Tooltip.hoverHideDelay + 10);
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should not show when trigger does not include hover', async () => {
      tooltip.trigger = 'focus';
      await tooltip.updateComplete;
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);
      expect(tooltip).not.to.match(':popover-open');
    });
  });
  describe('focus trigger', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="f-anchor" type="button">Anchor</button>
          <sl-tooltip for="f-anchor" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#f-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should show the tooltip on focus (when :focus-visible)', async () => {
      await userEvent.tab();
      await tooltip.updateComplete;
      expect(tooltip).to.match(':popover-open');
    });
    it('should not show the tooltip when the anchor is focused programmatically', async () => {
      tooltip.trigger = 'focus';
      await tooltip.updateComplete;
      await userEvent.click(anchor);
      anchor.blur();
      await tooltip.updateComplete;
      anchor.focus();
      await tooltip.updateComplete;
      expect(document.activeElement).to.equal(anchor);
      expect(anchor).not.to.match(':focus-visible');
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should set the active anchor when the anchor is focused programmatically', async () => {
      tooltip.trigger = 'focus';
      await tooltip.updateComplete;
      await userEvent.click(anchor);
      anchor.blur();
      await tooltip.updateComplete;
      anchor.focus();
      await tooltip.updateComplete;
      expect(tooltip.anchor).to.equal(anchor);
    });
    it('should hide the tooltip on blur', async () => {
      await userEvent.tab();
      await tooltip.updateComplete;
      anchor.blur();
      await tooltip.updateComplete;
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should not show when trigger does not include focus', async () => {
      tooltip.trigger = 'hover';
      await tooltip.updateComplete;
      await userEvent.tab();
      await tooltip.updateComplete;
      expect(tooltip).not.to.match(':popover-open');
    });
  });
  describe('focus trigger with an anchor that delegates focus', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <delegating-anchor id="d-anchor"></delegating-anchor>
          <sl-tooltip for="d-anchor" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('delegating-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should show the tooltip when the anchor is tabbed to', async () => {
      await userEvent.tab();
      await tooltip.updateComplete;
      expect(tooltip).to.match(':popover-open');
    });
  });
  describe('click trigger', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="c-anchor" type="button">Anchor</button>
          <sl-tooltip for="c-anchor" trigger="click" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#c-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should show the tooltip on click', async () => {
      anchor.dispatchEvent(new Event('click', { bubbles: true }));
      await tooltip.updateComplete;
      expect(tooltip).to.match(':popover-open');
    });
    it('should hide the tooltip on a second click', async () => {
      anchor.dispatchEvent(new Event('click', { bubbles: true }));
      await tooltip.updateComplete;
      anchor.dispatchEvent(new Event('click', { bubbles: true }));
      await tooltip.updateComplete;
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should hide the tooltip when clicking the anchor while a hover-triggered open is active', async () => {
      tooltip.showPopover();
      anchor.dispatchEvent(new Event('click', { bubbles: true }));
      await tooltip.updateComplete;
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should not propagate clicks on the tooltip itself', () => {
      const onClick = spy();
      el.addEventListener('click', onClick);
      tooltip.click();
      expect(onClick).not.to.have.been.called;
    });
  });
  describe('manual trigger', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="m-anchor" type="button">Anchor</button>
          <sl-tooltip for="m-anchor" trigger="manual" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#m-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    it('should not show on hover', async () => {
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 10);
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should not show on focus', async () => {
      await userEvent.tab();
      await tooltip.updateComplete;
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should show when showPopover is called programmatically', () => {
      tooltip.showPopover();
      expect(tooltip).to.match(':popover-open');
    });
  });
  describe('keyboard', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <button id="k-anchor" type="button">Anchor</button>
          <sl-tooltip for="k-anchor" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#k-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
      tooltip.showPopover();
    });
    it('should hide the tooltip when pressing Escape', async () => {
      await userEvent.keyboard('{Escape}');
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should stop propagation of the Escape keydown event', async () => {
      const onKeydown = spy();
      anchor.addEventListener('keydown', onKeydown);
      anchor.focus();
      await userEvent.keyboard('{Escape}');
      expect(onKeydown).to.not.have.been.called;
    });
  });
  describe('delay (fake timers)', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
      el = await fixture(html`
        <div>
          <button id="delay-anchor" type="button">Anchor</button>
          <sl-tooltip for="delay-anchor" type="description">Tip</sl-tooltip>
        </div>
      `);
      anchor = el.querySelector('#delay-anchor');
      tooltip = el.querySelector('sl-tooltip');
      await tooltip.updateComplete;
    });
    afterEach(() => {
      vi.useRealTimers();
    });
    it('should stay closed before the hover show delay elapses', async () => {
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(Math.max(0, Tooltip.hoverShowDelay - 10));
      expect(tooltip).not.to.match(':popover-open');
    });
    it('should open after the hover show delay elapses', async () => {
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(Tooltip.hoverShowDelay + 10);
      expect(tooltip).to.match(':popover-open');
    });
    it('should cancel pending show when mouse leaves before delay elapses', async () => {
      anchor.dispatchEvent(new Event('mouseover', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(Tooltip.hoverShowDelay - 10);
      anchor.dispatchEvent(new Event('mouseout', { bubbles: true }));
      await vi.advanceTimersByTimeAsync(Tooltip.hoverShowDelay + 100);
      expect(tooltip).not.to.match(':popover-open');
    });
  });
});
//# sourceMappingURL=tooltip.spec.js.map
