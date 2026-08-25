import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Editor } from './editor.js';
type Props = Pick<Editor, 'disabled' | 'value'> & {
  hint?: string;
  label?: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  tags: string[];
  args: {
    disabled: false;
    label: string;
  };
  parameters: {
    chromatic: {
      disableSnapshot: boolean;
    };
  };
  render: ({ disabled, hint, label, value }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const Disabled: Story;
