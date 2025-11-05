import { AccordionComponent, AccordionItemComponent } from '@sl-design-system/angular/accordion';
import { CardComponent } from '@sl-design-system/angular/card';
import { PanelComponent } from '@sl-design-system/angular/panel';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Layout',
  decorators: [
    moduleMetadata({
      imports: [AccordionComponent, AccordionItemComponent, CardComponent, PanelComponent]
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

export const Panel: StoryObj = {
  render: () => ({
    template: `
      <sl-panel>
        <span slot="header">Panel Title</span>
        <p>This is the panel content area.</p>
        <p>You can add any content here.</p>
      </sl-panel>
    `
  })
};
