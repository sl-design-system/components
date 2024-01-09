import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { EditorMarks, EditorNodes } from './schema.js';
import type { Plugin } from 'prosemirror-state';
import { FormControlMixin } from '@sl-design-system/form';
import { EventsController } from '@sl-design-system/shared';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { Schema } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './editor.scss.js';
import { createContentNode, getHTML } from './utils.js';
import { marks, nodes } from './schema.js';
import { setHTML } from './commands.js';
import { buildKeymap, buildListKeymap } from './keymap.js';

export class Editor extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Manage events. */
  #events = new EventsController(this, { focusout: this.#onFocusout });

  /** The value of the content in the editor. */
  #value: string = '';

  /** The ProseMirror editor view instance. */
  #view?: EditorView;

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** Additional plugins. */
  @property({ attribute: false }) plugins?: Plugin[];

  @property()
  override get value(): string {
    return this.#value;
  }

  override set value(value: string | undefined) {
    const oldValue = this.#value;
    this.#value = value ?? '';

    if (this.#view) {
      setHTML(this.#value)(this.#view.state, this.#view.dispatch, this.#view);
    }

    this.requestUpdate('value', oldValue);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'textbox';
    this.internals.ariaMultiLine = 'true';
  }

  override firstUpdated(): void {
    this.#view ??= this.createEditor();
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
    if (!this.#view) {
      return;
    }

    this.#value = getHTML(this.#view.state);
  }
}
