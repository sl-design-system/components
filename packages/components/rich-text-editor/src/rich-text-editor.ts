import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faBlockQuote,
  faBold,
  faCode,
  faIndent,
  faItalic,
  faLink,
  faListCheck,
  faListOl,
  faListUl,
  faOutdent,
  faStrikethrough,
  faUnderline
} from '@fortawesome/pro-regular-svg-icons';
import {
  faBlockQuote as fasBlockQuote,
  faBold as fasBold,
  faCode as fasCode,
  faItalic as fasItalic,
  faLink as fasLink,
  faListCheck as fasListCheck,
  faListOl as fasListOl,
  faListUl as fasListUl,
  faStrikethrough as fasStrikethrough,
  faUnderline as fasUnderline
} from '@fortawesome/pro-solid-svg-icons';
import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon, type IconDefinition } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { Option, Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { cssState } from '@sl-design-system/shared/decorators/css-state.js';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { ElementInternalsMixin } from '@sl-design-system/shared/mixins/element-internals.js';
import { TextField } from '@sl-design-system/text-field';
import { ToggleButton } from '@sl-design-system/toggle-button';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { type Schema } from 'prosemirror-model';
import { EditorState, Plugin, TextSelection } from 'prosemirror-state';
import { Decoration, DecorationSet, type EditorProps, EditorView } from 'prosemirror-view';
import { TaskItemView, buildChecklistKeymap, taskIdsPlugin } from './checklist.js';
import { setHTML } from './commands.js';
import { type RichTextEditorFeature, resolveFeatures } from './features.js';
import { buildInputRules } from './input-rules.js';
import { buildKeymap, buildListKeymap } from './keymap.js';
import contentStyles from './rich-text-editor-content.css' with { type: 'css' };
import styles from './rich-text-editor.css' with { type: 'css' };
import { type EditorMarks, type EditorNodes, buildSchema } from './schema.js';
import {
  TOOLBAR_GROUPS,
  type ToolbarItem,
  buildToolbarItems,
  getBlockType,
  setBlockTypeCommand
} from './toolbar.js';
import { createContentNode, getHTML } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-rich-text-editor': RichTextEditor;
  }
}

/** Only register the icons that aren't there yet, so a page that registers them too gets no warning. */
const icons = (
  [
    faArrowRotateLeft,
    faArrowRotateRight,
    faBlockQuote,
    faBold,
    faCode,
    faIndent,
    faItalic,
    faLink,
    faListCheck,
    faListOl,
    faListUl,
    faOutdent,
    faStrikethrough,
    faUnderline,
    fasBlockQuote,
    fasBold,
    fasCode,
    fasItalic,
    fasLink,
    fasListCheck,
    fasListOl,
    fasListUl,
    fasStrikethrough,
    fasUnderline
  ] as IconDefinition[]
).filter(icon => !window.SLDS?.icons?.[`${icon.prefix}-${icon.iconName}`]);

if (icons.length) {
  Icon.register(...icons);
}

let nextUniqueId = 0;

/**
 * A rich text editor form control, built on ProseMirror. The toolbar, footer and field chrome live
 * in shadow DOM; the editable itself is a light DOM child that is slotted in, so native selection,
 * IME, autocorrect and dictation behave on every browser.
 *
 * Use it inside an `<sl-form-field>` for the label and hint, like any other form control.
 *
 * ```html
 * <sl-form-field label="Lesson description" hint="Students see this above the assignment.">
 *   <sl-rich-text-editor
 *     features="default checklist character-count"
 *     maxlength="2000"></sl-rich-text-editor>
 * </sl-form-field>
 * ```
 *
 * @fires sl-blur - Emits when the editor loses focus.
 * @fires sl-change - Emits when the editor loses focus and the value has changed.
 * @fires sl-focus - Emits when the editor gains focus.
 * @slot footer - Text shown at the start of the footer, such as a hint about markdown shortcuts.
 * @slot toolbar-end - Custom actions at the end of the toolbar.
 *
 * @csspart toolbar - The formatting toolbar.
 * @csspart footer - The footer with the footer slot and the character count.
 *
 * @cssstate empty - Set when the editor has no content.
 */
@localized()
export class RichTextEditor extends FormControlMixin(
  ScopedElementsMixin(ElementInternalsMixin(LitElement))
) {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-option': Option,
      'sl-popover': Popover,
      'sl-select': Select,
      'sl-text-field': TextField,
      'sl-toggle-button': ToggleButton
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The light DOM element ProseMirror renders into. */
  #content = document.createElement('div');

  /** Unique id prefix for elements in the shadow root. */
  #id = `sl-rich-text-editor-${nextUniqueId++}`;

  /** Keeps the editable's ARIA in sync with what `sl-form-field` and `sl-label` set on the host. */
  #observer = new MutationObserver(() => this.#syncContentAttributes());

  /** The resolved set of features. */
  #features = resolveFeatures();

  /** The toolbar buttons for the enabled features. */
  #toolbarItems: ToolbarItem[] = [];

  /** The value at the moment the editor gained focus, used to decide whether to emit `sl-change`. */
  #valueOnFocus = '';

  /** The value of the content in the editor. */
  #value = '';

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<string>>;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal The number of characters in the editor. */
  @state() characterCount = 0;

  /** Whether the editor is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Whether the editor has no content. */
  @state() @cssState() empty = true;

  /**
   * Which features this editor has, as a space-separated list of tokens read left to right: a name
   * adds a feature, `default` adds the standard set and `-name` removes one. The standard set is
   * bold, italic, underline, strike, link, headings, bullet-list, ordered-list, quote and history.
   * The opt-in features are `code`, `checklist` and `character-count`.
   *
   * @default 'default'
   */
  @property() features?: string;

  /** @internal The link popover's anchor id. */
  @state() linkHref = '';

  /** @internal The link popover. */
  @query('sl-popover') linkPopover?: Popover;

  /** Maximum number of characters. Shown in the footer when the `character-count` feature is on. */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Placeholder text shown while the editor is empty. */
  @property() placeholder?: string;

  /** Additional ProseMirror plugins. */
  @property({ attribute: false }) plugins?: Plugin[];

  /** Whether the editor is read-only: the toolbar is hidden and the text can only be selected. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** Whether the editor is a required field. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** @internal Incremented on every editor state change, so the toolbar re-renders. */
  @state() revision = 0;

  /** The ProseMirror editor view instance. */
  view?: EditorView;

  override get value(): string {
    return this.#value;
  }

  /** The value of the editor, as HTML. */
  @property()
  override set value(value: string | undefined) {
    const old = this.#value;

    this.#value = value ?? '';

    if (this.view && this.#value !== getHTML(this.view.state)) {
      setHTML(this.#value)(this.view.state, this.view.dispatch);
    }

    this.requestUpdate('value', old);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.#adoptContentStyles();

    this.#content.slot = 'content';
    this.#content.classList.add('sl-rich-text-editor-content');
    if (!this.#content.parentElement) {
      this.append(this.#content);
    }

    this.#observer.observe(this, {
      attributes: true,
      attributeFilter: ['aria-describedby', 'aria-label', 'data-label-id', 'show-validity']
    });

    this.setFormControlElement(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.view?.destroy();
    this.view = undefined;

    super.disconnectedCallback();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#createView();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('features')) {
      this.#features = resolveFeatures(this.features);

      // Rebuild the schema and re-read the current content with it; undo history restarts.
      if (this.view) {
        this.#createView();
      }
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if ((changes.has('disabled') || changes.has('readonly')) && this.view) {
      // New node views make ProseMirror redraw them, so checkboxes pick up the new state.
      this.view.setProps({
        editable: () => this.#editable,
        nodeViews: this.#buildNodeViews(this.view.state.schema)
      });
    }

    if (
      changes.has('disabled') ||
      changes.has('placeholder') ||
      changes.has('readonly') ||
      changes.has('required')
    ) {
      this.#syncContentAttributes();
      // Re-apply the placeholder decoration and node views (checkboxes are disabled when read-only).
      this.view?.dispatch(this.view.state.tr.setMeta('addToHistory', false));
    }

    if (changes.has('maxLength') || changes.has('required') || changes.has('value')) {
      this.#updateValueAndValidity();
    }
  }

  override render(): TemplateResult {
    const state = this.view?.state,
      showCount = this.#features.has('character-count');

    return html`
      ${this.readonly ? nothing : this.#renderToolbar(state)}
      <slot name="content"></slot>
      ${
        showCount || this.querySelector('[slot="footer"]')
          ? html`
              <div part="footer">
                <slot name="footer"></slot>
                ${
                  showCount
                    ? html`<span class="count" aria-live="polite">${this.#renderCount()}</span>`
                    : nothing
                }
              </div>
            `
          : nothing
      }
      ${this.#features.has('link') && !this.readonly ? this.#renderLinkPopover() : nothing}
    `;
  }

  override focus(options?: FocusOptions): void {
    this.view?.focus();
    this.#content.focus(options);
  }

  /** Whether the given feature is enabled. */
  hasFeature(feature: RichTextEditorFeature): boolean {
    return this.#features.has(feature);
  }

  #renderToolbar(state?: EditorState): TemplateResult {
    const disabled = !!this.disabled;

    const groups = TOOLBAR_GROUPS.map(group =>
      this.#toolbarItems.filter(item => item.group === group)
    ).filter(items => items.length);

    return html`
      <div
        @keydown=${this.#onToolbarKeydown}
        @mousedown=${this.#onToolbarMousedown}
        aria-controls=${`${this.#id}-content`}
        aria-label=${msg('Formatting', { id: 'sl.richTextEditor.toolbar' })}
        part="toolbar"
        role="toolbar">
        ${
          this.#features.has('headings') && this.view?.state.schema.nodes.heading
            ? html`
                <sl-select
                  @sl-blur=${this.#stopInnerEvent}
                  @sl-focus=${this.#stopInnerEvent}
                  @sl-form-control=${this.#stopInnerEvent}
                  @sl-update-state=${this.#stopInnerEvent}
                  @sl-update-validity=${this.#stopInnerEvent}
                  @sl-validate=${this.#stopInnerEvent}
                  @sl-change=${this.#onBlockTypeChange}
                  .value=${state ? getBlockType(state) : 'p'}
                  ?disabled=${disabled}
                  aria-label=${msg('Text style', { id: 'sl.richTextEditor.textStyle' })}
                  class="block-type"
                  data-toolbar-item>
                  <sl-option value="p"
                    >${msg('Paragraph', { id: 'sl.richTextEditor.paragraph' })}</sl-option
                  >
                  <sl-option value="h2"
                    >${msg('Heading 1', { id: 'sl.richTextEditor.heading1' })}</sl-option
                  >
                  <sl-option value="h3"
                    >${msg('Heading 2', { id: 'sl.richTextEditor.heading2' })}</sl-option
                  >
                  <sl-option value="h4"
                    >${msg('Heading 3', { id: 'sl.richTextEditor.heading3' })}</sl-option
                  >
                </sl-select>
                <hr />
              `
            : nothing
        }
        ${groups.map(
          (items, index) => html`
            ${index > 0 ? html`<hr />` : nothing}
            ${items.map(item => this.#renderToolbarItem(item, state, disabled))}
          `
        )}
        <slot name="toolbar-end"></slot>
      </div>
    `;
  }

  #renderToolbarItem(item: ToolbarItem, state: EditorState | undefined, disabled: boolean) {
    const enabled = !disabled && !!state && item.isEnabled(state),
      tooltip = item.shortcut ? `${item.label} (${item.shortcut})` : item.label;

    if (item.toggle) {
      return html`
        <sl-toggle-button
          @click=${() => this.#onToolbarItemClick(item)}
          ?disabled=${!enabled}
          ?pressed=${!!state && !!item.isActive?.(state)}
          aria-label=${item.label}
          data-toolbar-item
          fill="outline"
          id=${`${this.#id}-${item.id}`}
          tooltip=${tooltip}>
          <sl-icon name=${`far-${item.icon}`} slot="default"></sl-icon>
          <sl-icon name=${`fas-${item.icon}`} slot="pressed"></sl-icon>
        </sl-toggle-button>
      `;
    }

    return html`
      <sl-button
        @click=${() => this.#onToolbarItemClick(item)}
        ?disabled=${!enabled}
        aria-label=${item.label}
        data-toolbar-item
        fill="ghost"
        tooltip=${tooltip}>
        <sl-icon name=${`far-${item.icon}`}></sl-icon>
      </sl-button>
    `;
  }

  #renderCount(): string {
    return this.maxLength ? `${this.characterCount} / ${this.maxLength}` : `${this.characterCount}`;
  }

  #renderLinkPopover(): TemplateResult {
    return html`
      <sl-popover
        anchor=${`${this.#id}-link`}
        position="bottom-start"
        @toggle=${this.#onLinkToggle}>
        <form @submit=${this.#onLinkSubmit} class="link-form">
          <sl-text-field
            @sl-blur=${this.#stopInnerEvent}
            @sl-focus=${this.#stopInnerEvent}
            @sl-form-control=${this.#stopInnerEvent}
            @sl-update-state=${this.#stopInnerEvent}
            @sl-update-validity=${this.#stopInnerEvent}
            @sl-validate=${this.#stopInnerEvent}
            .value=${this.linkHref}
            @sl-change=${this.#onLinkHrefChange}
            aria-label=${msg('Link address', { id: 'sl.richTextEditor.linkAddress' })}
            placeholder="https://"
            type="url"></sl-text-field>
          <sl-button type="submit" variant="primary">
            ${msg('Apply', { id: 'sl.richTextEditor.applyLink' })}
          </sl-button>
        </form>
      </sl-popover>
    `;
  }

  get #editable(): boolean {
    return !this.disabled && !this.readonly;
  }

  #adoptContentStyles(): void {
    const root = this.getRootNode() as Document | ShadowRoot;

    if (root.adoptedStyleSheets && !root.adoptedStyleSheets.includes(contentStyles)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, contentStyles];
    }
  }

  #createState(schema: Schema<EditorNodes, EditorMarks>): EditorState {
    const { taskItem } = schema.nodes;

    return EditorState.create({
      schema,
      doc: createContentNode(schema, this.#value),
      plugins: [
        buildInputRules(schema),
        ...(this.#features.has('history') ? [history()] : []),
        ...(taskItem ? [keymap(buildChecklistKeymap(taskItem)), taskIdsPlugin(taskItem)] : []),
        keymap(buildListKeymap(schema)),
        keymap(this.#buildEditorKeymap(schema)),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        this.#placeholderPlugin(),
        ...(this.plugins || [])
      ]
    });
  }

  #createView(): void {
    const schema = buildSchema(this.#features),
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      host = this;

    this.view?.destroy();
    this.#content.replaceChildren();
    this.#toolbarItems = buildToolbarItems(this.#features, schema, this.#labels);

    this.view = new EditorView(
      { mount: this.#content },
      {
        state: this.#createState(schema),
        editable: () => this.#editable,
        nodeViews: this.#buildNodeViews(schema),
        handleDOMEvents: {
          blur: () => {
            this.#onBlur();
            return false;
          },
          focus: () => {
            this.#onFocus();
            return false;
          }
        },
        dispatchTransaction(tr) {
          // `this` is bound to the view instance.
          const view = this as unknown as EditorView;

          view.updateState(view.state.apply(tr));

          if (tr.docChanged) {
            host.#onDocChange();
          }

          host.revision++;
        }
      }
    );

    // Gives checklist items their ids and applies the placeholder.
    this.view.dispatch(this.view.state.tr.setMeta('addToHistory', false));
    this.#content.id = `${this.#id}-content`;
    this.#syncContentAttributes();
    this.#onDocChange();
  }

  #buildNodeViews(schema: Schema): EditorProps['nodeViews'] {
    return schema.nodes.taskItem
      ? {
          taskItem: (node, view, getPos) =>
            new TaskItemView(node, view, getPos, () => this.#editable)
        }
      : {};
  }

  /** Keyboard shortcuts that need the host, such as opening the link popover. */
  #buildEditorKeymap(schema: Schema): Record<string, (state: EditorState) => boolean> {
    const keys: Record<string, (state: EditorState) => boolean> = {};

    if (schema.marks.link) {
      keys['Mod-k'] = () => {
        this.#openLinkPopover();
        return true;
      };
    }

    if (schema.marks.code) {
      keys['Mod-e'] = state => toggleMark(schema.marks.code)(state, this.view?.dispatch);
    }

    return keys;
  }

  /** Shows the placeholder as a decoration, so it is never part of the value. */
  #placeholderPlugin(): Plugin {
    return new Plugin({
      props: {
        decorations: (state: EditorState) => {
          const { doc } = state,
            first = doc.firstChild;

          if (
            !this.placeholder ||
            doc.childCount !== 1 ||
            !first?.isTextblock ||
            first.content.size > 0
          ) {
            return null;
          }

          return DecorationSet.create(doc, [
            Decoration.node(0, first.nodeSize, {
              class: 'placeholder',
              'data-placeholder': this.placeholder
            })
          ]);
        }
      }
    });
  }

  get #labels() {
    return {
      bold: msg('Bold', { id: 'sl.richTextEditor.bold' }),
      italic: msg('Italic', { id: 'sl.richTextEditor.italic' }),
      underline: msg('Underline', { id: 'sl.richTextEditor.underline' }),
      strike: msg('Strikethrough', { id: 'sl.richTextEditor.strikethrough' }),
      code: msg('Inline code', { id: 'sl.richTextEditor.code' }),
      link: msg('Link', { id: 'sl.richTextEditor.link' }),
      bulletList: msg('Bulleted list', { id: 'sl.richTextEditor.bulletList' }),
      orderedList: msg('Numbered list', { id: 'sl.richTextEditor.orderedList' }),
      checklist: msg('Checklist', { id: 'sl.richTextEditor.checklist' }),
      outdent: msg('Decrease indent', { id: 'sl.richTextEditor.outdent' }),
      indent: msg('Increase indent', { id: 'sl.richTextEditor.indent' }),
      quote: msg('Quote', { id: 'sl.richTextEditor.quote' }),
      undo: msg('Undo', { id: 'sl.richTextEditor.undo' }),
      redo: msg('Redo', { id: 'sl.richTextEditor.redo' })
    };
  }

  #onBlockTypeChange(event: SlChangeEvent<string>): void {
    event.stopPropagation();

    if (!this.view) {
      return;
    }

    setBlockTypeCommand(this.view.state.schema, event.detail)(this.view.state, this.view.dispatch);
    this.view.focus();
  }

  #onBlur(): void {
    // Focus moving into the toolbar or the link popover doesn't count as leaving the editor.
    requestAnimationFrame(() => {
      if (this.matches(':focus-within')) {
        return;
      }

      this.blurEvent.emit();
      this.updateState({ touched: true });

      if (this.#value !== this.#valueOnFocus) {
        this.changeEvent.emit(this.#value);
        this.updateState({ dirty: true });
      }
    });
  }

  #onDocChange(): void {
    if (!this.view) {
      return;
    }

    const { doc } = this.view.state,
      text = doc.textContent;

    this.characterCount = text.length;
    this.empty = text.trim().length === 0 && !doc.firstChild?.type.spec.group?.includes('list');
    this.#value = this.empty && doc.childCount <= 1 ? '' : getHTML(this.view.state);
    this.#updateValueAndValidity();
  }

  #onFocus(): void {
    if (!this.matches(':focus-within') || this.#valueOnFocus === undefined) {
      this.#valueOnFocus = this.#value;
    }

    this.focusEvent.emit();
  }

  #onLinkHrefChange(event: SlChangeEvent<string>): void {
    event.stopPropagation();

    this.linkHref = event.detail;
  }

  #onLinkSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const view = this.view,
      link = view?.state.schema.marks.link;

    if (!view || !link) {
      return;
    }

    const { from, to, empty } = view.state.selection,
      href = this.linkHref.trim();

    let tr = view.state.tr.removeMark(from, to, link);

    if (href) {
      if (empty) {
        // Without a selection, insert the address as linked text.
        tr = tr.insertText(href, from).addMark(from, from + href.length, link.create({ href }));
        tr = tr.setSelection(TextSelection.create(tr.doc, from + href.length));
      } else {
        tr = tr.addMark(from, to, link.create({ href }));
      }
    }

    view.dispatch(tr);
    this.linkPopover?.hidePopover();

    // Return focus after the key event that submitted the form is done, or the same Enter
    // keystroke would end up in the editor and replace the linked text.
    setTimeout(() => view.focus());
  }

  #onLinkToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      requestAnimationFrame(() =>
        this.renderRoot.querySelector<TextField>('.link-form sl-text-field')?.focus()
      );
    }
  }

  #onToolbarItemClick(item: ToolbarItem): void {
    if (!this.view) {
      return;
    }

    if (item.id === 'link') {
      const link = this.view.state.schema.marks.link;

      if (item.isActive?.(this.view.state) && link) {
        // Clicking an active link button removes the link.
        const { from, to } = this.view.state.selection;
        this.view.dispatch(this.view.state.tr.removeMark(from, to, link));
      } else {
        this.#openLinkPopover();
        return;
      }
    } else {
      item.command?.(this.view.state, this.view.dispatch, this.view);
    }

    this.view.focus();
  }

  #onToolbarKeydown(event: KeyboardEvent): void {
    const items = Array.from(
        this.renderRoot.querySelectorAll<HTMLElement>('[data-toolbar-item]:not([disabled])')
      ),
      current = items.findIndex(item => item.matches(':focus-within'));

    let next = -1;
    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % items.length;
        break;
      case 'ArrowLeft':
        next = (current - 1 + items.length) % items.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      case 'Escape':
        event.preventDefault();
        this.view?.focus();
        return;
    }

    if (next > -1 && current > -1 && !(event.target as Element).matches('sl-select')) {
      event.preventDefault();
      items[next].focus();
    }
  }

  #onToolbarMousedown(event: MouseEvent): void {
    // Keep the focus (and the caret) in the editor when a toolbar button is clicked.
    if ((event.target as Element).closest('sl-toggle-button, sl-button')) {
      event.preventDefault();
    }
  }

  #openLinkPopover(): void {
    const view = this.view,
      link = view?.state.schema.marks.link;

    if (!view || !link || !this.linkPopover) {
      return;
    }

    const { $from } = view.state.selection;
    this.linkHref = (link.isInSet($from.marks())?.attrs.href as string | undefined) ?? '';
    this.linkPopover.showPopover();
  }

  /**
   * The toolbar's select and the link field are form controls themselves. Keep their form events
   * inside the editor, so a surrounding `<sl-form>` only sees the editor.
   */
  #stopInnerEvent(event: Event): void {
    event.stopPropagation();
  }

  #syncContentAttributes(): void {
    const content = this.#content,
      set = (name: string, value?: string | null): void => {
        if (value) {
          content.setAttribute(name, value);
        } else {
          content.removeAttribute(name);
        }
      };

    set('role', 'textbox');
    set('aria-multiline', 'true');
    set('aria-labelledby', this.getAttribute('data-label-id'));
    set('aria-label', this.getAttribute('aria-label'));
    set('aria-describedby', this.getAttribute('aria-describedby'));
    set('aria-required', this.required ? 'true' : null);
    set('aria-readonly', this.readonly ? 'true' : null);
    set('aria-disabled', this.disabled ? 'true' : null);
    set('aria-invalid', this.showValidity === 'invalid' ? 'true' : null);
    set('aria-placeholder', this.placeholder);
    set('autocapitalize', 'sentences');
    set('enterkeyhint', 'enter');
    content.spellcheck = true;
  }

  #updateValueAndValidity(): void {
    const tooLong = !!this.maxLength && this.characterCount > this.maxLength;

    const over = this.characterCount - (this.maxLength ?? 0);

    this.elementInternals.setFormValue(this.#value);
    this.elementInternals.setValidity(
      { valueMissing: !!this.required && this.empty, tooLong },
      tooLong
        ? msg(str`Please remove at least ${over} character(s).`, {
            id: 'sl.richTextEditor.validation.tooLong'
          })
        : msg('Please fill in this field.', { id: 'sl.form.validation.valueMissing' })
    );

    this.updateValidity();
  }
}
