import { DialogComponent } from '@sl-design-system/angular/dialog';
import { MessageDialogComponent } from '@sl-design-system/angular/message-dialog';
import { PopoverComponent } from '@sl-design-system/angular/popover';
import { TooltipComponent } from '@sl-design-system/angular/tooltip';
import { Dialog as DialogElement } from '@sl-design-system/dialog';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Overlay',
  decorators: [
    moduleMetadata({
      imports: [DialogComponent, MessageDialogComponent, PopoverComponent, TooltipComponent]
    })
  ]
} as Meta;

export const Dialog: StoryObj = {
  render: () => ({
    description:
      'If you want to use the dialog for a simple alert of confirmation you can use the <em>Dialog service</em> as described in a story of the same name in the root of the Angular stories.',
    props: {
      onClick: (event: Event & { target: HTMLElement }) => {
        (event.target.nextElementSibling as DialogElement).showModal();
      }
    },
    template: `
        <sl-button (click)="onClick($event)">Open dialog</sl-button>
        <sl-dialog>
          <span slot="title">Title</span>
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
    template: `
      <sl-button aria-describedby="tooltip">Hover me</sl-button>
      <sl-tooltip id="tooltip">Tooltip content</sl-tooltip>
    `
  })
};
