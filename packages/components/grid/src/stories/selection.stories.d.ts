import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/dialog/register.js';
import { type Student } from '@sl-design-system/example-data';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
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
export declare const Activate: Story;
export declare const Multiple: Story;
export declare const MultipleInDialog: Story;
export declare const MultipleWithMenuButton: Story;
export declare const MultipleRow: Story;
export declare const WithFiltering: Story;
export declare const WithLinks: Story;
export declare const Grouped: Story;
