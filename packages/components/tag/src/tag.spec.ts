import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type Tag } from './tag.js';

describe('sl-tag', () => {
  let el: Tag;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tag>My label</sl-tag>`);
    });

    it('should not have an explicit', () => {
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

      expect(el.renderRoot.querySelector('button')).to.exist;
    });

    it('should not have a tabindex', () => {
      expect(el).not.to.have.attribute('tabindex');
    });

    it('should not have a tooltip', async () => {
      el.focus();
      await el.updateComplete;

      expect(el).not.to.have.attribute('aria-describedby');
    });
  });

  describe('removable', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tag removable>My label</sl-tag>`);
    });

    it('should have an ARIA description indicating how to remove the tag', () => {
      expect(el).to.have.attribute('aria-description', 'Press the delete or backspace key to remove this item');
    });

    it('should have a tabindex of 0', () => {
      expect(el).to.have.attribute('tabindex', '0');
    });

    it('should have a tabindex of -1 when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '-1');
    });

    it('should have a button', () => {
      expect(el.renderRoot.querySelector('button')).to.exist;
    });

    it('should hide the button for ARIA', () => {
      expect(el.renderRoot.querySelector('button')).to.have.attribute('aria-hidden', 'true');
    });

    it('should not be be removed when it is disabled and remove button is clicked', async () => {
      el.setAttribute('disabled', '');
      await el.updateComplete;

      el.renderRoot.querySelector('button')?.click();
      await el.updateComplete;

      expect(el).to.exist;
    });

    it('should be removed when the button is clicked using the keyboard', async () => {
      const onRemove = spy(el, 'remove');

      el.renderRoot.querySelector('button')?.focus();
      await sendKeys({ press: 'Enter' });

      expect(onRemove).to.have.been.calledOnce;
    });

    it('should be removed when the backspace key is pressed', async () => {
      const onRemove = spy(el, 'remove');

      el.focus();
      await sendKeys({ press: 'Backspace' });

      expect(onRemove).to.have.been.calledOnce;
    });

    it('should be removed when the delete key is pressed', async () => {
      const onRemove = spy(el, 'remove');

      el.focus();
      await sendKeys({ press: 'Delete' });

      expect(onRemove).to.have.been.calledOnce;
    });

    it('should emit an sl-remove event when a remove button is clicked', async () => {
      const onRemove = spy();

      el.addEventListener('sl-remove', onRemove);
      el.renderRoot.querySelector('button')?.click();
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
