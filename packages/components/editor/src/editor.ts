import { FormControlMixin } from '@sl-design-system/form';
import { EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { EditorState, type Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { setHTML } from './commands.js';
import styles from './editor.scss.js';
import { buildKeymap, buildListKeymap } from './keymap.js';
import { type EditorMarks, type EditorNodes, marks, nodes } from './schema.js';
import { createContentNode, getHTML } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-editor': Editor;
  }
}

export class Editor extends FormControlMixin(LitElement) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Manage events. */
  #events = new EventsController(this, { focusout: this.#onFocusout });

  /** The value of the content in the editor. */
  #value: string = '';

  /** @internal */
  readonly internals = this.attachInternals();

  /** Additional plugins. */
  @property({ attribute: false }) plugins?: Plugin[];

  override get value(): string {
    return this.#value;
  }

  @property()
  override set value(value: string | undefined) {
    this.#value = value ?? '';

    if (this.view) {
      setHTML(this.#value)(this.view.state, this.view.dispatch, this.view);
    }
  }

  /** The ProseMirror editor view instance. */
  view?: EditorView;

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'textbox';
    this.internals.ariaMultiLine = 'true';

    this.setFormControlElement(this);
  }

  override firstUpdated(): void {
    this.view ??= this.createEditor();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      const fragment = document.createDocumentFragment();

      this.innerHTML = '';
      this.append(fragment);
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
        }
      }
    );

    return editor;
  }

  createSchema(): Schema<EditorNodes, EditorMarks> {
    return new Schema({ marks, nodes });
  }

  createState(): EditorState {
    const schema = this.createSchema(),
      doc = createContentNode(schema, this.value?.toString());

    return EditorState.create({
      schema,
      doc,
      plugins: [
        history(),
        keymap(buildListKeymap(schema)),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        ...(this.plugins || [])
      ]
    });
  }

  #onFocusout(): void {
    if (!this.view) {
      return;
    }

    this.#value = getHTML(this.view.state);
  }
}
