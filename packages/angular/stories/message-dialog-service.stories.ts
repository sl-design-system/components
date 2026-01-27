import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { MessageDialogService } from '@sl-design-system/angular';
import { ButtonComponent } from '@sl-design-system/angular/button';
import '@sl-design-system/button/register.js';
import { type Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Custom Message Content</h3>
    <p>You can <em>customize</em> the message with <strong>HTML</strong>!</p>
    <p>Message data: {{ data }}</p>
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
    <h3>Static Methods Examples</h3>
    <div class="container">
      <div>
        <h4>alert(message, title?)</h4>
        <p>Shows a simple alert message with an OK button.</p>
        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <sl-button (click)="showAlert()" variant="primary">Show Alert</sl-button>
          <sl-button (click)="showAlertNonCancellable()" variant="primary" fill="outline"
            >Alert (Non-cancellable)</sl-button
          >
        </div>
      </div>

      <div>
        <h4>confirm(message, title?)</h4>
        <p>Shows a confirmation dialog with Cancel and OK buttons.</p>
        <sl-button (click)="showConfirm()" variant="secondary">Show confirm</sl-button>
      </div>

      <div>
        <h4>show(config)</h4>
        <p>Shows a message dialog with custom configuration, in this case with custom buttons.</p>
        <sl-button (click)="showCustomButtons()" variant="info">Custom buttons</sl-button>
      </div>

      <div>
        <h4>show() with HTML Content</h4>
        <p>You can use <code>show()</code> method to render HTML content in the message.</p>
        <sl-button (click)="showCustomMessage()" variant="primary">Show custom HTML message</sl-button>
      </div>
    </div>
  `
})
export class MessageDialogStaticMethodsComponent {
  constructor(private messageDialogService: MessageDialogService) {}

  async showAlert(): Promise<void> {
    await this.messageDialogService.alert(
      'This is an alert message. Use this to alert the user about something. This is the design system equivalent of calling window.alert().',
      'Alert'
    );
    console.log('Alert was closed');
  }

  async showAlertNonCancellable(): Promise<void> {
    await this.messageDialogService.show({
      title: 'Important Notice',
      message: 'This is a critical alert that cannot be cancelled. You must acknowledge it by clicking OK.',
      buttons: [{ text: 'OK', variant: 'primary', autofocus: true }],
      disableCancel: true
    });
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
    console.log('User selected:', result);
  }

  async showCustomMessage(): Promise<void> {
    const { html } = await import('lit');
    const result = await this.messageDialogService.show({
      title: 'Rich Content Message',
      message: html`
        <style>
          .message {
            color: var(--sl-color-foreground-negative-bold);
          }
        </style>
        <p>This is a message with customized <strong>HTML</strong></p>
        <ul>
          <li><strong>Bold</strong> and <em>italic</em> text</li>
          <li>Lists and structured content</li>
          <li><a href="https://example.com" target="_blank">Links</a></li>
        </ul>
        <p class="message">You can style content using CSS!</p>
      `,
      buttons: [
        { text: 'Cancel', fill: 'outline', value: 'cancel' },
        { text: 'OK', variant: 'primary', value: 'ok' }
      ]
    });
    console.log('Custom message result:', result);
  }
}

@Component({
  selector: 'sla-message-dialog-custom-component',
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
    <h3>Custom Component Examples</h3>
    <div class="container">
      <div>
        <h4>showModal() with Custom Component</h4>
        <p>
          Use <code>showModal()</code> to render a custom Angular component as the message content. Pass data via the
          <code>data</code> property and access it with <code>&#64;Inject('MESSAGE_DIALOG_DATA')</code>.
        </p>
        <sl-button (click)="showWithComponent()" variant="primary">Show with Component</sl-button>
      </div>

      <div>
        <h4>Non-cancellable Dialog with Component</h4>
        <p>
          Use <code>disableCancel: true</code> to prevent users from dismissing critical dialogs. When enabled, the
          dialog cannot be closed by pressing Escape or clicking the backdrop, ensuring users must explicitly respond.
        </p>
        <sl-button (click)="showCriticalAction()" variant="danger">Critical Action</sl-button>
      </div>
    </div>
  `
})
export class MessageDialogCustomComponentExampleComponent {
  constructor(private messageDialogService: MessageDialogService) {}

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
      console.log('Critical action dialog closed with result:', result);
    });
  }
}

@Component({
  selector: 'sla-message-dialog-service-deprecated',
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
  imports: [ButtonComponent],
  template: `
    <style>
      .container {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        flex-direction: column;
      }
    </style>
    <h3>Advanced Message Dialog Service examples</h3>
    <div class="container">
      <div>
        <h4>Multiple dialogs</h4>
        <p>Open multiple dialogs simultaneously and manage them independently.</p>
        <sl-button (click)="openMultipleDialogs()" variant="primary">Open Multiple Dialogs</sl-button>
        <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--sl-color-foreground-subtlest);">
          Each dialog has its own close button. You can also programmatically close all dialogs using
          <code>closeAll()</code> in your code.
        </p>
      </div>

      <div>
        <h4>Sequential dialogs</h4>
        <p>Show dialogs one after another based on what the user chooses.</p>
        <sl-button (click)="showSequentialDialogs()" variant="info">Show sequential dialogs</sl-button>
      </div>
    </div>
  `
})
export class MessageDialogAdvancedExampleComponent {
  constructor(private messageDialogService: MessageDialogService) {}

  openMultipleDialogs(): void {
    const dialog1 = this.messageDialogService.showModal({
      title: 'First Dialog',
      message: 'This is the first dialog. You can open multiple dialogs at once.',
      buttons: [{ text: 'OK', variant: 'primary', value: 'ok1' }]
    });

    dialog1.afterClosed().subscribe(result => {
      console.log('First dialog result:', result);
    });

    setTimeout(() => {
      const dialog2 = this.messageDialogService.showModal({
        title: 'Second Dialog',
        message: 'This is the second dialog. Both dialogs are open simultaneously.',
        buttons: [{ text: 'OK', variant: 'info', value: 'ok2' }]
      });

      dialog2.afterClosed().subscribe(result => {
        console.log('Second dialog result:', result);
      });
    }, 500);
  }

  async showSequentialDialogs(): Promise<void> {
    const step1 = await this.messageDialogService.show({
      title: 'Step 1: Welcome',
      message: 'Welcome to the setup wizard. Click Next to continue.',
      buttons: [
        { text: 'Cancel', value: 'cancel', fill: 'ghost' },
        { text: 'Next', value: 'next', variant: 'primary', autofocus: true }
      ]
    });

    if (step1 !== 'next') {
      console.log('Wizard cancelled at Step 1');
      return;
    }

    const step2 = await this.messageDialogService.show({
      title: 'Step 2: Configuration',
      message: 'Please confirm your configuration settings.',
      buttons: [
        { text: 'Back', value: 'back', fill: 'ghost' },
        { text: 'Next', value: 'next', variant: 'primary', autofocus: true }
      ]
    });

    if (step2 !== 'next') {
      console.log('Wizard cancelled at Step 2');
      return;
    }

    await this.messageDialogService.show({
      title: 'Step 3: Confirmation',
      message: 'Setup complete! Your changes have been saved.',
      buttons: [{ text: 'Finish', value: 'finish', variant: 'success', autofocus: true }],
      disableCancel: true
    });

    console.log('Wizard completed successfully');
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
        MessageDialogCustomComponentExampleComponent,
        MessageDialogServiceExampleComponent,
        MessageDialogStaticMethodsComponent
      ]
    })
  ]
} as Meta;

export const StaticMethods: StoryFn = () => ({
  description:
    'The <strong>MessageDialogService</strong> provides static methods for displaying simple message dialogs. These methods are perfect for alerts, confirmations, and simple user interactions.',
  template: '<sla-message-dialog-service></sla-message-dialog-service>'
});

export const WithCustomComponent: StoryFn = () => ({
  description: 'Use <strong>showModal()</strong> to render a custom Angular component as the message content.',
  template: '<sla-message-dialog-custom-component></sla-message-dialog-custom-component>'
});

export const AdvancedExample: StoryFn = () => ({
  description:
    'These examples show more ways to use the MessageDialogService: <ul> <li><strong>Multiple dialogs</strong>: Open multiple dialogs at the same time.</li><li><strong>Sequential dialogs</strong>: Show dialogs one after another, like a step-by-step guide.</li></ul>',
  template: '<sla-message-dialog-advanced></sla-message-dialog-advanced>'
});
