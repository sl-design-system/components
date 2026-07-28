import { type Meta, type StoryObj } from '@storybook/angular';

export default {
  title: 'Wrappers/Grid'
} as Meta;

export const Overview: StoryObj = {
  render: () => ({
    description: 'Overview of the Angular Grid wrapper stories.',
    template: `
      <p>
        The Angular Grid wrapper helps you show table data with sorting, filtering, selection,
        editing, grouping, pagination, scrolling, and styling options.
      </p>
      <p>
        Use the sections in this menu to explore each feature with working examples.
      </p>
    `
  })
};
