import { type Person } from '@sl-design-system/example-data';
import { type StoryObj } from '@storybook/web-components-vite';
import '../../register.js';
type Story = StoryObj;
declare const _default: {
  title: string;
  loaders: (() => Promise<{
    people: Person[];
  }>)[];
  parameters: {
    chromatic: {
      disableSnapshot: boolean;
    };
  };
};
export default _default;
export declare const TextField: Story;
export declare const Select: Story;
