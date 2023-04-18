import type { Person } from '@sanomalearning/example-data';
import type { StoryObj } from '@storybook/web-components';
import '../../register.js';
type Story = StoryObj;
export interface PersonWithRating extends Person {
    customerRating: number;
}
declare const _default: {
    title: string;
};
export default _default;
export declare const NoBorders: Story;
export declare const Striped: Story;
export declare const Parts: Story;
