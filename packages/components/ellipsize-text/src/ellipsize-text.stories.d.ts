import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
type Props = {
  text: string;
  width: number;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  render: ({ text, width }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
