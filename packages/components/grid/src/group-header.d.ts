import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlSelectEvent, type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-group-header': GridGroupHeader;
  }
}
declare const GridGroupHeader_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
export declare class GridGroupHeader extends GridGroupHeader_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether the group is collapsed or expanded. */
  collapsed?: boolean;
  /** Whether the group is draggable. */
  dragHandle?: boolean;
  /** Accessible label for the group selection checkbox. */
  groupLabel?: string;
  /** Whether you can select the entire group. */
  selectable?: boolean;
  /** Whether the group is selected. */
  selected: 'all' | 'some' | 'none';
  /** @internal Emits when the user changes the group selection. */
  selectEvent: EventEmitter<SlSelectEvent<boolean>>;
  /** @internal Emits when the user collapses/expands the group. */
  toggleEvent: EventEmitter<SlToggleEvent<boolean>>;
  render(): TemplateResult;
}
export {};
