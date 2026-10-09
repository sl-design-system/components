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

const fillWidthItems: SegmentedControlItem[] = [
  { icon: 'far-list', label: 'Label', value: 'label-1' },
  { icon: 'far-list', label: 'Label', value: 'label-2' },
  { icon: 'far-list', label: 'Label', value: 'label-3' },
  { icon: 'far-list', label: 'Label', value: 'label-4' },
  { icon: 'far-list', label: 'Label', value: 'label-5' }
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

export const FillWidth: Story = {
  args: {
    items: fillWidthItems
  },
  render: ({ ariaLabel, emphasis, fill, items, shape, size, value }): TemplateResult => html`
    <style>
      .fill-width-demo {
        background: var(--sl-color-background-neutral-subtle);
        display: grid;
        gap: var(--sl-size-200);
        max-inline-size: 900px;
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

      .fill-width-demo sl-segmented-control {
        display: block;
        inline-size: 100%;
      }
    </style>

    <div class="fill-width-demo">
      <div class="fill-width-demo__eyebrow">Parent container</div>
      <div class="fill-width-demo__label">fill width</div>
      <sl-segmented-control
        .items=${items}
        .value=${value}
        aria-label=${ariaLabel}
        emphasis=${emphasis}
        fill=${fill}
        shape=${shape}
        size=${size}
        style="width: 100%"></sl-segmented-control>
    </div>
  `
};

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
