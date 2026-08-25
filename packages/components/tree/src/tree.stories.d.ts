import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/search-field/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Tree } from './tree.js';
type Props = Pick<Tree, 'dataSource' | 'hideGuides' | 'renderer' | 'scopedElements'> & {
  maxWidth?: string;
  styles?: string;
};
type Story = StoryObj<Props>;
export interface FlatDataNode {
  id: number;
  expandable: boolean;
  level: number;
  name: string;
  badge?: string;
}
export interface NestedDataNode {
  id: number;
  name: string;
  description?: string;
  children?: NestedDataNode[];
}
export interface LazyNestedDataNode {
  id: string;
  expandable?: boolean;
  children?:
    | LazyNestedDataNode[]
    | Promise<LazyNestedDataNode[]>
    | Array<Promise<LazyNestedDataNode>>;
}
export declare const flatData: FlatDataNode[];
export declare const nestedData: NestedDataNode[];
declare const _default: {
  title: string;
  excludeStories: string[];
  parameters: {
    a11y: {
      config: {
        rules: {
          /**
           * The rule is disabled due to unnecessary Storybook a11y bug. The role `treegrid` has
           * children with proper role `row`, but the error appears even then (but it should not).
           */
          id: string;
          enabled: boolean;
        }[];
      };
    };
  };
  args: {
    hideGuides: false;
    dataSource: undefined;
  };
  argTypes: {
    dataSource: {
      table: {
        disable: true;
      };
    };
    maxWidth: {
      table: {
        disable: true;
      };
    };
    renderer: {
      table: {
        disable: true;
      };
    };
    scopedElements: {
      table: {
        disable: true;
      };
    };
    styles: {
      table: {
        disable: true;
      };
    };
  };
  render: ({
    dataSource,
    hideGuides,
    maxWidth,
    renderer,
    scopedElements,
    styles
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Badges: Story;
export declare const Buttons: Story;
export declare const HideGuides: Story;
export declare const Icons: Story;
export declare const Filter: Story;
export declare const LazyLoad: Story;
export declare const Multiple: Story;
export declare const Overflow: Story;
export declare const PageScrolling: Story;
export declare const Selectable: Story;
export declare const Skeleton: Story;
export declare const Sorting: Story;
