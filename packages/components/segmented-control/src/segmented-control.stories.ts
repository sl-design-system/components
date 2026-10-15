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

type Props = Pick<SegmentedControl, 'emphasis' | 'fill' | 'iconOnly' | 'shape' | 'size'> & {
  ariaLabel?: string;
  description?: string;
  items: Item[];
  /** The value of the item that should be selected. */
  selected?: string;
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

const renderItems = (items: Item[], selected?: string): TemplateResult[] =>
  items.map(
    ({ disabled, icon, label, value }) => html`
      <sl-segmented-control-item
        ?disabled=${disabled}
        ?selected=${value === selected}
        value=${value}>
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
    description: { table: { disable: true } },
    emphasis: { control: 'inline-radio', options: ['subtle', 'bold'] },
    fill: { control: 'inline-radio', options: ['solid', 'outline'] },
    items: { table: { disable: true } },
    selected: { table: { disable: true } },
    shape: { control: 'inline-radio', options: ['rect', 'pill'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] }
  },
  render: ({
    ariaLabel,
    description,
    emphasis,
    fill,
    iconOnly,
    items,
    selected,
    shape,
    size
  }) => html`
    ${description ? html`<p>${description}</p>` : nothing}
    <sl-segmented-control
      ?icon-only=${iconOnly}
      aria-label=${ariaLabel}
      emphasis=${emphasis}
      fill=${fill}
      shape=${shape}
      size=${size}>
      ${renderItems(items, selected)}
    </sl-segmented-control>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    description:
      'Use a segmented control to switch between a few related options, for example different views of the same content. The options always have the same width.'
  }
};

export const Bold: Story = {
  args: {
    description:
      'With bold emphasis, the selected option has a strong background and no line under it. Use it when the selected option needs to stand out more.',
    emphasis: 'bold'
  }
};

export const Outline: Story = {
  args: {
    description: 'The outline version has a border instead of a grey background.',
    fill: 'outline'
  }
};

export const Pill: Story = {
  args: {
    description: 'The pill shape has fully round corners.',
    shape: 'pill'
  }
};

export const Large: Story = {
  args: {
    description: 'The large size has more space around the options.',
    size: 'lg'
  }
};

export const IconAndText: Story = {
  args: {
    description:
      'Options can have an icon before the label. The selected option shows a solid version of its icon.',
    items: iconItems,
    selected: 'grid'
  }
};

export const IconOnly: Story = {
  args: {
    description:
      'Only the icons are shown. Screen readers still read the label of each option. Use icons that are easy to understand.',
    iconOnly: true,
    items: iconItems
  }
};

export const Disabled: Story = {
  args: {
    description:
      'You can disable single options. A disabled option cannot be selected, and the arrow keys skip it.',
    items: disabledItems
  }
};

export const FillWidth: Story = {
  args: {
    description:
      'In this example, the whole control fills the available width. If there is not enough space, it switches to a full-width select. Resize the window to see it change.',
    items: fillWidthItems
  },
  render: ({
    ariaLabel,
    description,
    emphasis,
    fill,
    items,
    selected,
    shape,
    size
  }): TemplateResult => html`
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
    </style>

    <p>${description}</p>
    <sl-panel class="fill-width-demo">
      <div>Course navigation</div>
      <div>Select a course section</div>
      <sl-segmented-control
        aria-label=${ariaLabel}
        emphasis=${emphasis}
        fill=${fill}
        shape=${shape}
        size=${size}
        style="width: 100%">
        ${renderItems(items, selected)}
      </sl-segmented-control>
    </sl-panel>
  `
};

export const InvalidIcons: Story = {
  args: {
    description:
      'These examples use icons in the wrong way on purpose. In each example, all options are set up incorrectly. In development, they should show warnings in the browser console.'
  },
  render: ({ description }): TemplateResult => html`
    <style>
      .invalid-icons-demo {
        display: grid;
        gap: var(--sl-size-300);
      }

      .invalid-icons-demo__example {
        display: grid;
        gap: var(--sl-size-100);
        justify-items: start;
      }
    </style>

    <p>${description}</p>

    <div class="invalid-icons-demo">
      <div class="invalid-icons-demo__example">
        <div class="invalid-icons-demo__label">Icon only without an icon</div>
        <sl-segmented-control aria-label="View" icon-only>
          <sl-segmented-control-item value="list">List</sl-segmented-control-item>
          <sl-segmented-control-item value="grid">Grid</sl-segmented-control-item>
        </sl-segmented-control>
      </div>

      <div class="invalid-icons-demo__example">
        <div class="invalid-icons-demo__label">Selected icon without a default icon</div>
        <sl-segmented-control aria-label="View">
          <sl-segmented-control-item selected value="schedule">
            <sl-icon name="fas-calendar-days" slot="selected-icon"></sl-icon>
            Schedule
          </sl-segmented-control-item>
          <sl-segmented-control-item value="progress">
            <sl-icon name="fas-chart-line" slot="selected-icon"></sl-icon>
            Progress
          </sl-segmented-control-item>
        </sl-segmented-control>
      </div>

      <div class="invalid-icons-demo__example">
        <div class="invalid-icons-demo__label">The same icon in both slots</div>
        <sl-segmented-control aria-label="View">
          <sl-segmented-control-item selected value="resources">
            <sl-icon name="far-graduation-cap" slot="icon"></sl-icon>
            <sl-icon name="far-graduation-cap" slot="selected-icon"></sl-icon>
            Resources
          </sl-segmented-control-item>
          <sl-segmented-control-item value="lessons">
            <sl-icon name="far-book-open" slot="icon"></sl-icon>
            <sl-icon name="far-book-open" slot="selected-icon"></sl-icon>
            Lessons
          </sl-segmented-control-item>
        </sl-segmented-control>
      </div>
    </div>
  `
};

export const All: Story = {
  args: {
    description:
      'All fills, emphases, shapes and sizes, with text only, icon and text, and icon only.'
  },
  render: ({ description }): TemplateResult => {
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
      <p>${description}</p>
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
