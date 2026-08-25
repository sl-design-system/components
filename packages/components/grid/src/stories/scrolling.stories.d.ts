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
export declare const Vertical: Story;
export declare const VerticalOverflow: Story;
export declare const Both: Story;
export declare const BothSticky: Story;
export declare const Horizontal: Story;
