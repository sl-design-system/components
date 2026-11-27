import { faBook, faCopy } from '@fortawesome/pro-regular-svg-icons';
import { AccordionComponent, AccordionItemComponent } from '@sl-design-system/angular/accordion';
import { ButtonComponent } from '@sl-design-system/angular/button';
import { CardComponent } from '@sl-design-system/angular/card';
import { IconComponent } from '@sl-design-system/angular/icon';
import { PanelComponent } from '@sl-design-system/angular/panel';
import { Icon as SlIcon } from '@sl-design-system/icon';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';

SlIcon.register(faBook, faCopy);

export default {
  title: 'Wrappers/Layout',
  decorators: [
    moduleMetadata({
      imports: [
        AccordionComponent,
        AccordionItemComponent,
        ButtonComponent,
        CardComponent,
        IconComponent,
        PanelComponent
      ]
    })
  ]
} as Meta;

export const Accordion: StoryObj = {
  render: () => ({
    description:
      'An accordion is a vertically stacked set of interactive headings that each contain a title, content snippet, or thumbnail representing a section of content. You can use external variables to control which accordion items are expanded or collapsed, this is shown in the Accordion Story in the root.',
    template: `
      <sl-accordion>
        <sl-accordion-item summary="Item 1">Cupidatat id id velit aliqua ad ea do cillum do cillum qui.</sl-accordion-item>
        <sl-accordion-item summary="Item 2">Dolore velit aliqua ipsum mollit quis est officia nostrud quis nisi commodo cupidatat quis.</sl-accordion-item>
        <sl-accordion-item summary="Item 3">Adipisicing est ipsum ex quis ut mollit.</sl-accordion-item>
      </sl-accordion>
    `
  })
};

export const Card: StoryObj = {
  render: () => ({
    description:
      'A card is a flexible and extensible content container with multiple variants and options.',
    template: `
      <sl-card>
        <h1>Title</h1>
        <span slot="header">Subheader</span>
        <p slot="body">Exercitation excepteur voluptate proident veniam duis cillum aute.</p>
      </sl-card>
    `
  })
};

export const Panel: StoryObj = {
  render: () => ({
    description: 'A panel is a bordered box with an optional header section.',
    template: `
      <sl-panel>
        <span slot="heading">Panel Title</span>
        <sl-button fill="ghost" slot="actions" tooltip="Copy">
            <sl-icon name="far-copy"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" slot="actions" tooltip="Book">
            <sl-icon name="far-book"> </sl-icon>
        </sl-button>
        <p>This is the panel content area.</p>
        <p>You can add any content here.</p>
      </sl-panel>
    `
  })
};
