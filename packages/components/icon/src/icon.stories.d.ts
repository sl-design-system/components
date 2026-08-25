import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { Icon, type IconSize } from './icon.js';
interface Props extends Pick<Icon, 'label' | 'name' | 'size'> {
  icons: string[];
  headingSize?: number;
}
declare const _default: {
  title: string;
  args: {
    icons: string[];
  };
  argTypes: {
    icons: {
      table: {
        disable: true;
      };
    };
  };
  decorators: ((
    story: import('storybook/internal/csf').PartialStoryFn<
      import('@storybook/web-components').WebComponentsRenderer,
      {
        icons: string[];
        headingSize?: number | undefined;
        label?: string | undefined;
        name?: string | undefined;
        size?: IconSize | undefined;
      }
    >,
    storyProperties: import('storybook/internal/csf').StoryContext<
      import('@storybook/web-components').WebComponentsRenderer,
      {
        icons: string[];
        headingSize?: number | undefined;
        label?: string | undefined;
        name?: string | undefined;
        size?: IconSize | undefined;
      }
    >
  ) =>
    | string
    | Node
    | import('lit-html').TemplateResult
    | DocumentFragment
    | import('lit-html').SVGTemplateResult)[];
  render: ({ icons }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
type Story = StoryObj<Props>;
export declare const Basic: Story;
export declare const SizeInheritance: Story;
export declare const FlexContainer: Story;
export declare const All: Story;
export declare const AllIcons: Story;
export declare const RegisterAdditionalIcons: Story;
