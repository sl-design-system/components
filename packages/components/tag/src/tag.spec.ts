import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { type Tag } from './tag.js';

describe('sl-tag', () => {
  let el: Tag;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tag>My label</sl-tag>`);
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should have a size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not have an explicit variant', () => {
      expect(el).not.to.have.attribute('variant');
      expect(el.variant).to.be.undefined;
    });

    it('should have a variant when set', async () => {
      el.variant = 'info';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'info');
    });

    it('should not be removable', () => {
      expect(el.removable).not.to.be.true;
      expect(el.renderRoot.querySelector('button')).not.to.exist;
    });

    it('should be removable when set', async () => {
      el.removable = true;
      await el.updateComplete;

      expect(el).to.have.attribute('removable');
      expect(el.renderRoot.querySelector('button')).to.exist;
    });

    it('should not have a tooltip', async () => {
      el.focus();
      await el.updateComplete;

      expect(el.renderRoot.querySelector('[part="label"]')?.hasAttribute('aria-describedby')).to.be
        .false;
      expect(el.renderRoot.querySelector('sl-tooltip')).not.to.exist;
    });

    it('should not be focusable', async () => {
      el.focus();
      await el.updateComplete;

      expect(el).not.to.match(':focus');
      expect(el).not.to.match(':state(focus-visible)');
    });

    it('should show a focus ring when the host itself is focus-visible', async () => {
      const tag = await fixture<Tag>(html`
        <sl-tag
          style="--sl-color-border-focused: rgb(1, 2, 3); --sl-size-borderWidth-focusRing: 3px"
          tabindex="0">
          My label
        </sl-tag>
      `);

      tag.focus({ focusVisible: true } as FocusOptions);
      expect(document.activeElement).to.equal(tag);
      expect(tag.shadowRoot?.activeElement).to.equal(
        tag.renderRoot.querySelector('[part="label"]')
      );
      expect(tag).to.match(':state(focus-visible)');
      expect(getComputedStyle(tag).outlineColor).to.equal('rgb(1, 2, 3)');
      expect(getComputedStyle(tag).outlineOffset).to.equal('-3px');
    });

    it('should respect the host tabindex on the label wrapper', async () => {
      const tag = await fixture<Tag>(html`<sl-tag tabindex="-1">My label</sl-tag>`);

      expect(tag.renderRoot.querySelector('[part="label"]')).to.have.attribute('tabindex', '-1');
    });
  });

  describe('removable', () => {
    let button: HTMLButtonElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-tag removable>My label</sl-tag>`);
      button = el.renderRoot.querySelector('button')!;
    });

    it('should not have the focus-visible state', () => {
      expect(el).not.to.match(':state(focus-visible)');
    });

    it('should have the focus-visible state when focused', async () => {
      el.focus();
      await el.updateComplete;

      expect(el).to.match(':state(focus-visible)');
    });

    it('should not set the focus-visible state when the focused element does not match :focus-visible', async () => {
      button.dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;

      expect(el).not.to.match(':state(focus-visible)');
    });

    it('should have a button', () => {
      expect(button).to.exist;
      expect(button).to.have.attribute('type', 'button');
    });

    it('should focus the button when the tag is focused', async () => {
      el.focus();
      await el.updateComplete;

      expect(button).to.match(':focus');
    });

    it('should focus the remove button when tabbing to the tag', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
          <div>
            <button>Before</button>
            <sl-tag removable>My label</sl-tag>
          </div>
        `),
        before = wrapper.querySelector('button')!,
        tag = wrapper.querySelector('sl-tag')!,
        removeButton = tag.renderRoot.querySelector('button')!;

      before.focus();
      await userEvent.tab();

      expect(document.activeElement).to.equal(tag);
      expect(tag.shadowRoot?.activeElement).to.equal(removeButton);
    });

    it('should respect the host tabindex on the remove button', async () => {
      el = await fixture(html`<sl-tag removable tabindex="-1">My label</sl-tag>`);
      button = el.renderRoot.querySelector('button')!;

      expect(button).to.have.attribute('tabindex', '-1');
    });

    it('should have an accessible label on the remove button', () => {
      expect(button).to.have.attribute('aria-label', "Remove tag 'My label'");
    });

    it('should derive the accessible label from slotted element text', async () => {
      el = await fixture(html`<sl-tag removable><span>My label</span></sl-tag>`);
      button = el.renderRoot.querySelector('button')!;

      expect(button).to.have.attribute('aria-label', "Remove tag 'My label'");
    });

    it('should mark the button as aria-disabled when the tag is disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(button).to.have.attribute('aria-disabled', 'true');
    });

    it('should not be removed when it is disabled and remove button is clicked', async () => {
      const onRemove = spy(el, 'remove');

      el.disabled = true;
      await el.updateComplete;

      button.click();
      await el.updateComplete;

      expect(onRemove).not.to.have.been.called;
    });

    it('should not be removed when the label is clicked', async () => {
      const onRemove = spy(el, 'remove'),
        label = el.renderRoot.querySelector<HTMLElement>('[part="label"]')!;

      label.click();
      await el.updateComplete;

      expect(onRemove).not.to.have.been.called;
    });

    it('should be removed when the button is clicked using the keyboard', async () => {
      const onRemove = spy(el, 'remove');

      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(onRemove).to.have.been.calledOnce;
    });

    it('should be removed when the backspace key is pressed', async () => {
      const onRemove = spy(el, 'remove');

      el.focus();
      await userEvent.keyboard('{Backspace}');

      expect(onRemove).to.have.been.calledOnce;
    });

    it('should be removed when the delete key is pressed', async () => {
      const onRemove = spy(el, 'remove');

      el.focus();
      await userEvent.keyboard('{Delete}');

      expect(onRemove).to.have.been.calledOnce;
    });

    it('should prevent backspace and delete key events from leaking', () => {
      const onKeydown = spy();

      el.addEventListener('keydown', onKeydown);

      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        composed: true,
        key: 'Backspace'
      });

      button.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
      expect(onKeydown).not.to.have.been.called;
    });

    it('should emit an sl-remove event when a remove button is clicked', async () => {
      const onRemove = spy();

      el.addEventListener('sl-remove', onRemove);
      button.click();
      await el.updateComplete;

      expect(onRemove).to.have.been.calledOnce;
    });
  });

  describe('overflow', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-tag removable style="inline-size: 50px">My label is very long</sl-tag>`
      );

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have a tooltip when the label is too long', async () => {
      el.focus();
      await el.updateComplete;

      const label = el.renderRoot.querySelector('[part="label"]')!,
        button = el.renderRoot.querySelector('button')!;

      expect(label).to.have.attribute('aria-describedby');
      expect(button).to.have.attribute('aria-describedby', 'tooltip');

      const tooltip = el.renderRoot.querySelector('sl-tooltip');
      expect(tooltip).to.exist;
      expect(tooltip).to.have.trimmed.text('My label is very long');
    });

    it('should include both the tooltip and navigation description on the remove button', async () => {
      el.navigationDescription = 'Use arrow keys to move between removable tags.';
      await el.updateComplete;

      const button = el.renderRoot.querySelector('button')!;
      expect(button).to.have.attribute('aria-describedby', 'tooltip navigation-description');
    });

    it('should update the tooltip when the label changes without resizing', async () => {
      expect(el.renderRoot.querySelector('sl-tooltip')).to.exist;

      const label = el.renderRoot.querySelector('[part="label"]')!;
      Object.defineProperties(label, {
        clientWidth: { configurable: true, get: () => 100 },
        scrollWidth: {
          configurable: true,
          get: () => (el.textContent?.trim() === 'A' ? 50 : 150)
        }
      });

      el.textContent = 'A';
      await new Promise(resolve => setTimeout(resolve, 0));
      await el.updateComplete;
      await el.updateComplete;

      expect(label.hasAttribute('aria-describedby')).to.be.false;
      expect(el.renderRoot.querySelector('sl-tooltip')).not.to.exist;
    });
  });

  describe('tooltip property', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tag>My label</sl-tag>`);
    });

    it('should show a tooltip with the given text when set to a string', async () => {
      el.tooltip = 'Custom tooltip';
      await el.updateComplete;

      const label = el.renderRoot.querySelector('[part="label"]'),
        tooltip = el.renderRoot.querySelector('sl-tooltip');

      expect(tooltip).to.exist;
      expect(tooltip).to.have.trimmed.text('Custom tooltip');
      expect(label).to.have.attribute('aria-describedby', 'tooltip');
    });

    it('should be focusable when a string tooltip is set', async () => {
      el.tooltip = 'Custom tooltip';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('[part="label"]')).to.have.attribute('tabindex', '0');
    });

    it('should not override an explicit string tooltip based on truncation', async () => {
      el.tooltip = 'Custom tooltip';
      await el.updateComplete;

      // Give the resize observer time to run; it must not clear the explicit tooltip
      // even though the label is not truncated.
      await new Promise(resolve => setTimeout(resolve, 50));
      await el.updateComplete;

      const tooltip = el.renderRoot.querySelector('sl-tooltip');

      expect(tooltip).to.exist;
      expect(tooltip).to.have.trimmed.text('Custom tooltip');
      expect(el.tooltip).to.equal('Custom tooltip');
    });
  });
});
