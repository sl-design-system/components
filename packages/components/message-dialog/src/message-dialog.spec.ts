import { expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { MessageDialog } from './message-dialog.js';

describe('sl-message-dialog', () => {
  let dialog: HTMLDialogElement, promise: Promise<unknown>;

  afterEach(() => document.querySelector('sl-message-dialog')?.remove());

  describe('alert', () => {
    beforeEach(async () => {
      promise = MessageDialog.alert('This is an alert message.');

      const messageDialog = document.querySelector('sl-message-dialog')!;
      await messageDialog.updateComplete;

      dialog = messageDialog.renderRoot.querySelector('dialog')!;
    });

    it('should have an alertdialog role on the native dialog', () => {
      expect(dialog).to.have.attribute('role', 'alertdialog');
    });

    it('should have a dialog that is labelled by a heading', () => {
      expect(dialog).to.have.attribute('aria-labelledby', 'title');
      expect(dialog.querySelector('h1')).to.have.id('title');
    });

    it('should have an "Alert" title', () => {
      expect(dialog.querySelector('h1')).to.have.text('Alert');
    });

    it('should have a message', () => {
      expect(dialog.querySelector('p')).to.have.text('This is an alert message.');
    });

    it('should have an OK button', () => {
      const buttons = dialog.querySelectorAll('sl-button');

      expect(buttons).to.have.length(1);
      expect(buttons[0]).to.have.trimmed.text('OK');
    });

    it('should return a promise', () => {
      expect(promise).to.be.an.instanceOf(Promise);
    });

    it('should resolve the promise with undefined when the dialog is cancelled', async () => {
      const callback = spy();

      promise.then(callback);

      await sendKeys({ press: 'Escape' });

      // Wait for the event to be emitted
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(callback).to.have.been.calledWith(undefined);
    });

    it('should resolve the promise when the OK button is clicked', async () => {
      const callback = spy();

      promise.then(callback);

      dialog.querySelector<HTMLElement>('sl-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(callback).to.have.been.calledWith(undefined);
    });
  });

  describe('alert with title', () => {
    beforeEach(async () => {
      promise = MessageDialog.alert('This is an alert message.', 'Custom title');

      const messageDialog = document.querySelector('sl-message-dialog')!;
      await messageDialog.updateComplete;

      dialog = messageDialog.renderRoot.querySelector('dialog')!;
    });

    it('should have a custom title', () => {
      expect(dialog.querySelector('h1')).to.have.text('Custom title');
    });
  });

  describe('confirm', () => {
    beforeEach(async () => {
      promise = MessageDialog.confirm('This is a confirmation message.');

      const messageDialog = document.querySelector('sl-message-dialog')!;
      await messageDialog.updateComplete;

      dialog = messageDialog.renderRoot.querySelector('dialog')!;
    });

    it('should have an alertdialog role on the native dialog', () => {
      expect(dialog).to.have.attribute('role', 'alertdialog');
    });

    it('should have an "Confirm" title', () => {
      expect(dialog.querySelector('h1')).to.have.text('Confirm');
    });

    it('should have a message', () => {
      expect(dialog.querySelector('p')).to.have.text('This is a confirmation message.');
    });

    it('should have Cancel and OK buttons', () => {
      const buttons = dialog.querySelectorAll('sl-button');

      expect(buttons).to.have.length(2);
      expect(buttons[0]).to.have.trimmed.text('Cancel');
      expect(buttons[1]).to.have.trimmed.text('OK');
    });

    it('should return a promise', () => {
      expect(promise).to.be.an.instanceOf(Promise);
    });

    it('should resolve the promise with undefined when the dialog is cancelled', async () => {
      const callback = spy();

      promise.then(callback);

      await sendKeys({ press: 'Escape' });

      // Wait for component to stabilize
      await new Promise(resolve => setTimeout(resolve));

      expect(callback).to.have.been.calledWith(undefined);
    });

    it('should resolve the promise with false when the Cancel button is clicked', async () => {
      const callback = spy();

      promise.then(callback);

      dialog.querySelector<HTMLElement>('sl-button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(callback).to.have.been.calledWith(false);
    });

    it('should resolve the promise with true when the OK button is clicked', async () => {
      const callback = spy();

      promise.then(callback);

      dialog.querySelector<HTMLElement>('sl-button:last-of-type')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(callback).to.have.been.calledWith(true);
    });
  });

  describe('confirm with title', () => {
    beforeEach(async () => {
      promise = MessageDialog.confirm('This is a confirmation message.', 'Custom title');

      const messageDialog = document.querySelector('sl-message-dialog')!;
      await messageDialog.updateComplete;

      dialog = messageDialog.renderRoot.querySelector('dialog')!;
    });

    it('should have a custom title', () => {
      expect(dialog.querySelector('h1')).to.have.text('Custom title');
    });
  });

  describe('show', () => {
    beforeEach(async () => {
      promise = MessageDialog.show({
        title: 'Title',
        message: html`This is a message with <strong>HTML</strong>!`,
        buttons: [
          { text: 'No, run away!', fill: 'outline', value: 'NO', variant: 'primary' },
          { text: "Yes, I don't care what it does", value: 'YES', variant: 'danger' }
        ],
        disableCancel: true
      });

      const messageDialog = document.querySelector('sl-message-dialog')!;
      await messageDialog.updateComplete;

      dialog = messageDialog.renderRoot.querySelector('dialog')!;
    });

    it('should have an alertdialog role on the native dialog', () => {
      expect(dialog).to.have.attribute('role', 'alertdialog');
    });

    it('should have a title', () => {
      expect(dialog.querySelector('h1')).to.have.text('Title');
    });

    it('should have a custom message', () => {
      const html = dialog.querySelector('p')?.innerHTML;

      // Use match instead of equal because the HTML includes a Lit placeholder comment
      expect(html).to.match(/This is a message with <strong>HTML<\/strong>!/);
    });

    it('should have custom buttons', () => {
      const buttons = dialog.querySelectorAll('sl-button');

      expect(buttons).to.have.length(2);
      expect(buttons[0]).to.have.trimmed.text('No, run away!');
      expect(buttons[0]).to.have.attribute('fill', 'outline');
      expect(buttons[0]).to.have.attribute('variant', 'primary');
      expect(buttons[1]).to.have.trimmed.text("Yes, I don't care what it does");
      expect(buttons[1]).to.have.attribute('variant', 'danger');
    });

    it('should not resolve the promise when trying to cancel the dialog', async () => {
      const callback = spy();

      promise.then(callback);

      await sendKeys({ press: 'Escape' });

      // Wait for component to stabilize
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(callback).not.to.have.been.called;
    });

    it('should resolve the promise with "NO" when the first button is clicked', async () => {
      const callback = spy();

      promise.then(callback);

      dialog.querySelector<HTMLElement>('sl-button')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(callback).to.have.been.calledWith('NO');
    });

    it('should resolve the promise with "YES" when the danger button is clicked', async () => {
      const callback = spy();

      promise.then(callback);

      dialog.querySelector<HTMLElement>('sl-button[variant="danger"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(callback).to.have.been.calledWith('YES');
    });
  });
});
