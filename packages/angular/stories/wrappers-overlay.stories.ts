import { ButtonComponent } from '@sl-design-system/angular/button';
import { DialogComponent } from '@sl-design-system/angular/dialog';
import { MessageDialogComponent } from '@sl-design-system/angular/message-dialog';
import { PopoverComponent } from '@sl-design-system/angular/popover';
import { TooltipComponent } from '@sl-design-system/angular/tooltip';
import { Dialog as DialogElement } from '@sl-design-system/dialog';
import { MessageDialog as MessageDialogElement } from '@sl-design-system/message-dialog';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Overlay',
  decorators: [
    moduleMetadata({
      imports: [ButtonComponent, DialogComponent, MessageDialogComponent, PopoverComponent, TooltipComponent]
    })
  ]
} as Meta;

export const Dialog: StoryObj = {
  render: () => ({
    description:
      'This is the way to show a dialog when you have the code in your template, if you want to show a component via a service you can use the <em>Dialog service</em> as described in a story of the same name in the root of the Angular stories.',
    props: {
      onClick: (event: Event & { target: HTMLElement }) => {
        (event.target.nextElementSibling as DialogElement).showModal();
      }
    },
    styles: ['h2 { font-size: inherit; font-weight: inherit; margin: 0; }'],
    template: `
        <sl-button (click)="onClick($event)">Open dialog</sl-button>
        <sl-dialog>
          <h2 slot="title">Title</h2>
          <span slot="subtitle">Subtitle</span>
          <p>Proident nulla enim est excepteur exercitation minim ea proident nisi.</p>
          <sl-button sl-dialog-close fill="ghost" slot="actions">Cancel</sl-button>
          <sl-button sl-dialog-close slot="actions" variant="primary">Action</sl-button>
        </sl-dialog>
      `
  })
};

export const Popover: StoryObj = {
  render: () => ({
    description:
      'You can show a popover by associating it with an element using the anchor attribute and referring to the id of the element you need to trigger the popover.',
    props: {
      onClick: (event: Event & { target: HTMLElement }) => {
        (event.target.nextElementSibling as HTMLElement).showPopover();
      }
    },
    template: `
        <sl-button (click)="onClick($event)" id="button">Open popover</sl-button>
        <sl-popover anchor="button" style="width: 300px">
          Consectetur qui ut occaecat excepteur id. Eu reprehenderit mollit aliquip ullamco ex fugiat mollit. Dolore adipisicing laboris et nostrud enim irure nisi ea.
        </sl-popover>
      `
  })
};

export const Tooltip: StoryObj = {
  render: () => ({
    description:
      'You can show a tooltip by associating it with an element using the aria-describedby attribute and referring to the id of the element you need to trigger the tooltip.',
    template: `
      <sl-button aria-describedby="tooltip">Hover me</sl-button>
      <sl-tooltip id="tooltip">Tooltip content</sl-tooltip>
    `
  })
};

export const MessageDialogAlert: StoryObj = {
  render: () => ({
    description:
      'You can show an alert message using the static <code>MessageDialog.alert()</code> method. This displays a simple message with an OK button.',
    props: {
      onShowAlert: async () => {
        await MessageDialogElement.alert('This is an important alert message!', 'Alert');
        console.log('Alert was closed');
      }
    },
    template: `
      <sl-button (click)="onShowAlert()" variant="primary">Show Alert</sl-button>
    `
  })
};

export const MessageDialogConfirm: StoryObj = {
  render: () => ({
    description:
      'You can show a confirmation dialog using the static <code>MessageDialog.confirm()</code> method. This returns a promise that resolves with <code>true</code> if OK is clicked, <code>false</code> if Cancel is clicked, or <code>undefined</code> if the dialog is closed.',
    props: {
      onShowConfirm: async () => {
        const result = await MessageDialogElement.confirm(
          'Are you sure you want to delete this item?',
          'Confirm Delete'
        );
        console.log('Confirmation result:', result);
        alert(`User selected: ${result === true ? 'OK' : result === false ? 'Cancel' : 'Closed dialog'}`);
      }
    },
    template: `
      <sl-button (click)="onShowConfirm()" variant="danger">Delete Item</sl-button>
    `
  })
};

export const MessageDialogCustom: StoryObj = {
  render: () => ({
    description:
      'You can create custom dialogs with any number of buttons using the static <code>MessageDialog.show()</code> method. Each button can have its own action and return value.',
    props: {
      onShowCustom: async () => {
        const result = await MessageDialogElement.show({
          title: 'Save Changes?',
          message: 'You have unsaved changes. What would you like to do?',
          buttons: [
            { text: 'Discard', value: 'discard', fill: 'ghost' },
            { text: 'Save as Draft', value: 'draft', fill: 'outline', variant: 'primary' },
            { text: 'Publish', value: 'publish', variant: 'primary', autofocus: true }
          ]
        });
        console.log('User selected:', result);
        if (result) {
          alert(`User selected: ${result}`);
        }
      }
    },
    template: `
      <sl-button (click)="onShowCustom()" variant="primary">Open Custom Dialog</sl-button>
    `
  })
};

export const MessageDialogCustomMessage: StoryObj = {
  render: () => ({
    description:
      'You can use HTML content in the message by passing a Lit <code>TemplateResult</code> instead of a plain string. This allows you to customize the message with rich formatting.',
    props: {
      onShowCustomMessage: async () => {
        const { html } = await import('lit');
        await MessageDialogElement.show({
          title: 'Custom message',
          message: html`You can <em>customize</em> the message with <strong>HTML</strong>!`,
          buttons: [{ text: 'OK', variant: 'primary' }],
          disableCancel: true
        });
      }
    },
    template: `
      <sl-button (click)="onShowCustomMessage()" variant="primary">Show Custom Message</sl-button>
    `
  })
};

export const MessageDialogDeclarative: StoryObj = {
  render: () => ({
    description:
      'You can also use the <code>sl-message-dialog</code> component declaratively in your template by binding the <code>config</code> property and calling <code>showModal()</code>. However, the recommended approach is to use either the static methods (<code>MessageDialog.alert()</code>, <code>MessageDialog.confirm()</code>, <code>MessageDialog.show()</code>) or even better the <strong>Message Dialog Service</strong> available in Angular package (as described in a story of the same name in the root of the Angular stories).',
    props: {
      dialogConfig: {
        title: 'Declarative Dialog',
        message: 'This message dialog was created using the Angular wrapper component declaratively.',
        buttons: [
          { text: 'Cancel', fill: 'ghost' },
          { text: 'OK', variant: 'primary', autofocus: true }
        ]
      },
      onShowDeclarative: (event: Event & { target: HTMLElement }) => {
        const dialog = event.target.nextElementSibling as MessageDialogElement;
        dialog.showModal();
      },
      onCancel: () => {
        console.log('Dialog was cancelled');
      }
    },
    template: `
      <sl-button (click)="onShowDeclarative($event)" variant="primary">Show Declarative Dialog</sl-button>
      <sl-message-dialog [config]="dialogConfig" (slCancel)="onCancel()"></sl-message-dialog>
    `
  })
};
