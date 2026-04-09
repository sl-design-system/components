import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { getForwardedAccessibleName } from '@sl-design-system/shared/helpers/forward-aria.js';
import { fixture, oneEvent } from '@sl-design-system/vitest-browser-lit';
import { type LitElement, type TemplateResult, html } from 'lit';
import { spy, stub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import '../register.js';
import { Dialog } from './dialog.js';

describe('sl-dialog', () => {
  let el: Dialog, dialog: HTMLDialogElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-dialog>
          <h1 slot="title">Dialog title</h1>
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
      expect(dialog.querySelector('sl-button.sl-close')).not.to.exist;
    });

    it('should have a close button when set', async () => {
      el.closeButton = true;
      await el.updateComplete;

      expect(dialog.querySelector('sl-button.sl-close')).to.exist;
    });

    it('should have an accessible name for the close button', async () => {
      el.closeButton = true;
      await el.updateComplete;

      const closeButton = dialog.querySelector<Button>('sl-button.sl-close')!;

      expect(getForwardedAccessibleName(closeButton)).to.equal('Close');
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
          <h1 slot="title">Dialog title</h1>
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
          <h1 slot="title">Dialog title</h1>
          <p>The dialog content</p>
          <sl-button slot="actions" sl-dialog-close>Close</sl-button>
        </sl-dialog>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;

      el.showModal();

      // Wait for the dialog to open
      await new Promise(resolve => setTimeout(resolve));
    });

    it('should emit an sl-cancel event when pressing the escape key', async () => {
      const onCancel = spy();
      el.addEventListener('sl-cancel', onCancel);

      expect(dialog).to.have.attribute('open');

      await userEvent.keyboard('{Escape}');

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

    it('should only handle backdrop clicks when event.target is a dialog', async () => {
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

      // Actually wait for the `sl-close` event to be emitted
      await oneEvent(el, 'sl-close');

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

      // Actually wait for the `sl-close` event to be emitted
      await oneEvent(el, 'sl-close');

      expect(onClose).to.have.been.calledOnce;
    });

    it('should close the dialog when the close button is clicked', async () => {
      const onClose = spy();

      el.addEventListener('sl-close', onClose);
      el.renderRoot.querySelector<Button>('sl-button.sl-close')?.click();

      // Actually wait for the `sl-close` event to be emitted
      await oneEvent(el, 'sl-close');

      expect(onClose).to.have.been.calledOnce;
    });

    it('should close the dialog when the button with sl-dialog-close is clicked', async () => {
      const onClose = spy();

      el.addEventListener('sl-close', onClose);
      el.querySelector('sl-button')?.click();

      // Actually wait for the `sl-close` event to be emitted
      await oneEvent(el, 'sl-close');

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

        await userEvent.keyboard('{Escape}');

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
          <h1 slot="title">Dialog title</h1>
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

    it('should call requestClose() on the inner dialog', () => {
      el.showModal();

      spy(dialog, 'requestClose');

      el.requestClose();

      expect(dialog.requestClose).to.have.been.calledOnce;
    });

    it('should set returnValue on the dialog when calling close() with a value', () => {
      el.showModal();
      el.close('result');

      expect(dialog.returnValue).to.equal('result');
    });

    it('should set returnValue on the dialog when calling requestClose() with a value', () => {
      el.showModal();
      el.requestClose('result');

      expect(dialog.returnValue).to.equal('result');
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
      expect(title).to.have.trimmed.text('Title');
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

  describe('commands', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-dialog>
          <h1 slot="title">Dialog title</h1>
          <p>The dialog content</p>
        </sl-dialog>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;
    });

    it('should call showModal() when receiving a command event with "--show-modal"', () => {
      const showModalSpy = spy(el, 'showModal');
      const event = new CommandEvent('command', { command: '--show-modal', bubbles: true, cancelable: true });

      el.dispatchEvent(event);

      expect(showModalSpy).to.have.been.calledOnce;
      expect(event.defaultPrevented).to.be.true;
    });

    it('should call close() when receiving a command event with "--close"', () => {
      // First open the dialog
      el.showModal();
      expect(dialog.open).to.be.true;

      const closeSpy = spy(el, 'close');
      const event = new CommandEvent('command', { command: '--close', bubbles: true, cancelable: true });

      el.dispatchEvent(event);

      expect(closeSpy).to.have.been.calledOnce;
      expect(event.defaultPrevented).to.be.true;
    });

    it('should not react to unknown command values', () => {
      const showModalSpy = spy(el, 'showModal'),
        closeSpy = spy(el, 'close');
      const event = new CommandEvent('command', { command: 'toggle', bubbles: true, cancelable: true });

      el.dispatchEvent(event);

      expect(showModalSpy).not.to.have.been.called;
      expect(closeSpy).not.to.have.been.called;
      expect(event.defaultPrevented).to.be.false;
    });

    it('should call requestClose() when receiving a command event with "--request-close"', () => {
      el.showModal();
      expect(dialog.open).to.be.true;

      const requestCloseSpy = spy(el, 'requestClose');
      const event = new CommandEvent('command', { command: '--request-close', bubbles: true, cancelable: true });

      el.dispatchEvent(event);

      expect(requestCloseSpy).to.have.been.calledOnce;
      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('on mobile', () => {
    beforeEach(async () => {
      // iPhone 15 portrait
      await page.viewport(393, 852);

      el = await fixture(html`
        <sl-dialog>
          <h1 slot="title">Dialog title</h1>
          <p>The dialog content</p>
        </sl-dialog>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;
    });

    afterEach(async () => {
      if (dialog?.open) {
        el.close();

        await new Promise(resolve => setTimeout(resolve, 200));
      }
    });

    it('should add sl-dialog-enter when opening the dialog', () => {
      el.showModal();

      expect(document.documentElement).to.have.class('sl-dialog-enter');
    });

    it('should remove sl-dialog-enter when closing the dialog', async () => {
      el.showModal();
      await new Promise(resolve => setTimeout(resolve));

      el.close();
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(document.documentElement).not.to.have.class('sl-dialog-enter');
      expect(document.documentElement).not.to.have.class('sl-dialog-leave');
    });

    it('should remove sl-dialog-enter when resizing to desktop while open', async () => {
      el.showModal();

      expect(document.documentElement).to.have.class('sl-dialog-enter');

      await page.viewport(1024, 768);
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(document.documentElement).not.to.have.class('sl-dialog-enter');
      expect(document.documentElement).not.to.have.class('sl-dialog-leave');
    });

    it('should not toggle classes when resizing while dialog is closed', async () => {
      await page.viewport(1024, 768);
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(document.documentElement).not.to.have.class('sl-dialog-enter');
      expect(document.documentElement).not.to.have.class('sl-dialog-leave');
    });
  });

  describe('on desktop', () => {
    beforeEach(async () => {
      await page.viewport(1024, 768);

      el = await fixture(html`
        <sl-dialog>
          <h1 slot="title">Dialog title</h1>
          <p>The dialog content</p>
        </sl-dialog>
      `);

      dialog = el.renderRoot.querySelector('dialog')!;
    });

    afterEach(async () => {
      if (dialog?.open) {
        el.close();

        await new Promise(resolve => setTimeout(resolve, 200));
      }
    });

    it('should not add sl-dialog-leave when closing the dialog', async () => {
      el.showModal();
      await new Promise(resolve => setTimeout(resolve));

      el.close();
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(document.documentElement).not.to.have.class('sl-dialog-enter');
      expect(document.documentElement).not.to.have.class('sl-dialog-leave');
    });

    it('should add sl-dialog-enter when resizing to mobile while open', async () => {
      el.showModal();

      await page.viewport(393, 852);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(document.documentElement).to.have.class('sl-dialog-enter');
      expect(document.documentElement).not.to.have.class('sl-dialog-leave');
    });

    it('should maintain overflow hidden during viewport transitions while open', async () => {
      el.showModal();

      expect(document.documentElement.style.overflow).to.equal('hidden');

      await page.viewport(393, 852);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(document.documentElement.style.overflow).to.equal('hidden');
    });
  });
});
