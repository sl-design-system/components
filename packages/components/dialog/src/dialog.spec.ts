import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import {html} from 'lit';
import '../register.js';
import {Dialog} from "./dialog.js";
import type { Button } from '@sl-design-system/button';
import {SinonSpy, spy, stub} from "sinon";


describe('sl-tooltip', () => {
  let el: HTMLElement;
  let button: Button;
  let dialog: Dialog;

  const onClick = (event: Event & { target: HTMLElement }): void => {
    (event.target.nextElementSibling as Dialog).showModal();
  };

  const showDialog = async () => {
    // const focusinEvent = new Event('pointerover',{bubbles:true});
    const clickEvent = new Event('click');
    button?.dispatchEvent(clickEvent);
    await dialog.updateComplete;
    return new Promise(resolve => setTimeout(resolve));
  }

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button aria-describedby="dialog" fill="outline" style="margin-top: 100px" @click=${onClick}>Button element</sl-button>
          <sl-dialog id="dialog" closing-button>
            <span slot="title">Dialog title</span>
            <p>The dialog content</p>
            <sl-button slot="action" sl-dialog-close>Close</sl-button>
          </sl-dialog>
        </div>
      `);
     // await el.updateComplete;
      button = el.querySelector('sl-button') as Button;
      dialog = el.querySelector('sl-dialog') as Dialog;
    });

    it('should render correctly', () => {
      expect(dialog).shadowDom.to.equalSnapshot();
    });

    it('should not show the dialog by default', () => {
      expect(dialog?.shadowRoot?.firstElementChild?.hasAttribute('open')).to.be.false;
    });

    it('should show the dialog after showModal running', async () => {
      await showDialog();
      expect(dialog?.shadowRoot?.firstElementChild?.hasAttribute('open')).to.be.true;
    });

    // TODO: should have title when is set, subtitle, body, buttons in the footer aligned start and end by default,
    //  should not jave closing button when closingbutton is not set, should have closing attribute false after connectedcallback, close on escape pressed

    // it('should close the dialog when the backdrop is clicked and there is no disable-close attribute', async () => {
    //   await showDialog();
    //   expect(dialog?.shadowRoot?.firstElementChild?.hasAttribute('open')).to.be.true;
    // });

    // it('should not show the tooltip by default', () => {
    //   expect(tooltip.matches(':popover-open')).to.be.false;
    // });
    //
    // it('should toggle the tooltip on focusin and focusout', async () => {
    //   const focusinEvent = new Event('focusin',{bubbles:true});
    //   button?.dispatchEvent(focusinEvent);
    //   expect(tooltip.matches(':popover-open')).to.be.true;
    //
    //
    //   const focusoutEvent = new Event('focusout',{bubbles:true});
    //   button?.dispatchEvent(focusoutEvent);
    //   expect(tooltip.matches(':popover-open')).to.be.false;
    // });
    //
    // it('should toggle the tooltip on pointerover and pointerout', async () => {
    //   const focusinEvent = new Event('pointerover',{bubbles:true});
    //   button?.dispatchEvent(focusinEvent);
    //   expect(tooltip.matches(':popover-open')).to.be.true;
    //
    //
    //   const focusoutEvent = new Event('pointerout',{bubbles:true});
    //   button?.dispatchEvent(focusoutEvent);
    //   expect(tooltip.matches(':popover-open')).to.be.false;
    // });
    //
    // it('should be positioned at the top by default', async () => {
    //   expect(tooltip.position).to.equal('top');
    // });
    //
    // it('should set the position to the position option chosen', async () => {
    //   tooltip.setAttribute('position', 'bottom');
    //   await tooltip.updateComplete;
    //
    //   expect(tooltip.position).to.equal('bottom');
    //
    // });
    //
    // it('should not have a maxWidth by default', async () => {
    //   tooltip.setAttribute('max-width', '150');
    //   await tooltip.updateComplete;
    //
    //   await showTooltip();
    //
    //   expect(window.getComputedStyle(tooltip).maxWidth).to.equal('150px');
    // });
  });

  describe('click event', () => {
    let slDialog: Dialog;
    let dialog: HTMLDialogElement;
    let clickEvent: PointerEvent;
    let dialogCloseSpy: SinonSpy;

    beforeEach(async ()=>{
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button aria-describedby="dialog" fill="outline" style="margin-top: 100px" @click=${onClick}>Button element</sl-button>
          <sl-dialog id="dialog" closing-button>
            <span slot="title">Dialog title</span>
            <p>The dialog content</p>
            <sl-button slot="action" sl-dialog-close>Close</sl-button>
          </sl-dialog>
        </div>
      `);
     // await el.updateComplete;
      button = el.querySelector('sl-button') as Button;
      slDialog = el.querySelector('sl-dialog') as Dialog;
      await showDialog();
      // el.showModal();
      // dialog = el.shadowRoot?.querySelector('dialog');
      dialog = slDialog?.shadowRoot?.firstElementChild as HTMLDialogElement;
      // console.log('dialogg', dialog);
      // event = new PointerEvent('click');
      clickEvent = new PointerEvent('click');
      // if (dialog) {
      //   dialogCloseSpy = spy(dialog, 'close');
      // }
    })

    it('should close the dialog when the close button in the close slot is clicked', async () => {
      const closeButton = dialog.querySelector('slot[name="close"] sl-button');
      console.log('closeButton', closeButton);

      (closeButton as HTMLButtonElement)?.click();
     // await dialog.updateComplete;
     //  console.log('el after click', el, dialog);
      // stub(event, 'target').value(closeButton as HTMLElement);
      //
      // dialog?.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 500));

      // await dialog.close();
      // await slDialog.updateComplete;

      console.log('el after click', el, dialog);

     // expect(dialogCloseSpy).to.have.been.called;
      expect(dialog.hasAttribute('open')).to.be.false;
    });

    it('should close the dialog when the button with sl-dialog-close attribute is clicked', async () => {
      const closeButton = slDialog.querySelector('sl-button[sl-dialog-close]');
      console.log('closeButton---------', closeButton);

      (closeButton as HTMLButtonElement)?.click();

      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('el after click', el, dialog);

      // expect(dialogCloseSpy).to.have.been.called;
      expect(dialog.hasAttribute('open')).to.be.false;
    });

    it('should close the dialog when the backdrop is clicked and there is no disable-close attribute', async () => {
      if(dialog){
        // const clickEvent = new PointerEvent('click');

        stub(dialog,'getBoundingClientRect').returns({
          top: 400,
          right: 1400,
          bottom: 900,
          left: 700
        } as DOMRect);
        stub(clickEvent, 'clientX').value(100);
        stub(clickEvent, 'clientY').value(100);

        // dialog.dispatchEvent(event);

        // const clickEvent = new Event('click');

        dialog.dispatchEvent(clickEvent);

        // console.log('clickevent', clickEvent, dialog);
        // console.log('dialog------get.....', dialog?.getBoundingClientRect());

        // await dialog.close();

        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('clickevent', clickEvent, dialog);
        console.log('dialog------get.....', dialog?.getBoundingClientRect());

        // expect(dialogCloseSpy).to.have.been.called;
        expect(dialog.hasAttribute('open')).to.be.false;
      }
    });

    it('should not close the dialog when the backdrop is clicked and there is the disable-close attribute', async () => {
      slDialog.setAttribute('disable-close', '');
      await slDialog.updateComplete;

      if(dialog){
        stub(dialog,'getBoundingClientRect').returns({
          top: 400,
          right: 1400,
          bottom: 900,
          left: 700
        } as DOMRect);
        stub(clickEvent, 'clientX').value(100);
        stub(clickEvent, 'clientY').value(100);

        dialog.dispatchEvent(clickEvent);

        await new Promise(resolve => setTimeout(resolve, 500));

        expect(dialog.hasAttribute('open')).to.be.true;
      }
    });
    //
    it('should not close the dialog when there\'s a click in the dialog itself', async () => {
      if(dialog){
        stub(dialog,'getBoundingClientRect').returns({
          top: 400,
          right: 1400,
          bottom: 900,
          left: 700
        } as DOMRect);
        stub(clickEvent, 'clientX').value(800);
        stub(clickEvent, 'clientY').value(800);

        dialog.dispatchEvent(clickEvent);

        await new Promise(resolve => setTimeout(resolve, 500));

        // expect(dialogCloseSpy).not.to.have.been.called;
        expect(dialog.hasAttribute('open')).to.be.true;
      }
    });
  });
});
