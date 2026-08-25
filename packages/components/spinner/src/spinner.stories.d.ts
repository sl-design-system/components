import '@sl-design-system/button/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Spinner, type SpinnerSize } from './spinner.js';
type Props = Pick<Spinner, 'size'>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  argTypes: {
    size: {
      control: 'inline-radio';
      options: SpinnerSize[];
    };
  };
  parameters: {
    chromatic: {
      pauseAnimationAtEnd: boolean;
      prefersReducedMotion: string;
    };
  };
  render: ({ size }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const InButton: Story;
export declare const All: Story;
