import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { TreeNode } from './tree-node.js';

try {
  customElements.define('sl-tree-node', TreeNode);
} catch {
  /* empty */
}

type Props = Pick<
  TreeNode,
  | 'disabled'
  | 'expandable'
  | 'expanded'
  | 'indeterminate'
  | 'lastNodeInLevel'
  | 'level'
  | 'levelGuides'
  | 'multiple'
  | 'selectable'
  | 'selected'
  | 'type'
> & { text: string };
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Tree/Node',
  args: {
    disabled: false,
    expandable: false,
    expanded: false,
    indeterminate: false,
    lastNodeInLevel: false,
    level: 0,
    multiple: false,
    selectable: false,
    selected: false,
    text: 'Tree node',
    type: 'node'
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['node', 'placeholder', 'skeleton']
    }
  },
  render: ({
    disabled,
    expandable,
    expanded,
    indeterminate,
    lastNodeInLevel,
    level,
    levelGuides,
    multiple,
    selectable,
    selected,
    text,
    type
  }) => {
    return html`
      <sl-tree-node
        ?disabled=${disabled}
        ?expandable=${expandable}
        ?expanded=${expanded}
        ?indeterminate=${indeterminate}
        ?last-node-in-level=${lastNodeInLevel}
        .levelGuides=${levelGuides}
        level=${level}
        ?multiple=${multiple}
        ?selectable=${selectable}
        ?selected=${selected}
        type=${ifDefined(type)}>
        ${text}
      </sl-tree-node>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Overflow: Story = {
  args: {
    text: 'This is a very long tree node text that should wrap across multiple lines to test how the component handles overflow scenarios.'
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .container {
          display: flex;
          flex-direction: column;
          gap: var(--sl-size-100);
        }

        .guides {
          display: flex;
          flex-direction: column;
          gap: var(--sl-size-025);
        }
      </style>
      <div class="container">
        <sl-tree-node disabled>Disabled</sl-tree-node>

        <sl-tree-node>Level 0</sl-tree-node>
        <sl-tree-node selectable selected>Level 0 (selected)</sl-tree-node>
        <sl-tree-node expandable>Level 0 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded>Level 0 (expandable, expanded)</sl-tree-node>
        <sl-tree-node level="1">Level 1</sl-tree-node>
        <sl-tree-node level="1" selectable selected>Level 1 (selected)</sl-tree-node>
        <sl-tree-node expandable level="1">Level 1 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded level="1">Level 1 (expandable, expanded)</sl-tree-node>
        <sl-tree-node level="2">Level 2</sl-tree-node>
        <sl-tree-node level="2" selectable selected>Level 2 (selected)</sl-tree-node>
        <sl-tree-node expandable level="2">Level 2 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded level="2">Level 2 (expandable, expanded)</sl-tree-node>
        <sl-tree-node level="3">Level 3</sl-tree-node>
        <sl-tree-node level="3" selectable selected>Level 3 (selected)</sl-tree-node>
        <sl-tree-node expandable level="3">Level 3 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded level="3">Level 3 (expandable, expanded)</sl-tree-node>
        <sl-tree-node level="4">Level 4</sl-tree-node>
        <sl-tree-node level="4" selectable selected>Level 4 (selected)</sl-tree-node>
        <sl-tree-node expandable level="4">Level 4 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded level="4">Level 4 (expandable, expanded)</sl-tree-node>

        <div class="guides">
          <sl-tree-node expandable expanded>Level 0 (guides)</sl-tree-node>
          <sl-tree-node .levelGuides=${[0]} level="1">Level 1 (guides)</sl-tree-node>
          <sl-tree-node .levelGuides=${[0]} expandable expanded level="1" last-node-in-level>
            Level 1 (last node in level, guides)
          </sl-tree-node>
          <sl-tree-node .levelGuides=${[1]} level="2">Level 2 (guides)</sl-tree-node>
          <sl-tree-node .levelGuides=${[1]} expandable expanded level="2" last-node-in-level>
            Level 2 (last node in level, guides)
          </sl-tree-node>
          <sl-tree-node .levelGuides=${[2]} level="3">Level 3 (guides)</sl-tree-node>
          <sl-tree-node .levelGuides=${[2]} expandable expanded level="3" last-node-in-level>
            Level 3 (last node in level, guides)
          </sl-tree-node>
          <sl-tree-node .levelGuides=${[3]} level="4">Level 4 (guides)</sl-tree-node>
          <sl-tree-node .levelGuides=${[3]} level="4" last-node-in-level>
            Level 4 (last node in level, guides)
          </sl-tree-node>
        </div>

        <sl-tree-node multiple selectable>Level 0 (multiple)</sl-tree-node>
        <sl-tree-node multiple selectable indeterminate
          >Level 0 (multiple, indeterminate)</sl-tree-node
        >
        <sl-tree-node multiple selectable selected>Level 0 (multiple, selected)</sl-tree-node>
        <sl-tree-node level="1" multiple selectable>Level 1 (multiple)</sl-tree-node>
        <sl-tree-node level="1" multiple selectable indeterminate>
          Level 1 (multiple, indeterminate)
        </sl-tree-node>
        <sl-tree-node level="1" multiple selectable selected
          >Level 1 (multiple, selected)</sl-tree-node
        >
        <sl-tree-node level="2" multiple selectable>Level 2 (multiple)</sl-tree-node>
        <sl-tree-node level="2" multiple selectable indeterminate>
          Level 2 (multiple, indeterminate)
        </sl-tree-node>
        <sl-tree-node level="2" multiple selectable selected
          >Level 2 (multiple, selected)</sl-tree-node
        >
        <sl-tree-node level="3" multiple selectable>Level 3 (multiple)</sl-tree-node>
        <sl-tree-node level="3" multiple selectable indeterminate>
          Level 3 (multiple, indeterminate)
        </sl-tree-node>
        <sl-tree-node level="3" multiple selectable selected
          >Level 3 (multiple, selected)</sl-tree-node
        >
        <sl-tree-node level="4" multiple selectable>Level 4 (multiple)</sl-tree-node>
        <sl-tree-node level="4" multiple selectable indeterminate>
          Level 4 (multiple, indeterminate)
        </sl-tree-node>
        <sl-tree-node level="4" multiple selectable selected
          >Level 4 (multiple, selected)</sl-tree-node
        >
      </div>
    `;
  }
};
