import '@sl-design-system/button/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { Announcer } from './announcer.js';
type Props = Announcer;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {};
  argTypes: {};
  render: () => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
