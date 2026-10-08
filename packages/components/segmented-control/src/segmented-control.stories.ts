import { faGrid2, faList, faTable } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import './register.js';
import { type SegmentedControl, type SegmentedControlItem } from './segmented-control.js';

type Props = Pick<SegmentedControl, 'emphasis' | 'fill' | 'items' | 'shape' | 'size' | 'value'> & {
  ariaLabel?: string;
};
type Story = StoryObj<Props>;

Icon.register(faGrid2, faList, faTable);

const items: SegmentedControlItem[] = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid' },
  { label: 'Table', value: 'table' }
];

const iconItems: SegmentedControlItem[] = [
  { icon: 'far-list', label: 'List', value: 'list' },
  { icon: 'far-grid-2', label: 'Grid', value: 'grid' },
  { icon: 'far-table', label: 'Table', value: 'table' }
];

const iconOnlyItems: SegmentedControlItem[] = iconItems.map(item => ({
  ...item,
  hideLabel: true
}));

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
  render: ({ ariaLabel, emphasis, fill, items, shape, size, value }) => html`
    <sl-segmented-control
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

export const IconOnly: Story = { args: { items: iconOnlyItems } };

export const All: Story = {
  render: (): TemplateResult => {
    const content = [
        { items, label: 'text only' },
        { items: iconItems, label: 'icon + text' },
        { items: iconOnlyItems, label: 'icon only' }
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
              ({ items, label }) => html`
                <tr>
                  <th>${fill}, ${emphasis}, ${label}</th>
                  ${sizes.flatMap(size =>
                    shapes.map(
                      shape => html`
                        <td>
                          <sl-segmented-control
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
