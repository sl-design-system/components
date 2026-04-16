import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { SinonSpy, spy, stub } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type Drawer, type DrawerAttachment } from './drawer.js';

describe('sl-drawer', () => {
  let el: Drawer;

  beforeEach(async () => {
    el = await fixture(html`<sl-drawer></sl-drawer>`);
  });

  describe('positioning', () => {
    it('should attach the drawer to the right by default', () => {
      expect(el).to.have.attribute('attachment', 'right');
    });

    ['right', 'left', 'top', 'bottom'].forEach(attachment => {
      it(`should support ${attachment} attachment`, async () => {
        el.attachment = attachment as DrawerAttachment;
        await el.updateComplete;

        expect(el).to.have.attribute('attachment', attachment);
      });
    });
  });

  describe('opening and closing', () => {
    it('should not show the dialog by default', () => {
      expect(el.renderRoot.querySelector('dialog')).not.to.have.attribute('open');
    });

    it('should open and close the drawer as a modal', async () => {
      const dialog = el.renderRoot.querySelector('dialog');
      el.showModal();
      await el.updateComplete;

      expect(dialog).to.have.attribute('open');
      expect(document.documentElement.style.overflow).to.equal('hidden');

      el.close();
      expect(dialog).not.to.have.attribute('open');

      // dispatch the event ourselves, because waiting for it to come from the actual dialog is too unreliable
      dialog?.dispatchEvent(new Event('close'));
      expect(document.documentElement.style.overflow).to.equal('');
    });

    it('should open and close the drawer non-modally using show()', async () => {
      const dialog = el.renderRoot.querySelector('dialog');
      el.show();
      await el.updateComplete;

      expect(dialog).to.have.attribute('open');
      // Non-modal open should not lock page scrolling.
      expect(document.documentElement.style.overflow).to.equal('');

      el.close();
      expect(dialog).not.to.have.attribute('open');
    });

    it('should not open the drawer twice', async () => {
      const dialog = el.renderRoot.querySelector('dialog');
      const showModalSpy = spy(dialog!, 'showModal');

      el.showModal();
      el.showModal();

      expect(showModalSpy).to.have.been.calledOnce;
    });

    it('should emit sl-close when the drawer closes', async () => {
      const onClose = spy();
      el.addEventListener('sl-close', onClose);

      el.showModal();
      await el.updateComplete;

      el.close();
      el.renderRoot.querySelector('dialog')?.dispatchEvent(new Event('close'));

      expect(onClose).to.have.been.called;
    });

    it('should not close the drawer when the cancel event is fired but close is disabled', async () => {
      const dialog = el.renderRoot.querySelector('dialog');
      const cancelEvent = new Event('cancel', { cancelable: true });
      const cancelEventSpy = spy(cancelEvent, 'preventDefault');

      el.disableClose = true;
      el.showModal();
      await el.updateComplete;

      expect(dialog).to.have.attribute('open');

      dialog?.dispatchEvent(cancelEvent);

      expect(cancelEventSpy).to.have.been.called;
    });

    it('should emit sl-cancel when the cancel event is fired and close isn`t disabled', async () => {
      const onCancel = spy();
      el.addEventListener('sl-cancel', onCancel);

      const dialog = el.renderRoot.querySelector('dialog');
      const cancelEvent = new Event('cancel', { cancelable: true });

      el.disableClose = false;
      el.showModal();
      await el.updateComplete;

      expect(dialog).to.have.attribute('open');

      dialog?.dispatchEvent(cancelEvent);

      expect(onCancel).to.have.been.called;
    });

    describe('click event', () => {
      let dialog: HTMLDialogElement | null;
      let event: PointerEvent;
      let dialogCloseSpy: SinonSpy;

      beforeEach(() => {
        el.showModal();
        dialog = el.renderRoot.querySelector('dialog');
        event = new PointerEvent('click', { bubbles: true, composed: true });
        if (dialog) {
          dialogCloseSpy = spy(dialog, 'close');
        }
      });

      it('should close the drawer when the backdrop is clicked', () => {
        if (dialog) {
          stub(dialog, 'getBoundingClientRect').returns({
            top: 0,
            right: 900,
            bottom: 600,
            left: 500
          } as DOMRect);
          stub(event, 'clientX').value(100);
          stub(event, 'clientY').value(100);

          dialog.dispatchEvent(event);

          expect(dialogCloseSpy).to.have.been.called;
        }
      });

      it("should not close the drawer when there's a click in the drawer itself", () => {
        if (dialog) {
          stub(dialog, 'getBoundingClientRect').returns({
            top: 0,
            right: 900,
            bottom: 600,
            left: 500
          } as DOMRect);
          stub(event, 'clientX').value(600);
          stub(event, 'clientY').value(100);

          dialog.dispatchEvent(event);

          expect(dialogCloseSpy).not.to.have.been.called;
        }
      });

      it('should not close the drawer when disableClose is true and the backdrop is clicked', async () => {
        el.disableClose = true;
        await el.updateComplete;

        if (dialog) {
          stub(dialog, 'getBoundingClientRect').returns({
            top: 0,
            right: 900,
            bottom: 600,
            left: 500
          } as DOMRect);
          stub(event, 'clientX').value(100);
          stub(event, 'clientY').value(100);

          dialog.dispatchEvent(event);

          expect(dialogCloseSpy).not.to.have.been.called;
        }
      });
    });
  });
});
