import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import { html } from 'lit';
import '../register.js';
import { Popover } from "./popover.js";
import type { Button } from '@sl-design-system/button';
import { SinonStub, stub } from 'sinon';


describe('sl-dialog', () => {
  let el: HTMLElement;
  let button: Button;
  let popover: Popover;

  const onClick = (event: Event & { target: HTMLElement }): void => {
    (event.target.nextElementSibling as HTMLElement).togglePopover();
  };

  const showPopoverElement = async () => {
    const clickEvent = new Event('click');
    button?.dispatchEvent(clickEvent);
    await popover.updateComplete;
    return new Promise(resolve => setTimeout(resolve));
  }

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button popovertarget="popover-1" id="anchor" variant="primary" @click=${onClick}>Toggle popover</sl-button>
          <sl-popover anchor="anchor">
            <header>Please confirm</header>
            <section>
              Are you sure you want to continue?
            </section>
            <footer>
              <sl-button size="sm">Cancel</sl-button>
              <sl-button size="sm" variant="primary">Confirm</sl-button>
            </footer>
          </sl-popover>
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
      popover = el.querySelector('sl-popover') as Popover;
    });

    it('should render correctly', () => {
      expect(popover).shadowDom.to.equalSnapshot();
    });

    it('should set popover attribute if not already set', async () => {
      const element = new Popover();

      expect(element.hasAttribute('popover')).to.be.true;
    });

    it('should set id attribute if not already set', async () => {
      const element = new Popover();

      expect(element.hasAttribute('id')).to.be.true;
    });

    it('should not show the popover by default', () => {
      expect(popover.matches(':popover-open')).to.be.false;
    });

    it('should show the popover after togglePopover was called', async () => {
        await showPopoverElement();

        expect(popover?.matches(':popover-open')).to.be.true;
      });

    it('should close the popover after togglePopover was called', async () => {
      await showPopoverElement();

      await showPopoverElement();

      expect(popover?.matches(':popover-open')).to.be.false;
    });


    //
    // it('should not have the closing button when closingButton is not set', async () => {
    //   dialog?.removeAttribute('closing-button');
    //   await showPopover();
    //
    //   expect(dialog?.shadowRoot?.firstElementChild?.querySelector('slot[name="close-button"] sl-button')).to.be.null;
    // });



    // <sl-button aria-describedby="dialog" fill="outline" @click=${onClick}>Button element</sl-button>
    // <sl-popover id="dialog" closing-button>
    //   <span slot="title">Dialog title</span>
    //   <p>The dialog content</p>
    //   <sl-button slot="actions" sl-dialog-close>Close</sl-button>
    // </sl-popover>
  });

  // should close the popover on escape key

  describe('Closing popover', () => {
    // TODO close on escape, close on hide, close on click outside, close on toggle clicked twice
  }

/*  describe('Closing dialog', () => {
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

      await showPopover();

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
  });*/
});
