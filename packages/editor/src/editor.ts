import type { CSSResultGroup, TemplateResult } from 'lit';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './editor.scss.js';
import { createContentNode } from './utils.js';
import { marks, nodes } from './schema.js';

export class Editor extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  editor?: EditorView;

  @property() value?: string;

  override firstUpdated(): void {
    this.editor ??= this.createEditor();
  }

  override render(): TemplateResult {
    return html`
      <div class="container">
        <div class="mount"></div>
      </div>
    `;
  }

  createEditor(): EditorView {
    const mount = this.renderRoot.querySelector('.mount') as HTMLElement,
      state = this.createState();

    const editor = new EditorView(
      { mount },
      {
        state,
        dispatchTransaction: function (tr) {
          // `this` is bound to the view instance.
          (this as unknown as EditorView).updateState(this.state.apply(tr));
          // that.toolBarChanges.next(getToolBarState(this.state));
        }
      }
    );

    return editor;
  }

  createSchema(): Schema {
    return new Schema({ marks, nodes });
  }

  createState(): EditorState {
    const schema = this.createSchema(),
      doc = createContentNode(schema, this.value);

    return EditorState.create({ schema, doc });
  }
}
