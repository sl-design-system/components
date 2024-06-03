import { faBurst } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { FormInDialog } from '@sl-design-system/lit-examples';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { type Dialog } from './dialog.js';

type Props = Pick<Dialog, 'closeButton' | 'disableCancel'> & {
  body: string | TemplateResult;
  footerButtons?(props: Props): TemplateResult;
  headerButtons?(props: Props): TemplateResult;
  maxWidth: string;
  reverse: boolean;
  subtitle: string;
  title: string;
};
type Story = StoryObj<Props>;

Icon.register(faBurst);

export default {
  title: 'Overlay/Dialog',
  tags: ['stable'],
  args: {
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac augue neque. Nunc sed ex ut neque lacinia rutrum nec vitae mi. Donec dictum urna elit, et feugiat nunc fringilla nec. Maecenas nisi lorem, facilisis nec libero ut, hendrerit ultricies orci. Vivamus massa ligula, ultricies quis odio a, scelerisque tincidunt lorem. Morbi quis pulvinar augue. Nunc eros magna, laoreet vitae ornare at, iaculis quis diam. Duis odio urna, viverra ut ex mattis, egestas tincidunt enim. Praesent ac ex tincidunt, hendrerit sem et, aliquam metus. Nunc quis nisi nulla. Sed nibh ante, posuere eu volutpat vitae, elementum ut leo. Ut aliquet tincidunt tellus, ut molestie urna ultrices in. Suspendisse potenti. Nunc non nunc eu nibh venenatis vestibulum. Maecenas rutrum nibh lacus. Fusce sodales purus ut arcu hendrerit, non interdum nulla suscipit. Duis vitae felis facilisis, eleifend ipsum ut, condimentum est. Nullam metus massa, venenatis vitae suscipit in, feugiat quis turpis. In pellentesque velit at sagittis mattis. Nam ut tellus elit. Proin luctus lectus velit, ut ultricies libero blandit blandit. Aenean molestie est ipsum, in dictum turpis dictum nec.',
    closeButton: true,
    disableCancel: false,
    title: 'Title'
  },
  render: args => {
    const { body, closeButton, disableCancel, footerButtons, headerButtons, maxWidth, subtitle, title } = args;

    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as Dialog).showModal();
    };

    return html`
      <style>
        sl-dialog {
          ${maxWidth ? `--sl-dialog-max-inline-size: ${maxWidth}` : ''};
        }
      </style>
      <sl-button fill="outline" size="md" @click=${onClick}>Show Dialog</sl-button>
      <sl-dialog ?close-button=${closeButton} ?disable-cancel=${disableCancel}>
        <span slot="title">${title}</span>
        ${subtitle ? html`<span slot="subtitle">${subtitle}</span>` : nothing} ${body}
        ${headerButtons ? headerButtons(args) : nothing}
        ${footerButtons
          ? footerButtons(args)
          : html`
              <sl-button slot="actions" fill="ghost" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
              <sl-button slot="actions" fill="solid" variant="primary" sl-dialog-close>Action</sl-button>
            `}
      </sl-dialog>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    subtitle: 'Subtitle'
  }
};

export const CloseButton: Story = {};

export const All: Story = {
  render: () => {
    setTimeout(() => {
      const dialog = document.querySelector('sl-dialog') as Dialog;
      dialog.showModal();
    }, 100);

    return html` <sl-dialog close-button disable-cancel>
      <span slot="title">Title</span>
      <span slot="subtitle">Subtitle</span>
      Body text
      <sl-button slot="actions" fill="ghost" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
      <sl-button slot="actions" fill="solid" variant="primary" sl-dialog-close>Action</sl-button>
    </sl-dialog>`;
  }
};

export const DisableCancel: Story = {
  args: {
    body: 'You cannot close me by pressing the Escape key, or clicking the backdrop. This dialog also has no close button. The only way to close it is by clicking one of the action buttons.',
    closeButton: false,
    disableCancel: true,
    maxWidth: '300px',
    title: 'Disable cancel and close button'
  }
};

export const FooterButtons: Story = {
  args: {
    footerButtons: () => html`
      <sl-button fill="ghost" slot="actions" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
      <sl-button fill="outline" slot="actions" variant="primary" sl-dialog-close>Action 2</sl-button>
      <sl-button fill="solid" slot="actions" variant="primary" sl-dialog-close>Action</sl-button>
    `,
    reverse: false,
    title: 'Dialog with extra footer buttons'
  }
};

export const HeaderButtons: Story = {
  args: {
    headerButtons: () => {
      const onClick = (event: Event & { target: HTMLElement }): void => {
        event.target.closest('sl-dialog')?.close();
      };

      return html`
        <sl-button @click=${onClick} slot="header-buttons">Button 1</sl-button>
        <sl-button @click=${onClick} slot="header-buttons">Button 2</sl-button>
        <sl-button @click=${onClick} aria-label="Close" fill="ghost" slot="header-buttons">
          <sl-icon name="far-burst"></sl-icon>
        </sl-button>
      `;
    },
    title: 'Dialog with extra header buttons'
  }
};

export const Mobile: Story = {
  ...Basic,
  parameters: {
    viewport: {
      defaultViewport: 'iphone14'
    }
  }
};

export const Overflow: Story = {
  args: {
    body: 'Incididunt nisi id anim anim amet. Nostrud do laboris ex culpa tempor nisi consectetur qui eu adipisicing nostrud. Ut cillum pariatur esse est voluptate. Ullamco dolore cupidatat anim aliquip veniam exercitation. Consectetur enim eiusmod nisi veniam eu magna qui sunt anim laborum culpa laboris anim. Incididunt elit est sint irure anim laborum aliquip laboris sint. Qui ullamco culpa ipsum aliquip officia aute velit nostrud nisi pariatur sit dolor et. Non pariatur adipisicing ad magna veniam magna qui et irure qui. Duis proident voluptate aute tempor do laboris cupidatat et laborum enim ea labore duis voluptate.',
    title:
      'Nisi magna dolor ullamco voluptate irure adipisicing mollit ipsum ipsum irure. Non sunt occaecat mollit cillum pariatur enim ipsum aliquip do ex fugiat.',
    subtitle:
      'Esse exercitation do nisi nostrud sunt ea labore qui id laborum dolor cupidatat consequat excepteur. In aute veniam ullamco esse culpa id voluptate labore irure commodo aliquip amet Lorem. Quis tempor amet ea culpa non sint excepteur irure. Ad ipsum excepteur sunt sunt cillum Lorem. Fugiat consequat est ad qui Lorem Lorem. Ad cupidatat id mollit nostrud velit cillum eiusmod.'
  }
};

export const CustomComponent: Story = {
  render: () => {
    try {
      customElements.define('example-form-in-dialog', FormInDialog);
    } catch {
      /* empty */
    }

    const onClick = (event: Event & { target: HTMLElement }) => {
      (event.target.nextElementSibling as FormInDialog)?.showModal();
    };

    return html`
      <sl-button @click=${onClick}>Show Dialog</sl-button>
      <example-form-in-dialog></example-form-in-dialog>
    `;
  }
};
