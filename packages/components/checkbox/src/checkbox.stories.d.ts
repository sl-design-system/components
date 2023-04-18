import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/label/register.js';
import './register.js';
declare const _default: {
    title: string;
    args: {
        checked: boolean;
        disabled: boolean;
        indeterminate: boolean;
        text: string;
        value: string;
        size: string;
        hint: string;
    };
    argTypes: {
        size: {
            control: string;
            options: string[];
        };
    };
};
export default _default;
export declare const API: StoryObj;
export declare const All: StoryObj;
export declare const Indeterminate: StoryObj;
export declare const NoText: StoryObj;
export declare const Overflow: StoryObj;
export declare const WithLabel: StoryObj;
export declare const Group: StoryObj;
export declare const ValidateInForm: StoryObj;
