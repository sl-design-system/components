import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type Popover } from './popover.js';

type Props = Pick<Popover, 'position'> & {
  alignSelf: string;
  body: string | (() => TemplateResult);
  maxWidth: number;
  noDescribedby: boolean;
  justifySelf: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Popover',
  tags: ['stable'],
  args: {
    alignSelf: 'center',
    body: "I'm a popover example",
    justifySelf: 'center',
    position: 'bottom'
  },
  argTypes: {
    alignSelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    body: {
      table: { disable: true }
    },
    maxWidth: {
      control: 'number'
    },
    justifySelf: {
      control: 'inline-radio',
      options: ['start', 'center', 'end']
    },
    position: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end'
      ]
    }
  },
  render: ({ alignSelf, justifySelf, body, maxWidth, position, noDescribedby }) => {
    const onClick = (): void => {
      const popover = document.querySelector('sl-popover') as HTMLElement;
      popover.togglePopover();
    };

    return html`
      <style>
        #root-inner {
          display: grid;
          height: calc(100dvh - 2rem);
          place-items: center;
        }
        sl-popover {
          --sl-popover-max-inline-size: ${maxWidth ? `${maxWidth}px` : 'none'};
        }
      </style>
      <sl-button
        @click=${onClick}
        id="button"
        variant="primary"
        style=${styleMap({ 'align-self': alignSelf, 'justify-self': justifySelf })}
        >Toggle</sl-button
      >
      <sl-popover anchor="button" ?no-describedby=${noDescribedby} .position=${position}
        >${typeof body === 'string' ? body : body()}</sl-popover
      >
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    maxWidth: 400,
    body: () => {
      const onClick = (): void => {
        return;
      };
      return html`
        <header style="font:var(--sl-text-new-heading-sm);">Hello! I am a popover!</header>
        <section>
          <p>
            I'm a lightweight and flexible UI element that appears on top of other content. I am often used to display
            additional information, actions, or contextual content without disrupting the main flow of the interface.
          </p>
        </section>
        <sl-button @click=${onClick} variant="primary">Button</sl-button>
      `;
    }
  }
};

export const NoDescribedBy: Story = {
  args: {
    noDescribedby: true,
    body: () => {
      return html`
        Lorem ipsum dolor sit amet, qui deserunt esse minim cillum nostrud exercitation veniam consequat pariatur
        exercitation laborum nostrud culpa sunt exercitation pariatur. Nisi ipsum est ullamco nostrud sit pariatur. Ex
        nisi ipsum et est nulla ex ex.
      `;
    }
  }
};

export const VerticalOverflow: Story = {
  args: {
    body: () => {
      return html`
        Lorem<br />
        ipsum<br />
        dolor<br />
        sit<br />
        amet,<br />
        qui<br />
        deserunt<br />
        esse<br />
        minim<br />
        cillum<br />
        nostrud<br />
        exercitation<br />
        veniam<br />
        consequat<br />
        pariatur<br />
        exercitation<br />
        laborum<br />
        nostrud<br />
        culpa<br />
        sunt<br />
        exercitation<br />
        pariatur.<br />
        Nisi<br />
        ipsum<br />
        est<br />
        ullamco<br />
        nostrud<br />
        sit<br />
        pariatur.<br />
        Ex<br />
        nisi<br />
        ipsum<br />
        et<br />
        est<br />
        nulla<br />
        ex<br />
        ex.
      `;
    }
  }
};

export const RichContent: Story = {
  args: {
    body: () => {
      const onClick = (): void => {
        return;
      };

      return html`
        <style>
          section {
            margin: 16px 0;
          }
          sl-popover {
            max-width: 300px;
          }
        </style>
        <header>
          <sl-avatar
            display-name="Yousef van der Schaaf"
            picture-url="https://randomuser.me/api/portraits/thumb/men/19.jpg"
          ></sl-avatar>
        </header>
        <section>
          <p>Our longest serving math teacher, but also responsible for several extracurricular activities.</p>
          <p><strong>Manager:</strong> Anna Johansson</p>
        </section>
        <sl-button-bar align="end">
          <sl-button @click=${onClick} size="sm" variant="primary" fill="outline">Send email</sl-button>
          <sl-button @click=${onClick} size="sm" variant="primary">Send Slack message</sl-button>
        </sl-button-bar>
      `;
    }
  }
};

export const All: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelectorAll('sl-popover').forEach(popover => {
        popover.showPopover();
      });
    });

    return html`
      <style>
        div {
          margin: 52px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      </style>
      <div>
        <sl-button id="anchor" variant="primary">This is a popover anchor element (sl-button component) </br> with all top and bottom popover allowed positions shown <br> all examples at once</sl-button>
        <sl-popover anchor="anchor" popover="manual" position="top">Top</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="top-start">Top start</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="top-end">Top end</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="bottom">Bottom</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="bottom-start">Bottom start</sl-popover>
        <sl-popover anchor="anchor" popover="manual" position="bottom-end">Bottom end</sl-popover>
      </div>

      <div>
        <sl-button id="anchor2" variant="primary" style="width: 72px; padding: 24px;">This is a popover anchor element (sl-button component) with all right and left popover allowed positions shown all examples at once</sl-button>
        <sl-popover anchor="anchor2" popover="manual" position="right">Right <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="right-start">Right <br> start <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="right-end">Right <br> end <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="left">Left <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="left-start">Left <br> start <br> example</sl-popover>
        <sl-popover anchor="anchor2" popover="manual" position="left-end">Left <br> end <br> example</sl-popover>
      </div>
    `;
  }
};
