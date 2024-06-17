import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { InlineMessage } from './inline-message.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-inline-message', () => {
  let el: InlineMessage;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-inline-message>
          <span slot="title">Inline message title</span>
        </sl-inline-message>
      `);
    });

    it('should have an info variant', () => {
      expect(el).to.have.attribute('variant', 'info');
      expect(el.variant).to.equal('info');
    });

    it('should have success variant when set', async () => {
      el.variant = 'success';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'success');
    });

    it('should be dismissible', () => {
      expect(el).not.to.have.attribute('indismissible');
      expect(el.indismissible).not.to.be.true;
    });

    it('should be indismissible when set', async () => {
      el.indismissible = true;
      await el.updateComplete;

      expect(el).to.have.attribute('indismissible');
    });

    it('should have a close button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.exist;
      expect(button).to.contain('sl-icon[name="xmark"]');
    });

    it('should not have a close button when indismissible', async () => {
      el.indismissible = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-button')).not.to.exist;
    });

    it('should remove itself when the close button is clicked', async () => {
      const removeSpy = spy(el, 'remove');

      el.renderRoot.querySelector('sl-button')?.click();

      // Wait for the next frame
      await el.updateComplete;

      // Dispatch the animationend event
      el.renderRoot.querySelector('.wrapper')?.dispatchEvent(new AnimationEvent('animationend'));

      expect(removeSpy).to.have.been.calledOnce;
    });

    it('should emit an sl-dismiss event after clicking the close button', async () => {
      const onDismiss = spy();

      el.addEventListener('sl-dismiss', onDismiss);
      el.renderRoot.querySelector('sl-button')?.click();

      // Wait for the next frame
      await el.updateComplete;

      // Dispatch the animationend event
      el.renderRoot.querySelector('.wrapper')?.dispatchEvent(new AnimationEvent('animationend'));

      expect(onDismiss).to.have.been.calledOnce;
    });
  });

  describe('no title', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-inline-message>Inline message text</sl-inline-message>`);
    });

    it('should not display a title', () => {
      const title = el.renderRoot.querySelector('[part="title"]')!;

      expect(title).to.exist;
      expect(getComputedStyle(title).display).to.equal('none');
    });

    it('should have the no-title attribute set', () => {
      expect(el).to.have.attribute('no-title');
    });
  });

  describe('wrap action', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-inline-message style="inline-size: 300px">
          Proident nulla officia ad irure ex. Consequat cupidatat cupidatat non in sunt cillum eiusmod officia commodo
          occaecat mollit sit laboris. Officia occaecat cupidatat laborum aliquip sint exercitation. Do mollit quis
          dolor qui proident pariatur occaecat.
          <sl-button slot="action">Action</sl-button>
        </sl-inline-message>
      `);

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have a wrap-action attribute', () => {
      expect(el).to.have.attribute('wrap-action');
    });
  });
});
