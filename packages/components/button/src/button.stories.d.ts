import type { ButtonFill, ButtonSize, ButtonVariant } from './button.js';
import type { StoryObj } from '@storybook/web-components';
import '../button-bar/register.js';
import './register.js';
interface Props {
    fill: ButtonFill;
    size: ButtonSize;
    text: string;
    variant: ButtonVariant;
}
type Story = StoryObj<Props>;
declare const _default: {
    title: string;
    args: {
        fill: "default";
        size: "md";
        text: string;
        variant: "default";
    };
    argTypes: {
        fill: {
            control: string;
            options: string[];
        };
        size: {
            control: string;
            options: string[];
        };
        variant: {
            control: string;
            options: string[];
        };
    };
    render: ({ fill, size, text, variant }: Props) => import("lit-html").TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const All: Story;
export declare const Fills: Story;
export declare const Sizes: Story;
export declare const Variants: Story;
