import type { ButtonBarAlign } from './button-bar.js';
import type { StoryObj } from '@storybook/web-components';
import '../button/register.js';
import './register.js';
interface Props {
    align: ButtonBarAlign;
    reverse: boolean;
}
type Story = StoryObj<Props>;
declare const _default: {
    title: string;
    args: {
        align: "start";
        reverse: false;
    };
    argTypes: {
        align: {
            control: string;
            options: string[];
        };
    };
    render: ({ align, reverse }: Props) => import("lit-html").TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
