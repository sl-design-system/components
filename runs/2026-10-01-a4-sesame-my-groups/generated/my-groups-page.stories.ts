import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { MyGroupsBulkActionBar } from './bulk-action-bar/my-groups-bulk-action-bar.js';
import { MyGroupsFilterCard } from './filter-card/my-groups-filter-card.js';
// A PLAIN side-effect import on purpose. A `import { type MyGroupsPage } from …` is erased at
// transform time, so `customElements.define` would never run and Storybook would render an
// unregistered, zero-by-zero element with no shadow root — and the type-check would still pass.
import './my-groups-page.js';

type Story = StoryObj;

/** The page, once Lit has finished its first render. */
const renderedPage = async (canvasElement: HTMLElement) => {
  const page = canvasElement.querySelector('sl-my-groups-page');

  await page?.updateComplete;

  return page;
};

/**
 * Finds one of the page's children by class rather than by tag name. The children are **scoped**
 * elements, so their tag names belong to the scoped-elements registry and are not ours to depend
 * on — but the class identity is stable either way.
 */
const childOfType = <T extends Element>(
  root: ParentNode | null | undefined,
  ctor: new () => T
): T | undefined =>
  Array.from(root?.querySelectorAll('*') ?? []).find(
    (element): element is T => element instanceof ctor
  );

/**
 * Clicks a control inside a child's shadow root.
 *
 * Selectors here are structural or use a reflected property, never `aria-*`: SLDS's `sl-button`
 * forwards aria attributes off the host into its internal `<button>`, so `[aria-label="…"]`
 * matches nothing on the host and the click would silently no-op.
 */
const clickIn = async (
  child: (Element & { shadowRoot: ShadowRoot | null; updateComplete: Promise<unknown> }) | undefined,
  selector: string
): Promise<void> => {
  await child?.updateComplete;

  child?.shadowRoot?.querySelector<HTMLElement>(selector)?.click();
};

export default {
  title: 'Examples/My groups page',
  parameters: {
    docs: {
      description: {
        component: [
          'The "My Groups" administration page. The root is the **sole data owner**: it exposes',
          'no public properties and no slots, so it renders the whole design from',
          '`<sl-my-groups-page></sl-my-groups-page>` and nothing else.',
          '',
          'It holds the groups, the total, the filters, the header model and the selection as',
          'private state, pushes one cohesive model object into each of its five scoped children,',
          'and listens for the ten `sl-my-groups-*` events they emit:',
          '',
          '| Child | Events |',
          '| --- | --- |',
          '| app header | `sl-my-groups-nav-select`, `sl-my-groups-switch-school` |',
          '| filter card | `sl-my-groups-filter-search`, `sl-my-groups-filter-clear` |',
          '| groups table | `sl-my-groups-selection-change`, `sl-my-groups-row-action` |',
          '| bulk action bar | `sl-my-groups-bulk-action`, `sl-my-groups-bulk-dismiss` |',
          '| app footer | `sl-my-groups-language-select` |',
          '',
          'Selection flows one way down into the table and back up through',
          '`sl-my-groups-selection-change`, so the table and the bulk action bar can never',
          'disagree about what is selected. The remaining handlers are stubs where a real app',
          'would route, confirm or open a picker.',
          '',
          'The children are **scoped** elements: none of them calls `customElements.define`, so',
          'there is no tag to mount one with and no per-child story. Nothing is configurable from',
          'the outside either, so the variants below are reached by clicking the page’s own',
          'controls in a `play` function rather than by passing args.'
        ].join('\n')
      }
    },
    layout: 'fullscreen'
  },
  render: () => html`<sl-my-groups-page></sl-my-groups-page>`
} satisfies Meta;

/**
 * The design as drawn: 20 of 40 groups on the first page, the filter card carrying the design's
 * `Input Value` query and the `Active` status, three rows pre-selected, the floating bulk action
 * bar, and the inline error explaining why "Reactivate" is unavailable for that selection.
 *
 * Every state the design specifies is visible here at once, which is the one upside of the page
 * owning its data: the error, the selection and the populated filters are the default, not a
 * variant.
 */
export const Basic: Story = {};

/**
 * Nothing selected — the page's resting state.
 *
 * Reached by clicking the bulk bar's "Clear selection" button, which emits
 * `sl-my-groups-bulk-dismiss`. The page empties `selectedIds`, and the floating bar (it renders
 * `nothing` at `selectedCount === 0`) and the inline error disappear together, because the one
 * `canReactivate` predicate drives both. This is also the only way to see the table's last rows
 * without the bar floating over them.
 */
export const NoSelection: Story = {
  play: async ({ canvasElement }) => {
    const page = await renderedPage(canvasElement);

    await clickIn(childOfType(page?.shadowRoot, MyGroupsBulkActionBar), '.bar > sl-button');
    await page?.updateComplete;
  }
};

/**
 * Every filter cleared.
 *
 * Reached by clicking "Clear filters" in the filter card, which resets the card's own
 * `<sl-form>` and emits `sl-my-groups-filter-clear`. The page swaps its filter state for
 * `CLEARED_FILTERS` and pushes it back down through `value`: the design's `Input Value` query
 * empties and "Group status" returns from `Active` to `Any`. That round trip is what shows the
 * filter *data* living on the page while only the form *state* lives in the card.
 *
 * The result count does not move — clearing the filters does not re-issue the (mocked) request.
 */
export const FiltersCleared: Story = {
  play: async ({ canvasElement }) => {
    const page = await renderedPage(canvasElement);

    await clickIn(childOfType(page?.shadowRoot, MyGroupsFilterCard), '[fill="link"]');
    await page?.updateComplete;
  }
};
