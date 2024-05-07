import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type TabGroup } from './tab-group.js';
import { type TabPanel } from './tab-panel.js';

type Props = Pick<TabGroup, 'vertical' | 'alignTabs'> & {
  tabs?(): TemplateResult;
  tabPanels?(): TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'In progress/Tab Group',
  args: {
    alignTabs: 'start',
    vertical: false
  },
  argTypes: {
    alignTabs: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'stretch']
    },
    tabs: {
      table: {
        disable: true
      }
    },
    tabPanels: {
      table: {
        disable: true
      }
    }
  },
  render: ({ alignTabs, tabs, tabPanels, vertical }) => {
    return html`<sl-tab-group .alignTabs=${alignTabs} .vertical=${vertical}>${tabs?.()}${tabPanels?.()}</sl-tab-group>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    tabs: () => html`
      <sl-tab>First tab</sl-tab>
      <sl-tab>Second tab</sl-tab>
      <sl-tab disabled>Disabled</sl-tab>
      <sl-tab>Last tab that is longer than the rest</sl-tab>
    `,
    tabPanels: () => html`
      <sl-tab-panel>Contents tab 1</sl-tab-panel>
      <sl-tab-panel>Contents tab 2</sl-tab-panel>
      <sl-tab-panel>Contents tab 3</sl-tab-panel>
      <sl-tab-panel>Contents tab 4</sl-tab-panel>
    `
  }
};

export const InitialSelected: Story = {
  args: {
    ...Basic.args,
    tabs: () => html`
      <sl-tab>First tab</sl-tab>
      <sl-tab>Second tab</sl-tab>
      <sl-tab selected>Third tab</sl-tab>
      <sl-tab>Last tab that is longer than the rest</sl-tab>
    `
  }
};

export const Lazy: Story = {
  render: ({ alignTabs, vertical }) => {
    const onTabChange = (event: Event & { target: TabGroup }) => {
      document.querySelector('strong')!.textContent = event.target.selectedTab!.textContent;
    };

    return html`
      <sl-tab-group @sl-tab-change=${onTabChange} .alignTabs=${alignTabs} .vertical=${vertical}>
        <sl-tab>First tab</sl-tab>
        <sl-tab>Second tab</sl-tab>
        <sl-tab>Third tab</sl-tab>
        <sl-tab>Last tab that is longer than the rest</sl-tab>
        <p>
          This example does not have any tab panels. Instead it listens for the <code>sl-tab-change</code> event on the
          tab group and then programmatically updates this text. You can use this event to lazy load a tab's content.
        </p>
        <p>The selected tab is: <strong></strong></p>
      </sl-tab-group>
    `;
  }
};

export const Links: Story = {
  args: {
    tabs: () => html`
      <sl-tab href="javascript:alert('clicked')">First tab</sl-tab>
      <sl-tab href="javascript:alert('clicked')">Second tab</sl-tab>
      <sl-tab disabled href="javascript:alert('clicked')">Disabled</sl-tab>
      <sl-tab href="javascript:alert('clicked')">Last tab that is longer than the rest</sl-tab>
      <p>
        The tabs in this example all have links. There are no tab panels present in this example. If you right click a
        tab, you will notice the browser will prompt you to open the link in a new tab. This can be useful if you want
        to use a router in your application for the tabs.
      </p>
    `
  }
};

export const OverflowHorizontal: Story = {
  args: {
    tabs: () => html`
      <sl-tab>Tab 1</sl-tab>
      <sl-tab>Tab 2</sl-tab>
      <sl-tab>Tab 3</sl-tab>
      <sl-tab>Tab 4</sl-tab>
      <sl-tab>Tab 5</sl-tab>
      <sl-tab>Tab 6</sl-tab>
      <sl-tab>Tab 7</sl-tab>
      <sl-tab>Tab 8</sl-tab>
      <sl-tab>Tab 9</sl-tab>
      <sl-tab>Tab 10</sl-tab>
      <sl-tab>Tab 11</sl-tab>
      <sl-tab>Tab 12</sl-tab>
      <sl-tab>Tab 13</sl-tab>
      <sl-tab disabled>Tab 14</sl-tab>
      <sl-tab disabled>Tab 15</sl-tab>
      <sl-tab>Tab 16</sl-tab>
      <sl-tab>Tab 17</sl-tab>
      <sl-tab>Tab 18</sl-tab>
      <sl-tab>Tab 19</sl-tab>
      <sl-tab>Tab 20</sl-tab>
    `
  }
};

export const OverflowVertical: Story = {
  args: {
    ...OverflowHorizontal.args,
    vertical: true
  },
  render: ({ alignTabs, tabs, vertical }) => html`
    <style>
      sl-tab-group {
        block-size: calc(100dvh - 2rem);
      }
    </style>
    <sl-tab-group .alignTabs=${alignTabs} .vertical=${vertical}>${tabs?.()}</sl-tab-group>
  `
};

export const Responsive: Story = {
  parameters: {
    layout: 'fullscreen'
  },
  render: ({ alignTabs }) => html`
    <style>
      #root-inner {
        display: grid;
        grid-template-columns: 2rem 1fr 2rem;
      }

      sl-tab-group {
        grid-column: 1 / -1;
      }

      sl-tab-group::part(wrapper),
      sl-tab-panel {
        inline-size: 100%;
        margin-inline: auto;
        max-inline-size: min(80vw, 800px);
      }

      sl-tab-panel {
        padding: 1rem 0;
      }
    </style>
    <sl-tab-group .alignTabs=${alignTabs}>
      <sl-tab>First tab</sl-tab>
      <sl-tab>Second tab</sl-tab>
      <sl-tab>Third tab</sl-tab>
      <sl-tab>Last tab that is longer than the rest</sl-tab>
      <sl-tab-panel>
        This example demonstrates how you can have a responsive tab group that adjusts to the width of the page. The
        scroll container of the tabs has a max width and is centered on the page. There will always be an inline margin,
        so the tabs never contact the edge of the viewport.
      </sl-tab-panel>
    </sl-tab-group>
  `
};

export const Selected: Story = {
  args: {
    tabs: () => html`
      <sl-tab>First tab</sl-tab>
      <sl-tab>Second tab</sl-tab>
      <sl-tab>Third tab</sl-tab>
      <sl-tab>Last tab that is longer than the rest</sl-tab>
    `,
    tabPanels: () => {
      const onNext = (event: Event & { target: HTMLElement }) => {
        const tabGroup = event.target.closest('sl-tab-group') as TabGroup,
          panel = event.target.closest('sl-tab-panel') as TabPanel,
          index = Array.from(tabGroup?.querySelectorAll('sl-tab-panel') ?? []).indexOf(panel);

        tabGroup.tabs?.at(index + 1)?.setAttribute('selected', '');
      };

      const onPrevious = (event: Event & { target: HTMLElement }) => {
        const tabGroup = event.target.closest('sl-tab-group') as TabGroup,
          panel = event.target.closest('sl-tab-panel') as TabPanel,
          index = Array.from(tabGroup?.querySelectorAll('sl-tab-panel') ?? []).indexOf(panel);

        tabGroup.tabs?.at(index - 1)?.setAttribute('selected', '');
      };

      return html`
        <sl-tab-panel>
          <sl-button @click=${onNext}>Focus next tab</sl-button>
        </sl-tab-panel>
        <sl-tab-panel>
          <sl-button @click=${onPrevious}>Focus previous tab</sl-button>
          <sl-button @click=${onNext}>Focus next tab</sl-button>
        </sl-tab-panel>
        <sl-tab-panel>
          <sl-button @click=${onPrevious}>Focus previous tab</sl-button>
          <sl-button @click=${onNext}>Focus next tab</sl-button>
        </sl-tab-panel>
        <sl-tab-panel>
          <sl-button @click=${onPrevious}>Focus previous tab</sl-button>
        </sl-tab-panel>
      `;
    }
  }
};

export const Sticky: Story = {
  render: ({ alignTabs, vertical }) => html`
    <style>
      sl-tab-group::part(container) {
        position: sticky;
        inset-block-start: 0;
      }

      sl-tab-group[vertical]::part(container) {
        align-self: start;
      }

      sl-tab-panel {
        block-size: 200vh;
      }
    </style>
    <sl-tab-group .alignTabs=${alignTabs} ?vertical=${vertical}>
      <sl-tab>First tab</sl-tab>
      <sl-tab-panel>Contents tab 1</sl-tab-panel>

      <sl-tab>Second tab</sl-tab>
      <sl-tab-panel>Contents tab 2</sl-tab-panel>

      <sl-tab disabled>Disabled</sl-tab>
      <sl-tab-panel>Contents tab 3</sl-tab-panel>

      <sl-tab>Last tab that is longer than the rest</sl-tab>
      <sl-tab-panel>Contents tab 4</sl-tab-panel>
    </sl-tab-group>
  `
};

export const Subtitle: Story = {
  args: {
    ...Basic.args,
    tabs: () => html`
      <sl-tab>
        <sl-icon slot="icon" name="star" size="md"></sl-icon>
        Tab 1
        <span slot="subtitle">Tab 1 subtitle</span>
      </sl-tab>
      <sl-tab>
        <sl-icon slot="icon" name="star" size="md"></sl-icon>
        Tab 2
        <span slot="subtitle">Tab 2 subtitle</span>
      </sl-tab>
      <sl-tab>
        <sl-icon slot="icon" name="star" size="md"></sl-icon>
        Tab 3
        <span slot="subtitle">Tab 3 subtitle</span>
        <sl-badge slot="badge" size="lg" variant="danger">100</sl-badge>
      </sl-tab>
      <sl-tab>
        <sl-icon slot="icon" name="star" size="md"></sl-icon>
        Tab 4
        <span slot="subtitle">Tab 4 subtitle</span>
      </sl-tab>
    `
  }
};

export const Vertical: Story = {
  args: {
    ...Basic.args,
    vertical: true
  }
};
