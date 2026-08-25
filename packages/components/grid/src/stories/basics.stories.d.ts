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
export declare const ColumnGroups: Story;
export declare const EllipsizeText: Story;
export declare const EllipsizeTextWithCustomContent: Story;
export declare const Header: Story;
export declare const KeyboardHeaderScroll: Story;
export declare const MenuButton: Story;
export declare const SkipLinks: Story;
export declare const LazyLoad: Story;
export declare const Skeleton: Story;
export declare const ReorderColumns: Story;
