import type { StoryObj } from '@storybook/web-components';
import '../register.js';
interface Props {
    value: string;
}
type Story = StoryObj<Props>;
declare const _default: {
    title: string;
    render: ({ value }: Props) => import("lit-html").TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
