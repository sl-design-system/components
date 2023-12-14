import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import { html } from 'lit';
import '../register.js';
import { InlineMessage } from "./inline-message.js";


describe('sl-inline-message', () => {
  let el: InlineMessage;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
          <sl-inline-message id="dialog" closing-button>
            <span slot="title">Dialog title</span>
            <p>The dialog content</p>
          </sl-inline-message>
      `);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have the info status by default', () => {
      // expect(el.hasAttribute('status')).to.be.false;
      expect(el).to.have.attribute('status', 'info');
    }); // TODO: noicon, dismissible, slotted things?

    it('should be dismissible by default', () => {
      expect(el.hasAttribute('dismissible')).to.be.true;
    });

    it('should not have the no-icon by default', () => {
      expect(el.hasAttribute('no-icon')).to.be.false;
    });

    it('should have success status when set', async () => {
      el.status = 'success';
      await el.updateComplete;
      console.log('el222', el);

      // TODO: complete this one as well

      // expect(el).to.have.attribute('status', 'success');
    });

    // TODO described closing when dismissible and no dismissible, closing from outside
  });

  describe('Closing inline message', () => {
//     let slDialog: Dialog;
//     let dialog: HTMLDialogElement;
//     let clickEvent: PointerEvent;
//     let dialogStub:  SinonStub<[], DOMRect>;
//
/*    beforeEach(async ()=> {
      el = await fixture(html`
        <sl-inline-message status="danger">
          Status danger inline message
          <span slot="description">A place for additional description</span>
          <span slot="details">
        <ul>
          <li>Error 1</li>
          <li>Error 2</li>
          <li>Error 3</li>
          <li>Error 4</li>
        </ul>
      </span>
        </sl-inline-message>
      `);
    });*/

      it('should close the inline message when the close button is clicked', async () => {
      const el = await fixture<InlineMessage>(html`
        <sl-inline-message status="danger">
        Status danger inline message
        <span slot="description">A place for additional description</span>
      </sl-inline-message> `);
      const closeButton = el.shadowRoot?.querySelector('slot[name="close-button"] sl-button');

      // (closeButton as HTMLButtonElement)?.click();
      //   console.log('1el----', el, closeButton);
      //
      //   await el.updateComplete;


        const clickEvent = new Event('click');
        closeButton?.dispatchEvent(clickEvent);
        // await el.updateComplete;

        await new Promise(resolve => setTimeout(resolve, 500));
      //  return new Promise(resolve => setTimeout(resolve));

     // await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('el----', el, closeButton);

        // expect(el).not.to.exist;
        expect(document.querySelectorAll('sl-inline-message')).not.to.exist;
    });

    it('should close the inline message when onClose is called', async () => {
      const elMsg = await fixture<InlineMessage>(html`
        <sl-inline-message status="info">
          inline message
          <span slot="description">A place for additional description</span>
        </sl-inline-message> `);

      elMsg.onClose();


      await new Promise(resolve => setTimeout(resolve, 500));

      expect(document.querySelectorAll('sl-inline-message')).not.to.exist;
    });
  });
});
