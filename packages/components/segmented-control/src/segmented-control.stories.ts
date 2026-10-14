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
import { type TemplateResult, html, nothing } from 'lit';
import './register.js';
import { type SegmentedControl } from './segmented-control.js';

interface Item {
  disabled?: boolean;
  icon?: string;
  label: string;
  value: string;
}

type Props = Pick<
  SegmentedControl,
  'emphasis' | 'fill' | 'iconOnly' | 'shape' | 'size' | 'value'
> & {
  ariaLabel?: string;
  items: Item[];
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

const items: Item[] = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid' },
  { label: 'Table', value: 'table' }
];

/** Icon names without the prefix; `far-` is used for the icon, `fas-` for the selected icon. */
const iconItems: Item[] = [
  { icon: 'list', label: 'List', value: 'list' },
  { icon: 'grid-2', label: 'Grid', value: 'grid' },
  { icon: 'table', label: 'Table', value: 'table' }
];

const disabledItems: Item[] = [
  { disabled: true, icon: 'book-open', label: 'Lessons', value: 'lessons' },
  { icon: 'clipboard-list', label: 'Assignments', value: 'assignments' },
  { icon: 'chart-line', label: 'Progress', value: 'progress' },
  { disabled: true, icon: 'calendar-days', label: 'Schedule', value: 'schedule' },
  { icon: 'graduation-cap', label: 'Resources', value: 'resources' }
];

const fillWidthItems: Item[] = [
  { icon: 'list', label: 'Overview', value: 'overview' },
  { icon: 'grid-2', label: 'Modules', value: 'modules' },
  { icon: 'clipboard-list', label: 'Assignments', value: 'assignments' },
  { icon: 'chart-line', label: 'Progress', value: 'progress' },
  { icon: 'calendar-days', label: 'Schedule', value: 'schedule' }
];

const renderItems = (items: Item[]): TemplateResult[] =>
  items.map(
    ({ disabled, icon, label, value }) => html`
      <sl-segmented-control-item ?disabled=${disabled} value=${value}>
        ${
          icon
            ? html`
                <sl-icon name="far-${icon}" slot="icon"></sl-icon>
                <sl-icon name="fas-${icon}" slot="selected-icon"></sl-icon>
              `
            : nothing
        }
        ${label}
      </sl-segmented-control-item>
    `
  );

export default {
  title: 'Actions/Segmented control',
  tags: ['draft'],
  args: {
    ariaLabel: 'View',
    emphasis: 'subtle',
    fill: 'solid',
    iconOnly: false,
    items,
    shape: 'rect',
    size: 'md'
  },
  argTypes: {
    emphasis: { control: 'inline-radio', options: ['subtle', 'bold'] },
    fill: { control: 'inline-radio', options: ['solid', 'outline'] },
    items: { table: { disable: true } },
    shape: { control: 'inline-radio', options: ['rect', 'pill'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] }
  },
  render: ({ ariaLabel, emphasis, fill, iconOnly, items, shape, size, value }) => html`
    <sl-segmented-control
      ?icon-only=${iconOnly}
      .value=${value}
      aria-label=${ariaLabel}
      emphasis=${emphasis}
      fill=${fill}
      shape=${shape}
      size=${size}>
      ${renderItems(items)}
    </sl-segmented-control>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Bold: Story = { args: { emphasis: 'bold' } };

export const Outline: Story = { args: { fill: 'outline' } };

export const Pill: Story = { args: { shape: 'pill' } };

export const Large: Story = { args: { size: 'lg' } };

export const IconAndText: Story = { args: { items: iconItems } };

export const IconOnly: Story = { args: { iconOnly: true, items: iconItems } };

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
        .value=${value}
        aria-label=${ariaLabel}
        emphasis=${emphasis}
        fill=${fill}
        shape=${shape}
        size=${size}
        style="width: 100%">
        ${renderItems(items)}
      </sl-segmented-control>
    </sl-panel>
  `
};

export const All: Story = {
  render: (): TemplateResult => {
    const content = [
        { iconOnly: false, items, label: 'text only' },
        { iconOnly: false, items: iconItems, label: 'icon + text' },
        { iconOnly: true, items: iconItems, label: 'icon only' }
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
                            aria-label="View"
                            emphasis=${emphasis}
                            fill=${fill}
                            shape=${shape}
                            size=${size}>
                            ${renderItems(items)}
                          </sl-segmented-control>
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
