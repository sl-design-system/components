import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
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

  // describe('opening and closing', () => {
  //   it('should not show the dialog by default', () => {
  //     expect(el.renderRoot.querySelector('dialog')).not.to.have.attribute('open');
  //   });

  //   it('should open and close the drawer', async () => {
  //     const dialog = el.renderRoot.querySelector('dialog');
  //     el.showModal();
  //     await el.updateComplete;

  //     expect(dialog).to.have.attribute('open');
  //     expect(document.documentElement.style.overflow).to.equal('hidden');

  //     el.close();
  //     expect(dialog).not.to.have.attribute('open');

  //     // dispatch the event ourselves, because waiting for it to come from the actual dialog is too unreliable
  //     dialog?.dispatchEvent(new Event('close'));
  //     expect(document.documentElement.style.overflow).to.equal('');
  //   });

  //   it('should not close the drawer when the cancel event is fired but close is disabled', async () => {
  //     const dialog = el.renderRoot.querySelector('dialog');
  //     const cancelEvent = new Event('cancel');
  //     const cancelEventSpy = spy(cancelEvent, 'preventDefault');

  //     el.disableClose = true;
  //     el.showModal();
  //     await el.updateComplete;

  //     expect(dialog).to.have.attribute('open');

  //     dialog?.dispatchEvent(cancelEvent);

  //     expect(cancelEventSpy).to.have.been.called;
  //   });

  //   it('should close the drawer when the cancel event is fired and close isn`t disabled', async () => {
  //     const dialog = el.renderRoot.querySelector('dialog');
  //     const cancelEvent = new Event('cancel');
  //     const cancelEventSpy = spy(cancelEvent, 'preventDefault');

  //     el.disableClose = false;
  //     el.showModal();
  //     await el.updateComplete;

  //     expect(dialog).to.have.attribute('open');

  //     dialog?.dispatchEvent(cancelEvent);

  //     expect(cancelEventSpy).not.to.have.been.called;
  //   });

  //   describe('click event', () => {
  //     let dialog: HTMLDialogElement | null;
  //     let event: PointerEvent;
  //     let dialogCloseSpy: SinonSpy;

  //     beforeEach(() => {
  //       el.showModal();
  //       dialog = el.renderRoot.querySelector('dialog');
  //       event = new PointerEvent('click');
  //       if (dialog) {
  //         dialogCloseSpy = spy(dialog, 'close');
  //       }
  //     });

  //     it('should close the drawer when the close button is clicked', () => {
  //       const closeButton = el.renderRoot.querySelector('sl-button[sl-dialog-close]');
  //       stub(event, 'target').value(closeButton as HTMLElement);

  //       dialog?.dispatchEvent(event);

  //       expect(dialogCloseSpy).to.have.been.called;
  //     });

  //     it('should close the drawer when the backdrop is clicked', () => {
  //       if (dialog) {
  //         stub(dialog, 'getBoundingClientRect').returns({
  //           top: 0,
  //           right: 900,
  //           bottom: 600,
  //           left: 500
  //         } as DOMRect);
  //         stub(event, 'clientX').value(100);
  //         stub(event, 'clientY').value(100);

  //         dialog.dispatchEvent(event);

  //         expect(dialogCloseSpy).to.have.been.called;
  //       }
  //     });

  //     it("should not close the drawer when there's a click in the drawer itself", () => {
  //       if (dialog) {
  //         stub(dialog, 'getBoundingClientRect').returns({
  //           top: 0,
  //           right: 900,
  //           bottom: 600,
  //           left: 500
  //         } as DOMRect);
  //         stub(event, 'clientX').value(600);
  //         stub(event, 'clientY').value(100);

  //         dialog.dispatchEvent(event);

  //         expect(dialogCloseSpy).not.to.have.been.called;
  //       }
  //     });
  //   });
  // });
});
