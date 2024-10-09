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

    it('should not have emphasis by default', () => {
      expect(el).not.to.have.attribute('emphasis');
      expect(el.size).to.be.undefined;
    });

    it('should not have size by default', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should not be removable by default', () => {
      expect(el).not.to.have.attribute('removable');
      expect(el.removable).not.to.be.true;
      expect(el.renderRoot.querySelector('button')).not.to.exist;
    });

    it('should have a tabindex of -1 when it is disabled', async () => {
      el.setAttribute('disabled', '');
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '-1');
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

    it('should have a button', () => {
      expect(el.renderRoot.querySelector('button')).to.exist;
    });

    it('should label the button', () => {
      expect(el.renderRoot.querySelector('button')).to.have.attribute('aria-label', "Remove 'My label'");
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
      el = await fixture(html`<sl-tag style="inline-size: 50px">My label is very long</sl-tag>`);

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
