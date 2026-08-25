import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Student } from '@sl-design-system/example-data';
import '@sl-design-system/search-field/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../../register.js';
type Story = StoryObj;
declare const _default: {
  title: string;
  parameters: {
    chromatic: {
      disableSnapshot: boolean;
    };
  };
  loaders: (() => Promise<{
    students: Student[];
  }>)[];
};
export default _default;
export declare const Basic: Story;
export declare const DataSource: Story;
export declare const Selection: Story;
export declare const ExplicitOptions: Story;
export declare const Custom: Story;
export declare const EmptyValues: Story;
export declare const Grouped: Story;
export declare const Outside: Story;
