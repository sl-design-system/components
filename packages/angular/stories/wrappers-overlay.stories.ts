import { Dialog as DialogElement } from '@sl-design-system/dialog';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { DialogComponent } from '../src/dialog/dialog.component';
import { PopoverComponent } from '../src/popover/popover.component';
import { TooltipComponent } from '../src/tooltip/tooltip.component';

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
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }) => {
      (event.target.nextElementSibling as HTMLElement).showPopover();
    };

    return {
      props: { onClick },
      template: `
        <sl-button (click)="onClick($event)" id="button">Open popover</sl-button>
        <sl-popover anchor="button" style="width: 300px">
          Consectetur qui ut occaecat excepteur id. Eu reprehenderit mollit aliquip ullamco ex fugiat mollit. Dolore adipisicing laboris et nostrud enim irure nisi ea.
        </sl-popover>
      `
    };
  }
};

export const Tooltip: StoryObj = {
  render: () => ({
    template: `
      <sl-button aria-describedby="tooltip">Hover me</sl-button>
      <sl-tooltip id="tooltip">Tooltip content</sl-tooltip>
    `
  })
};
