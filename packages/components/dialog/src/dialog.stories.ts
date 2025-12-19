import { faBurst } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/combobox/register.js';
import '@sl-design-system/date-field/register.js';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/listbox/register.js';
import { FormInDialog } from '@sl-design-system/lit-examples';
import '@sl-design-system/popover/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { userEvent, within } from 'storybook/test';
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
      ${maxWidth
        ? html`
            <style>
              sl-dialog::part(dialog) {
                max-inline-size: ${maxWidth};
              }
            </style>
          `
        : nothing}
      <style>
        h2 {
          font-size: inherit;
          font-weight: inherit;
          margin: 0;
        }
      </style>
      <sl-button @click=${onClick}>Show Dialog</sl-button>
      <sl-dialog ?close-button=${closeButton} ?disable-cancel=${disableCancel}>
        <h2 slot="title">${title}</h2>
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
      'This is an example of a basic dialog. It has a title, a body, primary actions in the form of a cancel button and action button and a secondary action in the form of a delete button.',
    primaryActions: () => html`
      <sl-button slot="primary-actions" sl-dialog-close>Cancel</sl-button>
      <sl-button slot="primary-actions" variant="primary" sl-dialog-close>Action</sl-button>
    `,
    secondaryActions: () => html`
      <sl-button fill="outline" slot="secondary-actions" sl-dialog-close variant="primary">Secondary action</sl-button>
    `
  }
};

export const CloseButton: Story = {
  args: {
    body: () => 'This dialog has a close button. Use this blah die blah die blah.',
    closeButton: true,
    primaryActions: () => html`
      <sl-button slot="primary-actions" variant="primary" sl-dialog-close>Action</sl-button>
    `,
    title: 'Close button'
  }
};

export const DisableCancel: Story = {
  args: {
    body: () =>
      'You cannot close me by pressing the Escape key, or clicking the backdrop. This dialog also has no close button. The only way to close it is by clicking one of the action buttons.',
    disableCancel: true,
    maxWidth: 'min(400px, 80vw)',
    primaryActions: () => html`<sl-button slot="primary-actions" sl-dialog-close>Close</sl-button>`,
    title: 'Disable cancel'
  }
};

export const Inheritance: Story = {
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

export const Lazy: Story = {
  render: () => {
    const onClick = async (event: Event & { target: HTMLElement }) => {
      const dialog = document.createElement('sl-dialog');
      dialog.innerHTML = `
        <style>
          h2 {
            font-size: inherit;
            font-weight: inherit;
            margin: 0;
          }
        </style>
        <h2 slot="title">Lazy dialog</h2>
        This dialog is not created until you click the button. It is added to the DOM in the click event handler, and removed in the close event handler.
        <sl-button slot="primary-actions" sl-dialog-close variant="primary">Close</sl-button>
      `;
      dialog.addEventListener('sl-close', () => dialog.remove());

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
      defaultViewport: 'iphone5'
    }
  },
  args: {
    ...Basic.args,
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

        <sl-form-field label="Address">
          <sl-text-field name="address" placeholder="Address"></sl-text-field>
        </sl-form-field>

        <sl-form-field label="City">
          <sl-text-field name="city" placeholder="City"></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Description">
          <sl-text-area></sl-text-area>
        </sl-form-field>
      </sl-form>
    `,
    primaryActions: () => html`
      <sl-button slot="primary-actions" sl-dialog-close>Cancel</sl-button>
      <sl-button slot="primary-actions" variant="primary" sl-dialog-close>Save</sl-button>
    `,
    secondaryActions: () => html`
      <sl-button slot="secondary-actions" sl-dialog-close variant="danger">Delete account</sl-button>
    `,
    title: 'Edit account'
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
      <style>
        h2 {
          font-size: inherit;
          font-weight: inherit;
          margin: 0;
        }
      </style>
      <sl-button fill="outline" size="md" @click=${onClick} data-testid="button">Show Dialog</sl-button>
      <sl-dialog close-button disable-cancel>
        <h2 slot="title">Title</h2>
        Body text
        <sl-button slot="primary-actions" sl-dialog-close autofocus>Cancel</sl-button>
        <sl-button slot="primary-actions" variant="primary" sl-dialog-close>Action</sl-button>
      </sl-dialog>
    `;
  }
};

export const DialogWithOverlayComponents: Story = {
  render: () => {
    const onClick = async (event: Event & { target: HTMLElement }) => {
      const dialog = document.createElement('sl-dialog');

      const onClickPopover = (): void => {
        const popover = document.getElementById('popover-example') as HTMLElement & { togglePopover(): void };
        popover?.togglePopover();
      };

      const hidePopover = (): void => {
        const popover = document.getElementById('popover-example') as HTMLElement & { togglePopover(): void };
        popover?.hidePopover();
      };

      dialog.innerHTML = `
        <style>
          h2 {
            font-size: inherit;
            font-weight: inherit;
            margin: 0;
          }
        </style>
        <h2 slot="title">Dialog with overlay components</h2>
        <div class="container">
          This dialog should not close when any overlay component is closed using the Escape key.
          <sl-form>
            <sl-date-field autofocus select-only placeholder="Choose a date" style="width: fit-content"> </sl-date-field>

            <sl-select placeholder="Select an option">
              <sl-option value="1">Option 1</sl-option>
              <sl-option value="2">Option 2</sl-option>
              <sl-option value="3">Option 3</sl-option>
              <sl-option value="3">Option 4</sl-option>
              <sl-option value="3">Option 5</sl-option>
            </sl-select>

            <sl-combobox multiple value='["0","2"]'>
              <sl-listbox>
                <sl-option value="0">Mathematics</sl-option>
                <sl-option value="1">Geography</sl-option>
                <sl-option value="2">Physics</sl-option>
                <sl-option value="3">History</sl-option>
                <sl-option value="4">Biology</sl-option>
                <sl-option value="4">Art</sl-option>
              </sl-listbox>
            </sl-combobox>

            <sl-button id="anchor" variant="primary">Show definition</sl-button>
            <sl-popover id="popover-example" anchor="anchor">
              <header style="font-size: 1.1em; padding-block-end: 1rem;">Word Definition</header>
              <section style="padding-block-end: 1rem;">
                <strong>Photosynthesis</strong> is the process by which green plants and some other organisms <br/>
                use sunlight to synthesize foods from carbon dioxide and water.
              </section>
              <footer>
                <sl-button id="closeButton" size="sm" variant="primary">Got it</sl-button>
              </footer>
            </sl-popover>

            <sl-menu-button position="bottom">
              <span slot="button">Actions</span>
              <sl-menu-item><sl-icon name="smile"></sl-icon>Profile</sl-menu-item>
              <sl-menu-item><sl-icon name="calendar"></sl-icon>Settings</sl-menu-item>
              <sl-menu-item><sl-icon name="far-trash"></sl-icon>Remove</sl-menu-item>
            </sl-menu-button>
          </sl-form>
        </div>
        <sl-button slot="primary-actions" sl-dialog-close variant="primary">Close</sl-button>
      `;

      dialog.closeButton = true;

      dialog.addEventListener('sl-close', () => {
        dialog.remove();
      });

      event.target.insertAdjacentElement('afterend', dialog);

      dialog.querySelector('#anchor')?.addEventListener('click', onClickPopover);

      dialog.querySelector('#closeButton')?.addEventListener('click', hidePopover);

      await dialog.updateComplete;

      dialog.showModal();
    };

    return html`
      <style>
        .container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-block-end: 0.5rem;
        }

        section {
          margin-block-end: 1rem;
        }
      </style>
      <section>
        This example shows a dialog with overlay components (such as date fields, selects, comboboxes, popovers, and
        menu buttons). <br />
        The main purpose is to verify that closing any of these overlay components (for example, by pressing the
        <code>Escape</code> key) does not accidentally close the parent dialog.
      </section>
      <sl-button @click=${onClick}>Open dialog</sl-button>
    `;
  }
};
