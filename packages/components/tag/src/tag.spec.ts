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

      expect(el).not.to.have.attribute('aria-describedby');
    });

    it('should not be focusable', async () => {
      el.focus();
      await el.updateComplete;

      expect(el).not.to.match(':focus');
      expect(el).not.to.match(':state(focus-visible)');
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

    it('should have a button', () => {
      expect(button).to.exist;
    });

    it('should focus the button when the tag is focused', async () => {
      el.focus();
      await el.updateComplete;

      expect(button).to.match(':focus');
    });

    it('should have an accessible label on the remove button', () => {
      expect(button).to.have.attribute('aria-label', "Remove tag 'My label'");
    });

    it('should mark the button as aria-disabled when the tag is disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(button).to.have.attribute('aria-disabled', 'true');
    });

    it('should not be be removed when it is disabled and remove button is clicked', async () => {
      const onRemove = spy(el, 'remove');

      el.disabled = true;
      await el.updateComplete;

      button.click();
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
      el = await fixture(html`<sl-tag removable style="inline-size: 50px">My label is very long</sl-tag>`);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have a tooltip when the label is too long', async () => {
      el.focus();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-describedby');

      const tooltip = document.getElementById(el.getAttribute('aria-describedby')!);
      expect(tooltip).to.exist;
      expect(tooltip).to.have.trimmed.text('My label is very long');
    });
  });
});
