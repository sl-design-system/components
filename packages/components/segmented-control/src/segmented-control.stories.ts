import {
  faBookOpen,
  faCalendarDays,
  faChartLine,
  faClipboardList,
  faGraduationCap,
  faGrid2,
  faList,
  faTable
} from '@fortawesome/pro-regular-svg-icons';
import {
  faBookOpen as fasBookOpen,
  faCalendarDays as fasCalendarDays,
  faChartLine as fasChartLine,
  faClipboardList as fasClipboardList,
  faGraduationCap as fasGraduationCap,
  faGrid2 as fasGrid2,
  faList as fasList,
  faTable as fasTable
} from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/panel/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import './register.js';
import { type SegmentedControl, type SegmentedControlItem } from './segmented-control.js';

type Props = Pick<
  SegmentedControl,
  'emphasis' | 'fill' | 'iconOnly' | 'items' | 'shape' | 'size' | 'value'
> & {
  ariaLabel?: string;
};
type Story = StoryObj<Props>;

Icon.register(
  faBookOpen,
  faCalendarDays,
  faChartLine,
  faClipboardList,
  faGraduationCap,
  faGrid2,
  faList,
  faTable,
  fasBookOpen,
  fasCalendarDays,
  fasChartLine,
  fasClipboardList,
  fasGraduationCap,
  fasGrid2,
  fasList,
  fasTable
);

const items: SegmentedControlItem[] = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid' },
  { label: 'Table', value: 'table' }
];

const iconItems: SegmentedControlItem[] = [
  { icon: 'far-list', label: 'List', selectedIcon: 'fas-list', value: 'list' },
  { icon: 'far-grid-2', label: 'Grid', selectedIcon: 'fas-grid-2', value: 'grid' },
  { icon: 'far-table', label: 'Table', selectedIcon: 'fas-table', value: 'table' }
];

const iconOnlyItems: SegmentedControlItem[] = iconItems;

const disabledItems: SegmentedControlItem[] = [
  {
    disabled: true,
    icon: 'far-book-open',
    label: 'Lessons',
    selectedIcon: 'fas-book-open',
    value: 'lessons'
  },
  {
    icon: 'far-clipboard-list',
    label: 'Assignments',
    selectedIcon: 'fas-clipboard-list',
    value: 'assignments'
  },
  { icon: 'far-chart-line', label: 'Progress', selectedIcon: 'fas-chart-line', value: 'progress' },
  {
    disabled: true,
    icon: 'far-calendar-days',
    label: 'Schedule',
    selectedIcon: 'fas-calendar-days',
    value: 'schedule'
  },
  {
    icon: 'far-graduation-cap',
    label: 'Resources',
    selectedIcon: 'fas-graduation-cap',
    value: 'resources'
  }
];

const fillWidthItems: SegmentedControlItem[] = [
  { icon: 'far-list', label: 'Overview', selectedIcon: 'fas-list', value: 'overview' },
  { icon: 'far-grid-2', label: 'Modules', selectedIcon: 'fas-grid-2', value: 'modules' },
  {
    icon: 'far-clipboard-list',
    label: 'Assignments',
    selectedIcon: 'fas-clipboard-list',
    value: 'assignments'
  },
  { icon: 'far-chart-line', label: 'Progress', selectedIcon: 'fas-chart-line', value: 'progress' },
  {
    icon: 'far-calendar-days',
    label: 'Schedule',
    selectedIcon: 'fas-calendar-days',
    value: 'schedule'
  }
];

export default {
  title: 'Actions/Segmented control',
  tags: ['draft'],
  args: {
    ariaLabel: 'View',
    emphasis: 'subtle',
    fill: 'solid',
    items,
    shape: 'rect',
    size: 'md'
  },
  argTypes: {
    emphasis: { control: 'inline-radio', options: ['subtle', 'bold'] },
    fill: { control: 'inline-radio', options: ['solid', 'outline'] },
    shape: { control: 'inline-radio', options: ['rect', 'pill'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] }
  },
  render: ({ ariaLabel, emphasis, fill, iconOnly, items, shape, size, value }) => html`
    <sl-segmented-control
      .iconOnly=${iconOnly}
      .items=${items}
      .value=${value}
      aria-label=${ariaLabel}
      emphasis=${emphasis}
      fill=${fill}
      shape=${shape}
      size=${size}></sl-segmented-control>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Bold: Story = { args: { emphasis: 'bold' } };

export const Outline: Story = { args: { fill: 'outline' } };

export const Pill: Story = { args: { shape: 'pill' } };

export const Large: Story = { args: { size: 'lg' } };

export const IconAndText: Story = { args: { items: iconItems } };

export const IconOnly: Story = {
  args: { iconOnly: true, items: iconOnlyItems }
};

export const Disabled: Story = { args: { items: disabledItems } };

export const FillWidth: Story = {
  args: {
    items: fillWidthItems
  },
  render: ({ ariaLabel, emphasis, fill, items, shape, size, value }): TemplateResult => html`
    <style>
      sl-panel.fill-width-demo {
        inline-size: 100%;
        max-inline-size: 1000px;
      }

      .fill-width-demo sl-segmented-control::part(select) {
        display: flex;
        inline-size: 100%;
      }

      sl-panel.fill-width-demo::part(content) {
        display: grid;
        gap: var(--sl-size-200);
        padding: var(--sl-size-400);
      }

      .fill-width-demo__eyebrow {
        color: var(--sl-color-foreground-neutral-weakest);
        font: var(--sl-text-label-lg);
      }

      .fill-width-demo__label {
        color: var(--sl-color-foreground-neutral-plain);
        font: var(--sl-text-body-default-bold);
      }
    </style>

    <sl-panel class="fill-width-demo">
      <div class="fill-width-demo__eyebrow">Course navigation</div>
      <div class="fill-width-demo__label">Select a course section</div>
      <sl-segmented-control
        .items=${items}
        .value=${value}
        aria-label=${ariaLabel}
        emphasis=${emphasis}
        fill=${fill}
        shape=${shape}
        size=${size}
        style="width: 100%"></sl-segmented-control>
    </sl-panel>
  `
};

export const All: Story = {
  render: (): TemplateResult => {
    const content = [
        { items, label: 'text only' },
        { items: iconItems, label: 'icon + text' },
        { iconOnly: true, items: iconOnlyItems, label: 'icon only' }
      ],
      emphases = ['subtle', 'bold'] as const,
      fills = ['solid', 'outline'] as const,
      shapes = ['rect', 'pill'] as const,
      sizes = ['md', 'lg'] as const;

    return html`
      <style>
        table {
          border-collapse: separate;
          border-spacing: 0 var(--sl-size-100);
        }

        th,
        td {
          padding-inline-end: var(--sl-size-400);
          text-align: start;
          vertical-align: middle;
        }

        th:last-child,
        td:last-child {
          padding-inline-end: 0;
        }
      </style>
      <table>
        <tr>
          <th>Options</th>
          ${sizes.flatMap(size => shapes.map(shape => html`<th>${shape} - ${size}</th>`))}
        </tr>
        ${fills.flatMap(fill =>
          emphases.flatMap(emphasis =>
            content.map(
              ({ iconOnly, items, label }) => html`
                <tr>
                  <th>${fill}, ${emphasis}, ${label}</th>
                  ${sizes.flatMap(size =>
                    shapes.map(
                      shape => html`
                        <td>
                          <sl-segmented-control
                            ?icon-only=${iconOnly}
                            .items=${items}
                            aria-label="View"
                            emphasis=${emphasis}
                            fill=${fill}
                            shape=${shape}
                            size=${size}></sl-segmented-control>
                        </td>
                      `
                    )
                  )}
                </tr>
              `
            )
          )
        )}
      </table>
    `;
  }
};
