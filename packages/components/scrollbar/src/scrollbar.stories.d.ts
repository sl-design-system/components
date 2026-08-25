import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Scrollbar } from './scrollbar';
type Props = Pick<Scrollbar, 'vertical'> & {
  scrolled?: number;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    vertical: false;
  };
  render: ({ scrolled, vertical }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const ScrollTo: Story;
export declare const Vertical: Story;
