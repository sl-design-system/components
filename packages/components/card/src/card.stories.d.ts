import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/toggle-button/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import '../register.js';
import { type Card } from './card.js';
type Props = Pick<Card, 'orientation'> & {
  media?: boolean;
  title?: string;
  bodyText?: string;
  fitImage?: boolean;
  imageBackdrop?: boolean;
  imageUrl?: string;
  mediaMargin?: boolean;
  subheaderContent?: boolean;
  subheaderBadge?: string;
  subheaderText?: string;
  actionButton?: boolean;
  subgrid?: boolean;
  menuButton?: boolean;
  link?: boolean;
};
type Story = StoryObj<Props>;
declare const _default: {
  title: string;
  args: {
    title: string;
    bodyText: string;
    media: true;
    orientation: undefined;
    imageUrl: string;
    subheaderContent: true;
    subheaderBadge: string;
    actionButton: true;
    menuButton: false;
    fitImage: false;
    imageBackdrop: false;
    mediaMargin: false;
    subgrid: false;
    link: false;
  };
  argTypes: {
    orientation: {
      control: 'inline-radio';
      options: string[];
    };
    subheaderBadge: {
      control: 'text';
      if: {
        arg: string;
      };
    };
    subheaderText: {
      control: 'text';
      if: {
        arg: string;
      };
    };
  };
  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }: Props) => import('lit-html').TemplateResult<1>;
};
export default _default;
export declare const Basic: Story;
export declare const SubGridHorizontal: Story;
export declare const SubGridVertical: Story;
export declare const SubGridNoMedia: Story;
export declare const Masonry: Story;
export declare const MediaOptions: Story;
export declare const Vertical: Story;
export declare const Responsive: Story;
export declare const Actions: Story;
export declare const LinkWithToggleButton: Story;
export declare const RealWorldExamples: Story;
export declare const All: Story;
