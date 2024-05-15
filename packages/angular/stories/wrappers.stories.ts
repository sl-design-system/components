import { Dialog as DialogElement } from '@sl-design-system/dialog';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import {
  AccordionComponent,
  AccordionItemComponent,
  AvatarComponent,
  BadgeComponent,
  BreadcrumbsComponent,
  ButtonBarComponent,
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  CheckboxGroupComponent,
  DialogComponent,
  IconComponent,
  InlineMessageComponent,
  PopoverComponent,
  RadioComponent,
  RadioGroupComponent,
  SelectComponent,
  SelectOptionComponent,
  SkeletonComponent,
  SpinnerComponent,
  SwitchComponent,
  TabComponent,
  TabGroupComponent,
  TabPanelComponent,
  TextFieldComponent,
  TextareaComponent,
  TooltipComponent
} from '../src/wrappers/index';

export default {
  title: 'Wrappers',
  decorators: [
    moduleMetadata({
      imports: [
        AccordionComponent,
        AccordionItemComponent,
        AvatarComponent,
        BadgeComponent,
        BreadcrumbsComponent,
        ButtonBarComponent,
        ButtonComponent,
        CardComponent,
        CheckboxComponent,
        CheckboxGroupComponent,
        DialogComponent,
        IconComponent,
        InlineMessageComponent,
        PopoverComponent,
        RadioComponent,
        RadioGroupComponent,
        SelectComponent,
        SelectOptionComponent,
        SkeletonComponent,
        SpinnerComponent,
        SwitchComponent,
        TabComponent,
        TabGroupComponent,
        TabPanelComponent,
        TextFieldComponent,
        TextareaComponent,
        TooltipComponent
      ]
    })
  ]
} as Meta;

export const Accordion: StoryObj = {
  render: () => ({
    template: `
      <sl-accordion>
        <sl-accordion-item summary="Item 1">Cupidatat id id velit aliqua ad ea do cillum do cillum qui.</sl-accordion-item>
        <sl-accordion-item summary="Item 2">Dolore velit aliqua ipsum mollit quis est officia nostrud quis nisi commodo cupidatat quis.</sl-accordion-item>
        <sl-accordion-item summary="Item 3">Adipisicing est ipsum ex quis ut mollit.</sl-accordion-item>
      </sl-accordion>
    `
  })
};

export const Avatar: StoryObj = {
  render: () => ({
    template: '<sl-avatar displayName="Jan Janssen"></sl-avatar>'
  })
};

export const Badge: StoryObj = {
  render: () => ({
    template: '<sl-badge>badge</sl-badge>'
  })
};

export const Breadcrumbs: StoryObj = {
  render: () => ({
    template: `
      <sl-breadcrumbs>
        <a href="javascript:void(0)">Lorem</a>
        <a href="javascript:void(0)">Ipsum</a>
        <a href="javascript:void(0)">Dolar</a>
      </sl-breadcrumbs>
    `
  })
};

export const Button: StoryObj = {
  render: () => ({
    template: '<sl-button>Button</sl-button>'
  })
};

export const ButtonBar: StoryObj = {
  render: () => ({
    template: `
      <sl-button-bar>
        <sl-button>Button 1</sl-button>
        <sl-button>Button 2</sl-button>
      </sl-button-bar>
    `
  })
};

export const Card: StoryObj = {
  render: () => ({
    template: `
      <sl-card>
        <h1>Title</h1>
        <span slot="header">Subheader</span>
        <p slot="body">Exercitation excepteur voluptate proident veniam duis cillum aute.</p>
      </sl-card>
    `
  })
};

export const Checkbox: StoryObj = {
  render: () => ({
    template: `
      <sl-checkbox-group>
        <sl-checkbox>Checkbox 1</sl-checkbox>
        <sl-checkbox>Checkbox 2</sl-checkbox>
        <sl-checkbox>Checkbox 3</sl-checkbox>
      </sl-checkbox-group>
    `
  })
};

export const Dialog: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }) => {
      (event.target.nextElementSibling as DialogElement).showModal();
    };

    return {
      props: { onClick },
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
    };
  }
};

export const Icon: StoryObj = {
  render: () => ({
    template: '<sl-icon name="face-smile"></sl-icon>'
  })
};

export const InlineMessage: StoryObj = {
  render: () => ({
    props: {
      onDismiss: () => console.log('Dismissed')
    },
    template: `
      <sl-inline-message (slDismiss)="onDismiss()">
        <span slot="title">Inline message title</span>
        <p>Et labore exercitation excepteur sunt. Laboris amet minim nisi non ut labore culpa eiusmod reprehenderit nisi. Exercitation veniam quis aute mollit qui commodo magna est commodo veniam magna. Est in pariatur quis laboris non ad. Cillum amet eiusmod duis ullamco dolore irure. Mollit ea incididunt elit nostrud anim sunt do. Cupidatat occaecat nisi aliqua esse occaecat duis amet et labore quis.</p>
      </sl-inline-message>
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

export const RadioGroup: StoryObj = {
  render: () => ({
    template: `
      <sl-radio-group>
        <sl-radio value="1">Radio 1</sl-radio>
        <sl-radio value="2">Radio 2</sl-radio>
        <sl-radio value="3">Radio 3</sl-radio>
      </sl-radio-group>
    `
  })
};

export const Select: StoryObj = {
  render: () => ({
    template: `
      <sl-select>
        <sl-select-option value="1">Option 1</sl-select-option>
        <sl-select-option value="2">Option 2</sl-select-option>
        <sl-select-option value="3">Option 3</sl-select-option>
      </sl-select>
    `
  })
};

export const Skeleton: StoryObj = {
  render: () => ({
    template: '<sl-skeleton></sl-skeleton>'
  })
};

export const Spinner: StoryObj = {
  render: () => ({
    template: '<sl-spinner></sl-spinner>'
  })
};

export const Switch: StoryObj = {
  render: () => ({
    template: '<sl-switch></sl-switch>'
  })
};

export const Tabs: StoryObj = {
  render: () => ({
    template: `
      <sl-tab-group>
        <sl-tab>First tab</sl-tab>
        <sl-tab>Second tab</sl-tab>
        <sl-tab disabled>Disabled</sl-tab>
        <sl-tab-panel>Contents tab 1</sl-tab-panel>
        <sl-tab-panel>Contents tab 2</sl-tab-panel>
        <sl-tab-panel>Contents tab 3</sl-tab-panel>
      </sl-tab-group>
    `
  })
};

export const TextField: StoryObj = {
  render: () => ({
    template: '<sl-text-field></sl-text-field>'
  })
};

export const Textarea: StoryObj = {
  render: () => ({
    template: '<sl-text-area></sl-text-area>'
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
