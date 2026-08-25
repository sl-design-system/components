var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { FormControlMixin } from '@sl-design-system/form';
import { EventsController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { setHTML } from './commands.js';
import styles from './editor.scss.js';
import { buildKeymap, buildListKeymap } from './keymap.js';
import { marks, nodes } from './schema.js';
import { createContentNode, getHTML } from './utils.js';
export class Editor extends FormControlMixin(LitElement) {
  constructor() {
    super(...arguments);
    // eslint-disable-next-line no-unused-private-class-members
    this.#events = new EventsController(this, { focusout: this.#onFocusout });
    /** The value of the content in the editor. */
    this.#value = '';
    /** @internal */
    this.internals = this.attachInternals();
  }
  static {
    /** @internal */
    this.formAssociated = true;
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #events;
  #value;
  get value() {
    return this.#value;
  }
  set value(value) {
    this.#value = value ?? '';
    if (this.view) {
      setHTML(this.#value)(this.view.state, this.view.dispatch, this.view);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.internals.role = 'textbox';
    this.internals.ariaMultiLine = 'true';
    this.setFormControlElement(this);
  }
  firstUpdated() {
    this.view ??= this.createEditor();
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('value')) {
      const fragment = document.createDocumentFragment();
      this.innerHTML = '';
      this.append(fragment);
    }
  }
  render() {
    return html`
      <slot style="display: none"></slot>
      <div class="container">
        <div class="mount"></div>
      </div>
    `;
  }
  createEditor() {
    const mount = this.renderRoot.querySelector('.mount'),
      state = this.createState();
    const editor = new EditorView(
      { mount },
      {
        state,
        dispatchTransaction: function (tr) {
          this.updateState(this.state.apply(tr));
        }
      }
    );
    return editor;
  }
  createSchema() {
    return new Schema({ marks, nodes });
  }
  createState() {
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
  #onFocusout() {
    if (!this.view) {
      return;
    }
    this.#value = getHTML(this.view.state);
  }
}
__decorateClass([property({ attribute: false })], Editor.prototype, 'plugins', 2);
__decorateClass([property()], Editor.prototype, 'value', 1);
//# sourceMappingURL=editor.js.map
