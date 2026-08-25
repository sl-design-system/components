import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-indent-guides': IndentGuides;
  }
}
/**
 * A component that renders indentation guides for tree nodes. This component is not public API and
 * is used internally by `<sl-tree>`.
 */
export declare class IndentGuides extends LitElement {
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether this node is the last one on this level; used for styling. */
  lastNodeInLevel?: boolean;
  /** Level of indentation. */
  level: number;
  /** Array of levels that should show a guide. */
  levelGuides?: number[];
  /** Will show a selection indicator if set. */
  selected?: false;
  /** Will show indentation guides if set. */
  visible?: boolean;
  connectedCallback(): void;
  render(): TemplateResult;
}
