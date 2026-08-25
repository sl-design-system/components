import { type Student } from '@sl-design-system/example-data';
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
export declare const CustomSorter: Story;
export declare const Grouped: Story;
