import type { StoryObj } from '@storybook/web-components';
import '../button/register.js';
import './register.js';
declare const _default: {
    title: string;
    args: {
        attachment: string;
        buttonSize: string;
    };
    argTypes: {
        attachment: {
            control: string;
            options: string[];
        };
        buttonSize: {
            control: string;
            options: string[];
        };
    };
};
export default _default;
export declare const API: StoryObj;
export declare const DisableClose: StoryObj;
export declare const CompleteHeader: StoryObj;
