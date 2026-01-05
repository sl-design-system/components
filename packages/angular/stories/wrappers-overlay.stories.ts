import { DialogComponent } from '@sl-design-system/angular/dialog';
import { PopoverComponent } from '@sl-design-system/angular/popover';
import { TooltipComponent } from '@sl-design-system/angular/tooltip';
import { Dialog as DialogElement } from '@sl-design-system/dialog';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Overlay',
  decorators: [
    moduleMetadata({
      imports: [DialogComponent, PopoverComponent, TooltipComponent]
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
