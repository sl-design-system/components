import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { FormControlMixin } from '@open-wc/form-control';
import { EventsController } from '@sanomalearning/slds-core/utils/controllers';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './editor.scss.js';
import { createContentNode } from './utils.js';
import { marks, nodes } from './schema.js';

export class Editor extends FormControlMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The ProseMirror editor view instance. */
  #editor?: EditorView;

  #events = new EventsController(this);

  /** The value of the editor. */
  @property() value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'textbox';
    this.internals.ariaMultiLine = 'true';

    this.#events.listen(this, 'focusout', this.#onFocusout);
  }

  override firstUpdated(): void {
    this.#editor ??= this.createEditor();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      console.log({ value: this.value });
    }
  }

  override render(): TemplateResult {
    return html`
      <slot style="display: none"></slot>
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

  #onFocusout(): void {
    console.log('focusout');
  }
}
