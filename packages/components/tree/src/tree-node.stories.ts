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
  | 'multiple'
  | 'selected'
  | 'showGuides'
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
    selected: false,
    showGuides: false,
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
    multiple,
    selected,
    showGuides,
    text,
    type
  }) => {
    console.log({ text });

    return html`
      <sl-tree-node
        ?disabled=${disabled}
        ?expandable=${expandable}
        ?expanded=${expanded}
        ?indeterminate=${indeterminate}
        ?last-node-in-level=${lastNodeInLevel}
        level=${level}
        ?multiple=${multiple}
        ?selected=${selected}
        ?show-guides=${showGuides}
        type=${ifDefined(type)}
      >
        ${text}
      </sl-tree-node>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .container {
          display: flex;
          flex-direction: column;
          gap: var(--sl-size-100);
        }
      </style>
      <div class="container">
        <sl-tree-node disabled>Disabled</sl-tree-node>

        <sl-tree-node>Level 0</sl-tree-node>
        <sl-tree-node selected>Level 0 (selected)</sl-tree-node>
        <sl-tree-node expandable>Level 0 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded>Level 0 (expandable, expanded)</sl-tree-node>
        <sl-tree-node level="1">Level 1</sl-tree-node>
        <sl-tree-node level="1" selected>Level 1 (selected)</sl-tree-node>
        <sl-tree-node expandable level="1">Level 1 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded level="1">Level 1 (expandable, expanded)</sl-tree-node>
        <sl-tree-node level="2">Level 2</sl-tree-node>
        <sl-tree-node level="2" selected>Level 2 (selected)</sl-tree-node>
        <sl-tree-node expandable level="2">Level 2 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded level="2">Level 2 (expandable, expanded)</sl-tree-node>
        <sl-tree-node level="3">Level 3</sl-tree-node>
        <sl-tree-node level="3" selected>Level 3 (selected)</sl-tree-node>
        <sl-tree-node expandable level="3">Level 3 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded level="3">Level 3 (expandable, expanded)</sl-tree-node>
        <sl-tree-node level="4">Level 4</sl-tree-node>
        <sl-tree-node level="4" selected>Level 4 (selected)</sl-tree-node>
        <sl-tree-node expandable level="4">Level 4 (expandable)</sl-tree-node>
        <sl-tree-node expandable expanded level="4">Level 4 (expandable, expanded)</sl-tree-node>

        <sl-tree-node expandable expanded show-guides>Level 0 (guides)</sl-tree-node>
        <sl-tree-node level="1" show-guides>Level 1 (guides)</sl-tree-node>
        <sl-tree-node expandable expanded level="1" last-node-in-level show-guides>
          Level 1 (last node in level, guides)
        </sl-tree-node>
        <sl-tree-node level="2" show-guides>Level 2 (guides)</sl-tree-node>
        <sl-tree-node expandable expanded level="2" last-node-in-level show-guides>
          Level 2 (last node in level, guides)
        </sl-tree-node>
        <sl-tree-node level="3" show-guides>Level 3 (guides)</sl-tree-node>
        <sl-tree-node expandable expanded level="3" last-node-in-level show-guides>
          Level 3 (last node in level, guides)
        </sl-tree-node>
        <sl-tree-node level="4" show-guides>Level 4 (guides)</sl-tree-node>
        <sl-tree-node level="4" last-node-in-level show-guides>Level 4 (last node in level, guides)</sl-tree-node>

        <sl-tree-node multiple>Level 0 (multiple)</sl-tree-node>
        <sl-tree-node multiple indeterminate>Level 0 (multiple, indeterminate)</sl-tree-node>
        <sl-tree-node multiple selected>Level 0 (multiple, selected)</sl-tree-node>
        <sl-tree-node level="1" multiple>Level 1 (multiple)</sl-tree-node>
        <sl-tree-node level="1" multiple indeterminate>Level 1 (multiple, indeterminate)</sl-tree-node>
        <sl-tree-node level="1" multiple selected>Level 1 (multiple, selected)</sl-tree-node>
        <sl-tree-node level="2" multiple>Level 2 (multiple)</sl-tree-node>
        <sl-tree-node level="2" multiple indeterminate>Level 2 (multiple, indeterminate)</sl-tree-node>
        <sl-tree-node level="2" multiple selected>Level 2 (multiple, selected)</sl-tree-node>
        <sl-tree-node level="3" multiple>Level 3 (multiple)</sl-tree-node>
        <sl-tree-node level="3" multiple indeterminate>Level 3 (multiple, indeterminate)</sl-tree-node>
        <sl-tree-node level="3" multiple selected>Level 3 (multiple, selected)</sl-tree-node>
        <sl-tree-node level="4" multiple>Level 4 (multiple)</sl-tree-node>
        <sl-tree-node level="4" multiple indeterminate>Level 4 (multiple, indeterminate)</sl-tree-node>
        <sl-tree-node level="4" multiple selected>Level 4 (multiple, selected)</sl-tree-node>
      </div>
    `;
  }
};
