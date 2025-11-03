import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { AccordionItemComponent } from '../src/accordion/accordion-item.component';
import { AccordionComponent } from '../src/accordion/accordion.component';
import { CardComponent } from '../src/card/card.component';

export default {
  title: 'Wrappers/Layout',
  decorators: [
    moduleMetadata({
      imports: [AccordionComponent, AccordionItemComponent, CardComponent]
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
