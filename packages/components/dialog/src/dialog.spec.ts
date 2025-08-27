import { expect, fixture, oneEvent } from '@open-wc/testing';
import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { type LitElement, type TemplateResult, html } from 'lit';
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

    it('should not have a role of dialog', () => {
      expect(dialog).not.to.have.attribute('role');
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

      expect(dialog).to.have.attribute('open');

      await sendKeys({ press: 'Escape' });

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 10));

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

      const clickEvent = new PointerEvent('click');
      stub(clickEvent, 'clientX').value(100);
      stub(clickEvent, 'clientY').value(100);
      dialog.dispatchEvent(clickEvent);

      expect(onCancel).to.have.been.calledOnce;
    });

    it('should only handle backdrop clicks when event.target is an dialog', async () => {
      stub(dialog, 'getBoundingClientRect').returns({
        top: 400,
        right: 1400,
        bottom: 900,
        left: 700
      } as DOMRect);

      const onCancel = spy();
      el.addEventListener('sl-cancel', onCancel);

      const clickEvent = new PointerEvent('click');
      stub(clickEvent, 'clientX').value(100);
      stub(clickEvent, 'clientY').value(100);
      dialog.dispatchEvent(clickEvent);

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve));

      expect(onCancel).to.have.been.calledOnce;

      onCancel.resetHistory();

      // Simulate a click inside the dialog (not a backdrop click)
      const button = document.createElement('sl-button');
      button.innerHTML = 'Click me';
      dialog.appendChild(button);

      await el.updateComplete;

      button.click();
      await el.updateComplete;

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve));

      expect(onCancel).not.to.have.been.called;
    });

    it('should emit an sl-close event when calling close()', async () => {
      const onClose = spy();

      el.addEventListener('sl-close', onClose);
      el.close();

      // Using `oneEvent` https://open-wc.org/docs/testing/helpers/#testing-events
      // instead of `await new Promise(resolve => setTimeout(resolve))`
      // ensures the test waits for the actual 'sl-close' event to be emitted by the component, rather than relying on a timeout.
      await oneEvent(el, 'sl-close', false);
      await el.updateComplete;

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

      // Using `oneEvent` https://open-wc.org/docs/testing/helpers/#testing-events
      // instead of `await new Promise(resolve => setTimeout(resolve))`
      // ensures the test waits for the actual 'sl-close' event to be emitted by the component, rather than relying on a timeout.
      await oneEvent(el, 'sl-close', false);
      await el.updateComplete;

      expect(onClose).to.have.been.calledOnce;
    });

    it('should close the dialog when the close button is clicked', async () => {
      const onClose = spy();

      el.addEventListener('sl-close', onClose);
      el.renderRoot.querySelector<Button>('sl-button[aria-label="Close"]')?.click();

      // Using `oneEvent` https://open-wc.org/docs/testing/helpers/#testing-events
      // instead of `await new Promise(resolve => setTimeout(resolve))`
      // ensures the test waits for the actual 'sl-close' event to be emitted by the component, rather than relying on a timeout.
      await oneEvent(el, 'sl-close', false);

      await el.updateComplete;

      expect(onClose).to.have.been.calledOnce;
    });

    it('should close the dialog when the button with sl-dialog-close is clicked', async () => {
      const onClose = spy();

      el.addEventListener('sl-close', onClose);
      el.querySelector('sl-button')?.click();

      // ensures the test waits for the actual 'sl-close' event to be emitted by the component, rather than relying on a timeout.
      await oneEvent(el, 'sl-close', false);
      await el.updateComplete;

      expect(onClose).to.have.been.calledOnce;
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

      // Wait for the event to be emitted
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

  describe('inheritance', () => {
    beforeEach(() => {
      try {
        customElements.define('inherited-dialog', class extends Dialog {});
      } catch {
        // empty
      }
    });

    it('should call renderHeader during render', async () => {
      const renderHeader = spy(Dialog.prototype, 'renderHeader');

      await fixture(html`<inherited-dialog></inherited-dialog>`);

      expect(renderHeader).to.have.been.calledOnce;
    });

    it('should render the given title passed to renderHeader()', async () => {
      customElements.define(
        'inherited-dialog-with-custom-title',
        class extends Dialog {
          override renderHeader(): TemplateResult {
            return super.renderHeader('Title');
          }
        }
      );

      const el: LitElement = await fixture(
        html`<inherited-dialog-with-custom-title></inherited-dialog-with-custom-title>`
      );

      const title = el.renderRoot.querySelector('slot[name="title"]');
      expect(title).to.exist;
      expect(title).to.have.text('Title');
    });

    it('should call renderBody during render', async () => {
      const renderBody = spy(Dialog.prototype, 'renderBody');

      await fixture(html`<inherited-dialog></inherited-dialog>`);

      expect(renderBody).to.have.been.calledOnce;
    });

    it('should call renderFooter during render', async () => {
      const renderFooter = spy(Dialog.prototype, 'renderFooter');

      await fixture(html`<inherited-dialog></inherited-dialog>`);

      expect(renderFooter).to.have.been.calledOnce;
    });

    it('should call renderActions during render', async () => {
      const renderActions = spy(Dialog.prototype, 'renderActions');

      await fixture(html`<inherited-dialog></inherited-dialog>`);

      expect(renderActions).to.have.been.calledOnce;
    });

    it('should render the actions into the actions slot', async () => {
      customElements.define(
        'inherited-dialog-with-custom-actions',
        class extends Dialog {
          override renderPrimaryActions(): TemplateResult {
            return html`<sl-button>Custom action</sl-button>`;
          }
        }
      );

      const el: LitElement = await fixture(
        html`<inherited-dialog-with-custom-actions></inherited-dialog-with-custom-actions>`
      );

      const button = el.renderRoot.querySelector('sl-button');
      expect(button).to.exist;
      expect(button).to.have.text('Custom action');
      expect(button?.parentElement).to.match('slot[name="primary-actions"]');
    });
  });
});
