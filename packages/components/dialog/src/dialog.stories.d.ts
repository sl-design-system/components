import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/combobox/register.js';
import '@sl-design-system/date-field/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/listbox/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/popover/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult } from 'lit';
import '../register.js';
import { type Dialog } from './dialog.js';
type Props = Pick<Dialog, 'closeButton' | 'disableCancel'> & {
  body?(): string | TemplateResult;
  footerButtons?(props: Props): TemplateResult;
  headerButtons?(props: Props): TemplateResult;
  maxWidth: string;
  primaryActions?(): TemplateResult;
  secondaryActions?(): TemplateResult;
  subtitle: string;
  title: string;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    viewport: {
      disable: boolean;
    };
  };
  args: {
    closeButton: false;
    disableCancel: false;
    title: string;
  };
  render: (args: Props) => TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const CloseButton: Story;
export declare const Commands: Story;
export declare const DisableCancel: Story;
export declare const Inheritance: Story;
export declare const Lazy: Story;
export declare const Mobile: Story;
export declare const MobileScrolling: Story;
export declare const DialogWithOverlayComponents: Story;
export declare const All: Story;
