import { faBurst } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { FormInDialog } from '@sl-design-system/lit-examples';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { userEvent, within } from '@storybook/test';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { type Dialog } from './dialog.js';

type Props = Pick<Dialog, 'closeButton' | 'disableCancel'> & {
  body?(): string | TemplateResult;
  footerButtons?(props: Props): TemplateResult;
  headerButtons?(props: Props): TemplateResult;
  maxWidth: string;
  primaryActions?(): TemplateResult;
  secondaryActions?(): TemplateResult;
  subtitle: string;
  title: string;
};
type Story = StoryObj<Props>;

Icon.register(faBurst);

export default {
  title: 'Overlay/Dialog',
  tags: ['stable'],
  args: {
    body: () =>
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac augue neque. Nunc sed ex ut neque lacinia rutrum nec vitae mi. Donec dictum urna elit, et feugiat nunc fringilla nec. Maecenas nisi lorem, facilisis nec libero ut, hendrerit ultricies orci. Vivamus massa ligula, ultricies quis odio a, scelerisque tincidunt lorem. Morbi quis pulvinar augue. Nunc eros magna, laoreet vitae ornare at, iaculis quis diam. Duis odio urna, viverra ut ex mattis, egestas tincidunt enim. Praesent ac ex tincidunt, hendrerit sem et, aliquam metus. Nunc quis nisi nulla. Sed nibh ante, posuere eu volutpat vitae, elementum ut leo. Ut aliquet tincidunt tellus, ut molestie urna ultrices in. Suspendisse potenti. Nunc non nunc eu nibh venenatis vestibulum. Maecenas rutrum nibh lacus. Fusce sodales purus ut arcu hendrerit, non interdum nulla suscipit. Duis vitae felis facilisis, eleifend ipsum ut, condimentum est. Nullam metus massa, venenatis vitae suscipit in, feugiat quis turpis. In pellentesque velit at sagittis mattis. Nam ut tellus elit.',
    closeButton: false,
    disableCancel: false,
    title: 'Title'
  },
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  render: args => {
    const {
      body,
      closeButton,
      disableCancel,
      footerButtons,
      headerButtons,
      maxWidth,
      primaryActions,
      secondaryActions,
      subtitle,
      title
    } = args;

    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as Dialog).showModal();
    };

    return html`
      <style>
        html {
          background: var(--sl-color-palette-grey-800);

          @media (width <= 600px) {
            @media (prefers-reduced-motion: no-preference) {
              body {
                animation: dialog-leave 300ms ease-out forwards;
              }

              &.sl-dialog-enter body {
                animation: dialog-enter 500ms ease-in forwards;
              }
            }
          }
        }
        body {
          background: var(--sl-elevation-surface-base-default);
          min-block-size: 100dvh;
          transform-origin: top;
        }
        @keyframes dialog-enter {
          from {
            border-radius: 0px;
            scale: 1;
            translate: 0;
          }
          to {
            border-radius: 6px;
            scale: var(--sl-dialog-scale);
            translate: var(--sl-dialog-translate);
          }
        }
        @keyframes dialog-leave {
          from {
            border-radius: 6px;
            scale: var(--sl-dialog-scale);
            translate: var(--sl-dialog-translate);
          }
          to {
            border-radius: 0px;
            scale: 1;
            translate: 0;
          }
        }
        sl-dialog {
          ${maxWidth ? `--sl-dialog-max-inline-size: ${maxWidth}` : ''};
        }
      </style>
      <sl-button fill="outline" size="md" @click=${onClick}>Show Dialog</sl-button>
      <sl-dialog ?close-button=${closeButton} ?disable-cancel=${disableCancel}>
        <span slot="title">${title}</span>
        ${subtitle ? html`<span slot="subtitle">${subtitle}</span>` : nothing} ${body?.()}
        ${headerButtons ? headerButtons(args) : nothing} ${primaryActions ? primaryActions() : nothing}
        ${secondaryActions ? secondaryActions() : nothing} ${footerButtons ? footerButtons(args) : nothing}
      </sl-dialog>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    body: () =>
      'This is an example of a basic dialog. It has a title, a body, and primary actions in the form of a cancel button and action button.',
    primaryActions: () => html`
      <sl-button slot="primary-actions" sl-dialog-close>Cancel</sl-button>
      <sl-button slot="primary-actions" variant="primary" sl-dialog-close>Action</sl-button>
    `,
    secondaryActions: () => html`
      <sl-button slot="secondary-actions" sl-dialog-close variant="danger">Delete</sl-button>
    `
  }
};

export const DisableCancel: Story = {
  args: {
    body: () =>
      'You cannot close me by pressing the Escape key, or clicking the backdrop. This dialog also has no close button. The only way to close it is by clicking one of the action buttons.',
    closeButton: false,
    disableCancel: true,
    maxWidth: '300px',
    title: 'Disable cancel and close button'
  }
};

export const Empty: Story = {
  args: {
    body: () =>
      'Since there are no elements inside the dialog that are focusable, the dialog itself should have focus.',
    closeButton: false,
    footerButtons: () => html`Nothing here`
  }
};

export const FooterButtons: Story = {
  args: {
    footerButtons: () => html`
      <sl-button fill="ghost" slot="actions" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
      <sl-button fill="outline" slot="actions" variant="primary" sl-dialog-close>Action 2</sl-button>
      <sl-button slot="actions" variant="primary" sl-dialog-close>Action</sl-button>
    `,
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

export const Lazy: Story = {
  render: () => {
    const onClick = async (event: Event & { target: HTMLElement }) => {
      const dialog = document.createElement('sl-dialog');
      dialog.innerHTML = `
        <span slot="title">Title</span>
        Hello world!
      `;
      dialog.addEventListener('sl-close', () => {
        console.log('Dialog closed');

        dialog.remove();
      });

      event.target.insertAdjacentElement('afterend', dialog);
      await dialog.updateComplete;
      dialog.showModal();
    };

    return html`<sl-button @click=${onClick}>Show dialog</sl-button>`;
  }
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone6'
    }
  },
  args: {
    body: () =>
      'The dialog behaves differently on mobile. It will animate in from the bottom of the screen. The contents behind the dialog will scale down to give the appearance if the dialog being on top.'
  }
};

export const MobileScrolling: Story = {
  ...Mobile,
  args: {
    body: () => html`
      <sl-form>
        <sl-form-field label="First name">
          <sl-text-field autofocus name="firstname" placeholder="First name"></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Last name">
          <sl-text-field name="lastname" placeholder="Last name"></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Email address">
          <sl-text-field name="email" placeholder="Enter your email address" type="email"></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Description">
          <sl-text-area></sl-text-area>
        </sl-form-field>

        <sl-button fill="solid" variant="danger">Delete account</sl-button>
      </sl-form>
    `,
    title: 'Edit account'
  }
};

export const Overflow: Story = {
  args: {
    body: () =>
      'Incididunt nisi id anim anim amet. Nostrud do laboris ex culpa tempor nisi consectetur qui eu adipisicing nostrud. Ut cillum pariatur esse est voluptate. Ullamco dolore cupidatat anim aliquip veniam exercitation. Consectetur enim eiusmod nisi veniam eu magna qui sunt anim laborum culpa laboris anim. Incididunt elit est sint irure anim laborum aliquip laboris sint. Qui ullamco culpa ipsum aliquip officia aute velit nostrud nisi pariatur sit dolor et. Non pariatur adipisicing ad magna veniam magna qui et irure qui. Duis proident voluptate aute tempor do laboris cupidatat et laborum enim ea labore duis voluptate.',
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

export const All: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByTestId('button'));
  },
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as Dialog).showModal();
    };

    return html`
      <sl-button fill="outline" size="md" @click=${onClick} data-testid="button">Show Dialog</sl-button>
      <sl-dialog close-button disable-cancel>
        <span slot="title">Title</span>
        <span slot="subtitle">Subtitle</span>
        Body text
        <sl-button slot="actions" fill="ghost" variant="default" sl-dialog-close autofocus>Cancel</sl-button>
        <sl-button slot="actions" variant="primary" sl-dialog-close>Action</sl-button>
      </sl-dialog>
    `;
  }
};
