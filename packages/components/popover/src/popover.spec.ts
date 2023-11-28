import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import { html } from 'lit';
import '../register.js';
import { Popover } from "./popover.js";
import type { Button } from '@sl-design-system/button';
import { SinonStub, stub } from 'sinon';
import {Dialog} from "@sl-design-system/dialog";


describe('sl-popover', () => {
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
          <sl-popover id="popover-1" anchor="anchor">
            <header>Please confirm</header>
            <section>
              Are you sure you want to continue?
            </section>
            <footer>
              <sl-button size="sm" autofocus>Cancel</sl-button>
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

    it('should have a button with popover-opened attribute when popover is opened', async () => {
      await showPopoverElement();

      expect(button?.hasAttribute('popover-opened')).to.be.true;
    });

    // it('should show the popover after togglePopover was called', async () => {
    //   await showPopoverElement();
    //
    //   console.log('popover---2', popover);
    //
    //   expect(popover?.matches('position')).to.be.true;
    // });

    // TODO should have bottom placement by default

    // it('should close the popover after togglePopover was called', async () => {
    //   await showPopoverElement();
    //
    //   await showPopoverElement();
    //
    //   expect(popover?.matches(':popover-open')).to.be.false;
    // });


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
    let popover: Popover;
    let clickEvent: PointerEvent;
    let popoverStub:  SinonStub<[], DOMRect>;
    let divEl: HTMLDivElement;
    // TODO close on escape, close on hide, close on click outside, close on toggle clicked twice

    beforeEach(async ()=>{
      el = await fixture(html`
        <div style="width: 500px; height: 500px;">
          <sl-button popovertarget="popover-2" id="anchor2" variant="primary" @click=${onClick}>Toggle popover</sl-button>
          <sl-popover id="popover-2" anchor="anchor2">
            Popover content
          </sl-popover>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;

      popover = el.querySelector('sl-popover') as Popover;

      divEl = el.querySelector('div') as HTMLDivElement;

      await showPopoverElement();

      clickEvent = new PointerEvent('click');

      popoverStub = stub(popover,'getBoundingClientRect').returns({
        top: 100,
        right: 300,
        bottom: 200,
        left: 100
      } as DOMRect);
    });

    it('should close the popover after togglePopover was called twice', async () => {
      // await showPopoverElement();
      //
      // expect(popover?.matches(':popover-open')).to.be.true;

      await showPopoverElement();

      expect(popover?.matches(':popover-open')).to.be.false;
    });

    it('should close the popover after hidePopover was called', async () => {
      // await showPopoverElement();

      const hideOnClick = (event: Event & { target: HTMLElement }): void => {
        (event.target.nextElementSibling as HTMLElement).hidePopover();
      };

      await fixture(html`<sl-button popovertarget="popover-2" id="anchor2" variant="primary" @click=${hideOnClick}>Toggle popover</sl-button>`)

      // await showPopoverElement();

      expect(popover?.matches(':popover-open')).to.be.false;
    });

    it('should close the popover on escape', async () => {
      popover.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));

      expect(popover?.matches(':popover-open')).to.be.false;
    });

    it('should close the popover it is clicked outside the popover', async () => {
      console.log('slPopover2222222222------', popover.getBoundingClientRect(), 'eeeeellll', el, el?.getBoundingClientRect());
      // if (slPopover) {
        stub(clickEvent, 'clientX').value(1);
        stub(clickEvent, 'clientY').value(2);

        el.dispatchEvent(clickEvent);

        console.log('clickEvent--------', el, 'clickEvent.target----->' , clickEvent.target, 'bigger????', clickEvent.clientY < popover.getBoundingClientRect().top ||
          clickEvent.clientY > popover.getBoundingClientRect().bottom ||
          clickEvent.clientX < popover.getBoundingClientRect().left ||
          clickEvent.clientX > popover.getBoundingClientRect().right, 'dimensions---', clickEvent.clientY, clickEvent.clientX, clickEvent.x, clickEvent.y);

       // await new Promise(resolve => setTimeout(resolve, 500));

        console.log('-----------slPopover---------', popover, '-------', popover?.matches(':popover-open'));

        expect(popover?.matches(':popover-open')).to.be.false;
      // }
    });

    // TODO: should not close the popover when clicked inside

    // TODO not close when manual
  });

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
