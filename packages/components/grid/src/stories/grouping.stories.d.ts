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
};
export default _default;
export declare const Basic: Story;
export declare const Collapsed: Story;
export declare const SortedByFunction: Story;
export declare const DragAndDrop: Story;
export declare const Selection: Story;
export declare const Both: Story;
export declare const CustomGroupHeader: Story;
