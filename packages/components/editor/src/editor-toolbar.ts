import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ToolBar, ToolBarDivider } from '@sl-design-system/tool-bar';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { lift, setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { type MarkType, type Node as PMNode, type NodeType } from 'prosemirror-model';
import { type EditorState } from 'prosemirror-state';
import { liftListItem, wrapInList } from 'prosemirror-schema-list';
import { type EditorView } from 'prosemirror-view';
import styles from './editor-toolbar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-editor-toolbar': EditorToolbar;
  }
}

/**
 * A toolbar for the rich text editor, providing common rich text formatting actions.
 * Rendered inside the `<sl-editor>` component.
 *
 * @slot - Not intended for direct use; content is generated from the editor schema.
 */
export class EditorToolbar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-tool-bar': ToolBar,
      'sl-tool-bar-divider': ToolBarDivider
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether the toolbar and all its buttons are disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The ProseMirror editor view this toolbar controls. */
  @property({ attribute: false }) view?: EditorView;

  /**
   * @internal The current editor state, updated by the editor on every transaction
   * to trigger re-renders so button active states stay in sync.
   */
  @state() editorState?: EditorState;

  override render(): TemplateResult {
    const schema = this.view?.state.schema;

    return html`
      <sl-tool-bar ?disabled=${this.disabled}>
        ${schema?.marks.strong
          ? this.#renderButton('Bold', 'B', 'bold')
          : nothing}
        ${schema?.marks.em
          ? this.#renderButton('Italic', 'I', 'italic')
          : nothing}
        ${schema?.marks.underline
          ? this.#renderButton('Underline', 'U', 'underline')
          : nothing}
        ${schema?.marks.strikethrough
          ? this.#renderButton('Strikethrough', 'S', 'strikethrough')
          : nothing}

        ${schema?.marks.code || schema?.nodes.blockquote
          ? html`<sl-tool-bar-divider></sl-tool-bar-divider>`
          : nothing}

        ${schema?.marks.code
          ? this.#renderButton('Inline code', '</>', 'code')
          : nothing}
        ${schema?.nodes.blockquote
          ? this.#renderButton('Blockquote', '\u201C', 'blockquote')
          : nothing}

        ${schema?.nodes.heading
          ? html`
              <sl-tool-bar-divider></sl-tool-bar-divider>
              ${this.#renderButton('Heading 1', 'H1', 'heading-1')}
              ${this.#renderButton('Heading 2', 'H2', 'heading-2')}
              ${this.#renderButton('Heading 3', 'H3', 'heading-3')}
            `
          : nothing}

        ${schema?.nodes.bulletList || schema?.nodes.orderedList
          ? html`<sl-tool-bar-divider></sl-tool-bar-divider>`
          : nothing}

        ${schema?.nodes.bulletList && schema.nodes.listItem
          ? this.#renderButton('Bullet list', '\u2022\u2013', 'bullet-list')
          : nothing}
        ${schema?.nodes.orderedList && schema.nodes.listItem
          ? this.#renderButton('Ordered list', '1.', 'ordered-list')
          : nothing}

        <sl-tool-bar-divider></sl-tool-bar-divider>

        <sl-button
          aria-label="Undo"
          aria-disabled=${this.#canUndo() ? nothing : 'true'}
          @click=${() => this.#onUndo()}
        >\u21A9</sl-button>
        <sl-button
          aria-label="Redo"
          aria-disabled=${this.#canRedo() ? nothing : 'true'}
          @click=${() => this.#onRedo()}
        >\u21AA</sl-button>
      </sl-tool-bar>
    `;
  }

  #renderButton(label: string, text: string, format: string): TemplateResult {
    const active = this.#isFormatActive(format);

    return html`
      <sl-button
        aria-label=${label}
        aria-pressed=${active}
        fill=${active ? 'outline' : nothing}
        @click=${() => this.#execFormat(format)}
      >${text}</sl-button>
    `;
  }

  #isFormatActive(format: string): boolean {
    const state = this.view?.state;
    if (!state) return false;
    const schema = state.schema;

    switch (format) {
      case 'bold':        return this.#isMarkActive(schema.marks.strong);
      case 'italic':      return this.#isMarkActive(schema.marks.em);
      case 'underline':   return this.#isMarkActive(schema.marks.underline);
      case 'strikethrough': return this.#isMarkActive(schema.marks.strikethrough);
      case 'code':        return this.#isMarkActive(schema.marks.code);
      case 'blockquote':  return this.#isNodeActive(schema.nodes.blockquote);
      case 'heading-1':   return this.#isNodeActive(schema.nodes.heading, { level: 1 });
      case 'heading-2':   return this.#isNodeActive(schema.nodes.heading, { level: 2 });
      case 'heading-3':   return this.#isNodeActive(schema.nodes.heading, { level: 3 });
      case 'bullet-list': return this.#isNodeActive(schema.nodes.bulletList);
      case 'ordered-list': return this.#isNodeActive(schema.nodes.orderedList);
      default:            return false;
    }
  }

  #isMarkActive(markType: MarkType): boolean {
    const state = this.view?.state;
    if (!state || !markType) return false;

    const { from, $from, to, empty } = state.selection;

    if (empty) {
      return !!markType.isInSet(state.storedMarks ?? $from.marks());
    }

    return state.doc.rangeHasMark(from, to, markType);
  }

  #isNodeActive(nodeType: NodeType, attrs?: Record<string, unknown>): boolean {
    const state = this.view?.state;
    if (!state || !nodeType) return false;

    const { from, to } = state.selection;
    let found = false;

    state.doc.nodesBetween(from, to, (node: PMNode) => {
      if (node.type === nodeType) {
        if (!attrs || Object.entries(attrs).every(([key, val]) => node.attrs[key] === val)) {
          found = true;
        }
      }
    });

    return found;
  }

  #canUndo(): boolean {
    if (!this.view) return false;
    return undo(this.view.state);
  }

  #canRedo(): boolean {
    if (!this.view) return false;
    return redo(this.view.state);
  }

  #execFormat(format: string): void {
    const view = this.view;
    if (!view) return;

    const { state } = view;
    const schema = state.schema;

    switch (format) {
      case 'bold':
        toggleMark(schema.marks.strong)(state, view.dispatch);
        break;
      case 'italic':
        toggleMark(schema.marks.em)(state, view.dispatch);
        break;
      case 'underline':
        toggleMark(schema.marks.underline)(state, view.dispatch);
        break;
      case 'strikethrough':
        toggleMark(schema.marks.strikethrough)(state, view.dispatch);
        break;
      case 'code':
        toggleMark(schema.marks.code)(state, view.dispatch);
        break;
      case 'blockquote':
        if (this.#isNodeActive(schema.nodes.blockquote)) {
          lift(state, view.dispatch);
        } else {
          wrapIn(schema.nodes.blockquote)(state, view.dispatch);
        }
        break;
      case 'heading-1':
      case 'heading-2':
      case 'heading-3': {
        const level = parseInt(format.slice(-1));
        if (this.#isNodeActive(schema.nodes.heading, { level })) {
          setBlockType(schema.nodes.paragraph)(state, view.dispatch);
        } else {
          setBlockType(schema.nodes.heading, { level })(state, view.dispatch);
        }
        break;
      }
      case 'bullet-list':
        if (this.#isNodeActive(schema.nodes.bulletList)) {
          liftListItem(schema.nodes.listItem)(state, view.dispatch);
        } else {
          wrapInList(schema.nodes.bulletList)(state, view.dispatch);
        }
        break;
      case 'ordered-list':
        if (this.#isNodeActive(schema.nodes.orderedList)) {
          liftListItem(schema.nodes.listItem)(state, view.dispatch);
        } else {
          wrapInList(schema.nodes.orderedList)(state, view.dispatch);
        }
        break;
    }

    view.focus();
  }

  #onUndo(): void {
    if (!this.view) return;
    undo(this.view.state, this.view.dispatch);
    this.view.focus();
  }

  #onRedo(): void {
    if (!this.view) return;
    redo(this.view.state, this.view.dispatch);
    this.view.focus();
  }

}
