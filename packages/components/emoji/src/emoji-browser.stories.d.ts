import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type EmojiBrowser } from './emoji-browser.js';
type Props = Pick<EmojiBrowser, 'frequentlyUsed' | 'locale' | 'query'>;
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  parameters: {
    layout: string;
  };
  args: {
    locale: string;
  };
  argTypes: {
    frequentlyUsed: {
      type: 'string';
    };
    query: {
      type: 'string';
    };
  };
  render: ({ frequentlyUsed, locale, query }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const FrequentlyUsed: Story;
export declare const Search: Story;
