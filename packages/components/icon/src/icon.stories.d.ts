import type { StoryObj } from '@storybook/web-components';
import { Icon } from './icon.js';
import './register.js';
interface Props extends Pick<Icon, 'label' | 'name'> {
    icons: string[];
}
declare const _default: {
    title: string;
    args: {
        icons: string[];
    };
    render: ({ icons }: Props) => import("lit-html").TemplateResult<1>;
};
export default _default;
type Story = StoryObj<Props>;
export declare const Basic: Story;
export declare const RegisterAdditionalIcons: Story;
