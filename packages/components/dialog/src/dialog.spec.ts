import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import { html } from 'lit';
import '../register.js';
import { Dialog } from "./dialog.js";
import type { Button } from '@sl-design-system/button';
import { SinonStub, stub } from 'sinon';


describe('sl-dialog', () => {
  let el: HTMLElement;
  let button: Button;
  let dialog: Dialog;

  const onClick = (event: Event & { target: HTMLElement }): void => {
    (event.target.nextElementSibling as Dialog).showModal();
  };

  const showDialog = async () => {
    const clickEvent = new Event('click');
    button?.dispatchEvent(clickEvent);
    await dialog.updateComplete;
    return new Promise(resolve => setTimeout(resolve));
  }

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button aria-describedby="dialog" fill="outline" @click=${onClick}>Button element</sl-button>
          <sl-dialog id="dialog" closing-button>
            <span slot="title">Dialog title</span>
            <p>The dialog content</p>
            <sl-button slot="actions" sl-dialog-close>Close</sl-button>
          </sl-dialog>
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
      dialog = el.querySelector('sl-dialog') as Dialog;
    });

    it('should render correctly', () => {
      expect(dialog).shadowDom.to.equalSnapshot();
    });

    it('should not show the dialog by default', () => {
      expect(dialog?.shadowRoot?.firstElementChild?.hasAttribute('open')).to.be.false;
    });

    it('should show the dialog after showModal was called', async () => {
      await showDialog();

      expect(dialog?.shadowRoot?.firstElementChild?.hasAttribute('open')).to.be.true;
    });

    it('should not have the closing button when closingButton is not set', async () => {
      dialog?.removeAttribute('closing-button');
      await showDialog();

      expect(dialog?.shadowRoot?.firstElementChild?.querySelector('slot[name="close-button"] sl-button')).to.be.null;
    });
  });

  describe('Closing dialog', () => {
    let slDialog: Dialog;
    let dialog: HTMLDialogElement;
    let clickEvent: PointerEvent;
    let dialogStub:  SinonStub<[], DOMRect>;

    beforeEach(async ()=>{
      el = await fixture(html`
        <div>
          <sl-button aria-describedby="dialog" fill="outline" @click=${onClick}>Button element</sl-button>
          <sl-dialog id="dialog" closing-button>
            <span slot="title">Dialog title</span>
            <p>The dialog content</p>
            <sl-button slot="actions" sl-dialog-close>Close</sl-button>
          </sl-dialog>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;

      slDialog = el.querySelector('sl-dialog') as Dialog;

      await showDialog();

      dialog = slDialog?.shadowRoot?.firstElementChild as HTMLDialogElement;

      clickEvent = new PointerEvent('click');

      dialogStub = stub(dialog,'getBoundingClientRect').returns({
        top: 400,
        right: 1400,
        bottom: 900,
        left: 700
      } as DOMRect);
    })

    it('should close the dialog when the close button in the close slot is clicked', async () => {
      const closeButton = dialog.querySelector('slot[name="close-button"] sl-button');

      (closeButton as HTMLButtonElement)?.click();

      await new Promise(resolve => setTimeout(resolve, 500));

      expect(dialog.hasAttribute('open')).to.be.false;
    });

    it('should close the dialog when the button with sl-dialog-close attribute is clicked', async () => {
      const closeButton = slDialog.querySelector('sl-button[sl-dialog-close]');

      (closeButton as HTMLButtonElement)?.click();

      await new Promise(resolve => setTimeout(resolve, 500));

      expect(dialog.hasAttribute('open')).to.be.false;
    });

    it('should close the dialog when the backdrop is clicked and there is no disable-close attribute', async () => {
      if (dialog) {
        stub(clickEvent, 'clientX').value(100);
        stub(clickEvent, 'clientY').value(100);

        dialog.dispatchEvent(clickEvent);

        await new Promise(resolve => setTimeout(resolve, 500));

        expect(dialog.hasAttribute('open')).to.be.false;
      }
    });

    it('should not close the dialog when the backdrop is clicked and there is the disable-close attribute', async () => {
      slDialog.setAttribute('disable-close', '');

      await slDialog.updateComplete;

      if (dialog) {
        stub(clickEvent, 'clientX').value(100);
        stub(clickEvent, 'clientY').value(100);

        dialog.dispatchEvent(clickEvent);

        await new Promise(resolve => setTimeout(resolve, 500));

        expect(dialog.hasAttribute('open')).to.be.true;
      }
    });

    it('should not close the dialog when there is a click in the dialog itself', async () => {
      if (dialog) {
        stub(clickEvent, 'clientX').value(800);
        stub(clickEvent, 'clientY').value(800);

        dialog.dispatchEvent(clickEvent);

        await new Promise(resolve => setTimeout(resolve, 500));

        expect(dialog.hasAttribute('open')).to.be.true;
      }
    });

    it('should close the dialog on escape', async () => {
      dialog.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));

      await new Promise(resolve => setTimeout(resolve, 1500));

      expect(dialog.hasAttribute('open')).to.be.false;
    });

    it('should close the dialog when the close method is called', async () => {
      slDialog.close();

      expect(dialog.hasAttribute('open')).to.be.false;
    });
  });
});
