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
    students: import('@sl-design-system/example-data').Student[];
  }>)[];
};
export default _default;
export declare const Basic: Story;
export declare const OnTop: Story;
export declare const Fixed: Story;
export declare const Grouping: Story;
