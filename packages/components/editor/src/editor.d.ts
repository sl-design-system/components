import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Schema } from 'prosemirror-model';
import { EditorState, type Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { type EditorMarks, type EditorNodes } from './schema.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-editor': Editor;
  }
}
declare const Editor_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl>;
export declare class Editor extends Editor_base {
  #private;
  /** @internal */
  static formAssociated: boolean;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal */
  readonly internals: ElementInternals;
  /** Additional plugins. */
  plugins?: Plugin[];
  get value(): string;
  set value(value: string | undefined);
  /** The ProseMirror editor view instance. */
  view?: EditorView;
  connectedCallback(): void;
  firstUpdated(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  createEditor(): EditorView;
  createSchema(): Schema<EditorNodes, EditorMarks>;
  createState(): EditorState;
}
export {};
