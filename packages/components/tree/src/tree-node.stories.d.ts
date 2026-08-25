import { type StoryObj } from '@storybook/web-components-vite';
import { TreeNode } from './tree-node.js';
type Props = Pick<
  TreeNode,
  | 'disabled'
  | 'expandable'
  | 'expanded'
  | 'indeterminate'
  | 'lastNodeInLevel'
  | 'level'
  | 'levelGuides'
  | 'multiple'
  | 'selectable'
  | 'selected'
  | 'type'
> & {
  text: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    disabled: false;
    expandable: false;
    expanded: false;
    indeterminate: false;
    lastNodeInLevel: false;
    level: number;
    multiple: false;
    selectable: false;
    selected: false;
    text: string;
    type: 'node';
  };
  argTypes: {
    type: {
      control: 'inline-radio';
      options: string[];
    };
  };
  render: ({
    disabled,
    expandable,
    expanded,
    indeterminate,
    lastNodeInLevel,
    level,
    levelGuides,
    multiple,
    selectable,
    selected,
    text,
    type
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Overflow: Story;
export declare const All: Story;
