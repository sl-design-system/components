import { expect, fixture } from '@open-wc/testing';
import { type Button } from '@sl-design-system/button';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy, stub } from 'sinon';
import '../register.js';
import { Dialog } from './dialog.js';

describe('sl-dialog', () => {
  let el: Dialog, dialog: HTMLDialogElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-dialog>
          <span slot="title">Dialog title</span>
          <p>The dialog content</p>
        </sl-dialog>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;
    });

    it('should be inert', () => {
      expect(el.inert).to.be.true;
    });

    it('should have a closed dialog', () => {
      expect(dialog).to.exist;
      expect(dialog).not.to.have.attribute('open');
    });

    it('should not have a close button', () => {
      expect(dialog.querySelector('sl-button[aria-label="Close"]')).not.to.exist;
    });

    it('should have a close button when set', async () => {
      el.closeButton = true;
      await el.updateComplete;

      expect(dialog.querySelector('sl-button[aria-label="Close"]')).to.exist;
    });

    it('should have a role of dialog', () => {
      expect(dialog).to.have.attribute('role', 'dialog');
    });

    it('should have a dialog part', () => {
      expect(dialog).to.have.attribute('part', 'dialog');
    });

    it('should label the dialog with the title slot', () => {
      const title = el.renderRoot.querySelector('[id="title"]');

      expect(dialog).to.have.attribute('aria-labelledby', 'title');
      expect(title).to.exist;
      expect(title).to.have.tagName('slot');
    });
  });

  describe('showing', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-dialog>
          <span slot="title">Dialog title</span>
          <p>The dialog content</p>
        </sl-dialog>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;

      el.showModal();
    });

    it('should not be inert', () => {
      expect(el.inert).to.be.false;
    });

    it('should have an open dialog', () => {
      expect(dialog).to.have.attribute('open');
    });

    it('should have hidden the overflow on the document element', () => {
      expect(document.documentElement.style.overflow).to.equal('hidden');
    });

    it('should not call showModal on the dialog if already open', () => {
      spy(dialog, 'showModal');

      el.showModal();

      expect(dialog.showModal).not.to.have.been.called;
    });

    it('should add a workaround for styling the backdrop', () => {
      const stylesheet = el.shadowRoot?.adoptedStyleSheets?.at(-1);

      expect(stylesheet?.cssRules).to.have.lengthOf(1);
      expect(stylesheet?.cssRules[0].cssText).to.match(/^::backdrop/);
    });
  });

  describe('closing', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-dialog close-button>
          <span slot="title">Dialog title</span>
          <p>The dialog content</p>
          <sl-button slot="actions" sl-dialog-close>Close</sl-button>
        </sl-dialog>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;

      el.showModal();
    });

    it('should emit an sl-cancel event when pressing the escape key', async () => {
      const onCancel = spy();
      el.addEventListener('sl-cancel', onCancel);

      await sendKeys({ press: 'Escape' });

      // Simulate the animationend event that is used in #closeDialogOnAnimationend
      dialog.dispatchEvent(new Event('animationend'));

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onCancel).to.have.been.calledOnce;
    });

    it('should emit an sl-cancel event when clicking the backdrop', () => {
      stub(dialog, 'getBoundingClientRect').returns({
        top: 400,
        right: 1400,
        bottom: 900,
        left: 700
      } as DOMRect);

      const onCancel = spy();
      el.addEventListener('sl-cancel', onCancel);

      // Mock the click event
      const clickEvent = new PointerEvent('click');
      stub(clickEvent, 'clientX').value(100);
      stub(clickEvent, 'clientY').value(100);
      dialog.dispatchEvent(clickEvent);

      // Simulate the animationend event that is used in #closeDialogOnAnimationend
      dialog.dispatchEvent(new Event('animationend'));

      expect(onCancel).to.have.been.calledOnce;
    });

    it('should emit an sl-close event when calling close()', async () => {
      const onClose = spy();

      el.addEventListener('sl-close', onClose);
      el.close();

      // Simulate the animationend event that is used in #closeDialogOnAnimationend
      dialog.dispatchEvent(new Event('animationend'));

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onClose).to.have.been.calledOnce;
    });

    it('should emit an sl-close event when clicking the backdrop', async () => {
      stub(dialog, 'getBoundingClientRect').returns({
        top: 400,
        right: 1400,
        bottom: 900,
        left: 700
      } as DOMRect);

      const onClose = spy();
      el.addEventListener('sl-close', onClose);

      // Mock the click event
      const clickEvent = new PointerEvent('click');
      stub(clickEvent, 'clientX').value(100);
      stub(clickEvent, 'clientY').value(100);
      dialog.dispatchEvent(clickEvent);

      // Simulate the animationend event that is used in #closeDialogOnAnimationend
      dialog.dispatchEvent(new Event('animationend'));

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onClose).to.have.been.calledOnce;
    });

    it('should close the dialog when the close button is clicked', async () => {
      const onClose = spy();

      el.addEventListener('sl-close', onClose);
      el.renderRoot.querySelector<Button>('sl-button[aria-label="Close"]')?.click();

      // Simulate the animationend event that is used in #closeDialogOnAnimationend
      dialog.dispatchEvent(new Event('animationend'));

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onClose).to.have.been.calledOnce;
    });

    it('should close the dialog when the button with sl-dialog-close is clicked', async () => {
      const onClose = spy();

      el.addEventListener('sl-close', onClose);
      el.querySelector('sl-button')?.click();

      // Simulate the animationend event that is used in #closeDialogOnAnimationend
      dialog.dispatchEvent(new Event('animationend'));

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onClose).to.have.been.calledOnce;
    });

    it('should toggle the closing attribute during close', async () => {
      expect(dialog).not.to.have.attribute('closing');

      el.close();

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(dialog).to.have.attribute('closing');

      // Simulate the animationend event that is used in #closeDialogOnAnimationend
      dialog.dispatchEvent(new Event('animationend'));

      expect(dialog).not.to.have.attribute('closing');
    });

    describe('disableCancel', () => {
      beforeEach(async () => {
        el.disableCancel = true;
        await el.updateComplete;
      });

      it('should not cancel the dialog pressing Escape', async () => {
        const onCancel = spy();
        el.addEventListener('sl-cancel', onCancel);

        await sendKeys({ press: 'Escape' });

        expect(onCancel).not.to.have.been.called;
      });

      it('should not cancel the dialog when clicking the backdrop', () => {
        stub(dialog, 'getBoundingClientRect').returns({
          top: 400,
          right: 1400,
          bottom: 900,
          left: 700
        } as DOMRect);

        const onCancel = spy();
        el.addEventListener('sl-cancel', onCancel);

        // Mock the click event
        const clickEvent = new PointerEvent('click');
        stub(clickEvent, 'clientX').value(100);
        stub(clickEvent, 'clientY').value(100);
        dialog.dispatchEvent(clickEvent);

        // Simulate the animationend event that is used in #closeDialogOnAnimationend
        dialog.dispatchEvent(new Event('animationend'));

        expect(onCancel).not.to.have.been.called;
      });
    });
  });

  describe('closed', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-dialog>
          <span slot="title">Dialog title</span>
          <p>The dialog content</p>
        </sl-dialog>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;

      el.showModal();
      el.close();

      // Simulate the animationend event that is used in #closeDialogOnAnimationend
      dialog.dispatchEvent(new Event('animationend'));

      // Wait for the component to stabilize
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should be inert', () => {
      expect(el.inert).to.be.true;
    });

    it('should not have an open dialog', () => {
      expect(dialog).not.to.have.attribute('open');
    });

    it('should not have reset the overflow on the document element', () => {
      expect(document.documentElement.style.overflow).to.equal('');
    });

    it('should not call close() if the dialog is already closed', () => {
      spy(dialog, 'close');

      el.close();

      expect(dialog.close).not.to.have.been.called;
    });
  });
});
