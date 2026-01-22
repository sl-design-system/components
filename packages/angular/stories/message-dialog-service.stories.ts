import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { MessageDialogService } from '@sl-design-system/angular';
import { ButtonComponent } from '@sl-design-system/angular/button';
import '@sl-design-system/button/register.js';
import { MessageDialog as MessageDialogElement } from '@sl-design-system/message-dialog';
import { type Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 1rem;">
      <h3 style="margin-top: 0;">Custom Message Content</h3>
      <p>You can <em>customize</em> the message with <strong>HTML</strong>!</p>
      <p>Message data: {{ data }}</p>
    </div>
  `
})
export class CustomMessageComponent {
  constructor(@Inject('MESSAGE_DIALOG_DATA') public data: string) {}
}

@Component({
  selector: 'sla-message-dialog-service',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <style>
      .container {
        display: flex;
        gap: 0.8rem;
        flex-wrap: wrap;
        flex-direction: column;
        max-width: 700px;
      }
    </style>
    <h3>Message Dialog Service examples</h3>
    <div class="container">
      <div>
        <h4>Static methods (recommended for simple cases)</h4>
        <p>These methods use the MessageDialog static API and work well for simple alerts and confirmations:</p>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <sl-button (click)="showAlert()" variant="primary">Show Alert</sl-button>
          <sl-button (click)="showAlertNonCancellable()" variant="primary" fill="outline"
            >Alert (Non-cancellable)</sl-button
          >
          <sl-button (click)="showConfirm()" variant="secondary">Show Confirm</sl-button>
          <sl-button (click)="showCustomButtons()" variant="info">Custom Buttons</sl-button>
        </div>
      </div>

      <div>
        <h4>With Custom Angular Component</h4>
        <p>
          Use <code>showModal()</code> to render a custom Angular component as the message content. This is useful for
          complex dialogs with forms or interactive content:
        </p>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <sl-button (click)="showWithComponent()" variant="primary">Show with Component</sl-button>
          <sl-button (click)="showCriticalAction()" variant="danger">Critical Action</sl-button>
        </div>
      </div>
    </div>
  `
})
export class MessageDialogServiceExampleComponent {
  lastResult: string | undefined;

  constructor(private messageDialogService: MessageDialogService) {}

  async showAlert(): Promise<void> {
    await this.messageDialogService.alert(
      'This is an alert message. Use this to alert the user about something. This is the design system equivalent of calling window.alert().',
      'Alert'
    );
    this.lastResult = 'Alert closed';
    console.log('Alert was closed');
  }

  async showAlertNonCancellable(): Promise<void> {
    await this.messageDialogService.show({
      title: 'Important Notice',
      message: 'This is a critical alert that cannot be cancelled. You must acknowledge it by clicking OK.',
      buttons: [{ text: 'OK', variant: 'primary', autofocus: true }],
      disableCancel: true
    });
    this.lastResult = 'Non-cancellable alert closed';
    console.log('Non-cancellable alert was closed');
  }

  async showConfirm(): Promise<void> {
    const result = await this.messageDialogService.confirm(
      'This is a confirmation message. The message dialog contains a "Cancel" and "OK" button by default. You can customize this using the buttons property.',
      'Confirm'
    );

    if (result !== undefined) {
      await this.messageDialogService.alert(`The result was: ${result}`);
    }

    this.lastResult = `Confirm: ${result === true ? 'OK' : result === false ? 'Cancel' : 'Closed'}`;

    console.log('Confirmation result:', result);
  }

  async showCustomButtons(): Promise<void> {
    const result = await this.messageDialogService.show({
      title: 'Custom buttons',
      message: 'This is a message with custom buttons. Are you sure you want to press any buttons?',
      buttons: [
        { text: 'No, run away!', fill: 'outline', value: 'NO', variant: 'primary' },
        { text: "Yes, I don't care what it does", value: 'YES', variant: 'danger' }
      ],
      disableCancel: true
    });
    this.lastResult = `Custom: ${result ?? 'Cancelled'}`;
    console.log('User selected:', result);
  }

  showWithComponent(): void {
    const dialogRef = this.messageDialogService.showModal<CustomMessageComponent, string>({
      component: CustomMessageComponent,
      data: 'This is some data passed to the component!',
      title: 'Custom Component Message',
      buttons: [
        { text: 'Cancel', fill: 'ghost', value: 'cancel' },
        { text: 'OK', variant: 'primary', autofocus: true, value: 'ok' }
      ]
    });

    dialogRef.afterClosed().subscribe(result => {
      this.lastResult = `Component dialog: ${result ?? 'Cancelled'}`;
      console.log('Component dialog closed with result:', result);
    });
  }

  showCriticalAction(): void {
    const dialogRef = this.messageDialogService.showModal<CustomMessageComponent, string>({
      component: CustomMessageComponent,
      data: 'You are about to perform a critical action that requires confirmation.',
      title: 'Critical Action Required',
      buttons: [{ text: 'I Understand, Proceed', variant: 'danger', autofocus: true, value: 'proceed' }],
      disableCancel: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.lastResult = `Critical action: ${result ?? 'Should not happen'}`;
      console.log('Critical action dialog closed with result:', result);
    });
  }
}

@Component({
  selector: 'sla-message-dialog-advanced',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <h3>Advanced Message Dialog Service examples</h3>
    <p>Demonstrates programmatic control, multiple dialogs, and complex scenarios.</p>
    <div style="display: flex; gap: 0.8rem; flex-wrap: wrap; flex-direction: column; max-width: 700px;">
      <div>
        <h4>Multiple Dialogs</h4>
        <p>Open and manage multiple dialogs simultaneously:</p>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <sl-button (click)="openMultipleDialogs()" variant="primary">Open Multiple Dialogs</sl-button>
          <sl-button (click)="closeAll()" variant="danger">Close All Dialogs</sl-button>
        </div>
      </div>

      <div>
        <h4>Sequential Dialogs</h4>
        <p>Show dialogs one after another based on user actions:</p>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <sl-button (click)="showSequentialDialogs()" variant="info">Start Wizard</sl-button>
        </div>
      </div>

      <div>
        <h4>Programmatic Control</h4>
        <p>Control dialogs programmatically with timeouts or conditions:</p>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <sl-button (click)="showAutoClosingDialog()" variant="warning">Auto-closing Dialog</sl-button>
        </div>
      </div>

      <div>
        <strong>Status:</strong> {{ status }}
      </div>
    </div>
  `
})
export class MessageDialogAdvancedExampleComponent {
  status = 'Ready';

  constructor(private messageDialogService: MessageDialogService) {}

  openMultipleDialogs(): void {
    this.status = 'Opening multiple dialogs...';

    // Open first dialog
    const dialog1 = this.messageDialogService.showModal({
      title: 'First Dialog',
      message: 'This is the first dialog. You can open multiple dialogs at once.',
      buttons: [{ text: 'OK', variant: 'primary', value: 'ok1' }]
    });

    dialog1.afterClosed().subscribe(result => {
      console.log('First dialog result:', result);
      this.status = `First dialog closed with: ${result}`;
    });

    // Open second dialog after a short delay
    setTimeout(() => {
      const dialog2 = this.messageDialogService.showModal({
        title: 'Second Dialog',
        message: 'This is the second dialog. Both dialogs are open simultaneously.',
        buttons: [{ text: 'OK', variant: 'info', value: 'ok2' }]
      });

      dialog2.afterClosed().subscribe(result => {
        console.log('Second dialog result:', result);
        this.status = `Second dialog closed with: ${result}`;
      });
    }, 500);
  }

  closeAll(): void {
    this.messageDialogService.closeAll();
    this.status = 'All dialogs closed programmatically';
    console.log('All dialogs closed');
  }

  async showSequentialDialogs(): Promise<void> {
    this.status = 'Starting wizard...';

    // Step 1
    const step1 = await this.messageDialogService.show({
      title: 'Step 1: Welcome',
      message: 'Welcome to the setup wizard. Click Next to continue.',
      buttons: [
        { text: 'Cancel', value: 'cancel', fill: 'ghost' },
        { text: 'Next', value: 'next', variant: 'primary', autofocus: true }
      ]
    });

    if (step1 !== 'next') {
      this.status = 'Wizard cancelled at Step 1';
      return;
    }

    // Step 2
    const step2 = await this.messageDialogService.show({
      title: 'Step 2: Configuration',
      message: 'Please confirm your configuration settings.',
      buttons: [
        { text: 'Back', value: 'back', fill: 'ghost' },
        { text: 'Next', value: 'next', variant: 'primary', autofocus: true }
      ]
    });

    if (step2 !== 'next') {
      this.status = 'Wizard cancelled at Step 2';
      return;
    }

    // Step 3 - Final confirmation
    await this.messageDialogService.show({
      title: 'Step 3: Confirmation',
      message: 'Setup complete! Your changes have been saved.',
      buttons: [{ text: 'Finish', value: 'finish', variant: 'success', autofocus: true }],
      disableCancel: true
    });

    this.status = 'Wizard completed successfully!';
  }

  showAutoClosingDialog(): void {
    this.status = 'Opening auto-closing dialog...';

    const dialogRef = this.messageDialogService.showModal({
      title: 'Auto-closing Dialog',
      message: 'This dialog will automatically close in 5 seconds unless you click OK first.',
      buttons: [{ text: 'OK', variant: 'primary', value: 'ok' }]
    });

    // Auto-close after 5 seconds
    const timeout = setTimeout(() => {
      dialogRef.close('timeout');
      this.status = 'Dialog auto-closed after timeout';
    }, 5000);

    dialogRef.afterClosed().subscribe(result => {
      clearTimeout(timeout);
      if (result === 'timeout') {
        console.log('Dialog was auto-closed');
      } else {
        this.status = `Dialog closed by user: ${result}`;
        console.log('Dialog closed by user:', result);
      }
    });
  }
}

@Component({
  selector: 'sla-message-dialog-custom-message',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div style="padding: 1rem;">
      <p>Example showing how to use HTML content with the static MessageDialog API.</p>
      <sl-button (click)="showCustomMessage()" variant="primary">Show Custom HTML Message</sl-button>
    </div>
  `
})
export class MessageDialogCustomMessageExampleComponent {
  async showCustomMessage(): Promise<void> {
    const { html } = await import('lit');
    await MessageDialogElement.show({
      title: 'Custom message',
      message: html`You can <em>customize</em> the message with <strong>HTML</strong>!`,
      buttons: [{ text: 'OK', variant: 'primary' }],
      disableCancel: true
    });
  }
}

export default {
  title: 'Components/Message Dialog Service',
  tags: ['draft'],
  decorators: [
    applicationConfig({
      providers: [MessageDialogService, provideRouter([], withHashLocation())]
    }),
    moduleMetadata({
      imports: [
        ButtonComponent,
        CommonModule,
        CustomMessageComponent,
        MessageDialogAdvancedExampleComponent,
        MessageDialogCustomMessageExampleComponent,
        MessageDialogServiceExampleComponent
      ]
    })
  ]
} as Meta;

export const MessageDialogServiceExample: StoryFn = () => ({
  description:
    '<p>The <strong>MessageDialogService</strong> provides a comprehensive API for displaying message dialogs in Angular applications.</p>' +
    '<h4>Usage Patterns:</h4>' +
    '<ul>' +
    '<li><strong>Static methods</strong> (<code>alert()</code>, <code>confirm()</code>, <code>show()</code>): Perfect for simple alerts and confirmations. These are async methods that return promises.</li>' +
    '<li><strong>showModal()</strong>: Advanced method for rendering custom Angular components inside dialogs. Returns a <code>MessageDialogRef</code> for programmatic control.</li>' +
    '</ul>' +
    '<h4>When to use <code>disableCancel: true</code>:</h4>' +
    '<ul>' +
    '<li>Critical alerts that require user acknowledgment</li>' +
    '<li>Success/completion messages that should not be dismissed accidentally</li>' +
    '<li>Final steps in wizards or workflows</li>' +
    '<li>Any message where cancellation would leave the app in an inconsistent state</li>' +
    '</ul>' +
    "<p><strong>Note:</strong> Use <code>@Inject('MESSAGE_DIALOG_DATA')</code> to access data passed to custom components.</p>",
  template: '<sla-message-dialog-service></sla-message-dialog-service>'
});

export const AdvancedExample: StoryFn = () => ({
  description:
    '<p>Advanced examples demonstrating powerful features of the MessageDialogService:</p>' +
    '<ul>' +
    '<li><strong>Multiple dialogs</strong>: Open several dialogs simultaneously and manage them individually or close all at once with <code>closeAll()</code>.</li>' +
    '<li><strong>Sequential dialogs</strong>: Create wizard-like flows where dialogs appear one after another based on user choices.</li>' +
    '<li><strong>Programmatic control</strong>: Use the <code>MessageDialogRef</code> to control dialogs programmatically, including auto-closing with timeouts.</li>' +
    '</ul>' +
    '<p><strong>Tip:</strong> The <code>afterClosed()</code> observable is perfect for handling dialog results reactively in your Angular application.</p>',
  template: '<sla-message-dialog-advanced></sla-message-dialog-advanced>'
});

export const CustomMessage: StoryFn = () => ({
  description:
    '<p>Example showing how to use HTML content in message dialogs using the static <code>MessageDialog.show()</code> method with Lit HTML. <br /> For Angular components, use the <code>showModal()</code> method with a custom component instead (see the main example).</p>',
  template: '<sla-message-dialog-custom-message></sla-message-dialog-custom-message>'
});
