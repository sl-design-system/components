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
export declare const NoBorder: Story;
export declare const NoRowBorder: Story;
export declare const Striped: Story;
export declare const ColumnDivider: Story;
export declare const Parts: Story;
