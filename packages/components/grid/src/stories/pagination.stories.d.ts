import { type Student } from '@sl-design-system/example-data';
import '@sl-design-system/paginator/register.js';
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
export declare const Filtering: Story;
export declare const LazyLoad: Story;
export declare const Manual: Story;
