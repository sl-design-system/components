import { type Checkbox } from '@sl-design-system/checkbox';
import { type NodeType, type Node as PMNode } from 'prosemirror-model';
import { liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { type Command, Plugin } from 'prosemirror-state';
import { type EditorView, type NodeView } from 'prosemirror-view';

let nextTaskId = 0;

/** Creates a unique id for a checklist item. */
const createTaskId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `task-${Date.now().toString(36)}-${nextTaskId++}`;

/**
 * Gives every checklist item a stable id and re-ids duplicates. Duplicates appear when Enter splits
 * an item or when an item is pasted; the first item keeps its id, so a ticked item keeps its tick.
 */
export const taskIdsPlugin = (taskItem: NodeType): Plugin =>
  new Plugin({
    appendTransaction(_transactions, _oldState, state) {
      const seen = new Set<string>(),
        tr = state.tr;

      state.doc.descendants((node, pos) => {
        if (node.type !== taskItem) {
          return;
        }

        let id = node.attrs.id as string | null;
        if (!id || seen.has(id)) {
          id = createTaskId();
          tr.setNodeAttribute(pos, 'id', id);
        }

        seen.add(id);
      });

      return tr.docChanged ? tr.setMeta('addToHistory', false) : null;
    }
  });

/** Ticks or unticks the checklist item at the given position. This is one undoable step. */
export const toggleTaskAt =
  (taskItem: NodeType, pos: number): Command =>
  (state, dispatch) => {
    const node = state.doc.nodeAt(pos);

    if (node?.type !== taskItem) {
      return false;
    }

    dispatch?.(state.tr.setNodeAttribute(pos, 'checked', !node.attrs.checked));

    return true;
  };

/** Ticks or unticks the checklist item the caret is in. */
export const toggleTaskAtCaret =
  (taskItem: NodeType): Command =>
  (state, dispatch) => {
    const { $from } = state.selection;

    for (let depth = $from.depth; depth > 0; depth--) {
      if ($from.node(depth).type === taskItem) {
        return toggleTaskAt(taskItem, $from.before(depth))(state, dispatch);
      }
    }

    return false;
  };

/** Keyboard shortcuts for checklists. Each one returns `false` outside a checklist item. */
export const buildChecklistKeymap = (taskItem: NodeType): Record<string, Command> => ({
  Enter: splitListItem(taskItem, { checked: false, id: null }),
  Tab: sinkListItem(taskItem),
  'Shift-Tab': liftListItem(taskItem),
  'Mod-Enter': toggleTaskAtCaret(taskItem)
});

/** Form events `sl-checkbox` emits that must not leave the editor. */
const CHECKBOX_EVENTS = [
  'sl-blur',
  'sl-change',
  'sl-focus',
  'sl-form-control',
  'sl-update-state',
  'sl-update-validity',
  'sl-validate'
];

/**
 * Renders a checklist item with an `<sl-checkbox>`. The checkbox sits outside the editable content
 * in a non-editable wrapper, so the editor never treats it as text, and it is labelled by the
 * item's text rather than wrapping it: a checkbox toggles on any click inside it, which would make
 * the text impossible to edit.
 *
 * The checkbox's own form events stay inside the editor, so a surrounding `<sl-form>` only sees the
 * editor. After a pointer toggle the editor takes focus back, so the caret (and a phone's keyboard)
 * stay where they were; a keyboard toggle leaves focus on the checkbox.
 */
export class TaskItemView implements NodeView {
  box: Checkbox;
  contentDOM: HTMLElement;
  dom: HTMLLIElement;
  node: PMNode;

  /** The non-editable wrapper around the checkbox; also the 44 × 44 px tap area. */
  #boxWrapper: HTMLElement;

  /** Whether the current toggle started with a pointer. */
  #pointerToggle = false;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: () => number | undefined,
    readonly canToggle: () => boolean
  ) {
    this.node = node;

    this.dom = document.createElement('li');
    this.dom.className = 'task-item';

    this.#boxWrapper = document.createElement('span');
    this.#boxWrapper.contentEditable = 'false';
    this.#boxWrapper.className = 'task-box';
    this.#boxWrapper.addEventListener('pointerdown', () => (this.#pointerToggle = true));
    this.#boxWrapper.addEventListener('mousedown', event => event.preventDefault());

    // Clicks on the tap area around the checkbox toggle it too.
    this.#boxWrapper.addEventListener('click', event => {
      if (event.target === this.#boxWrapper && !this.box.disabled) {
        this.box.click();
      }
    });

    this.box = document.createElement('sl-checkbox');
    this.box.addEventListener('sl-change', () => {
      const pos = getPos();

      if (pos !== undefined) {
        toggleTaskAt(this.node.type, pos)(view.state, view.dispatch);
      }

      if (this.#pointerToggle) {
        view.focus();
      }
      this.#pointerToggle = false;
    });
    CHECKBOX_EVENTS.forEach(type =>
      this.#boxWrapper.addEventListener(type, event => event.stopPropagation())
    );
    this.#boxWrapper.append(this.box);

    this.contentDOM = document.createElement('div');
    this.contentDOM.className = 'task-content';

    this.dom.append(this.#boxWrapper, this.contentDOM);
    this.#render();
  }

  update(node: PMNode): boolean {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    this.#render();

    return true;
  }

  stopEvent(event: Event): boolean {
    return event.target instanceof Node && this.#boxWrapper.contains(event.target);
  }

  ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Node }): boolean {
    return mutation.type !== 'selection' && !this.contentDOM.contains(mutation.target);
  }

  #render(): void {
    const checked = !!this.node.attrs.checked,
      id = (this.node.attrs.id as string | null) ?? '';

    this.box.checked = checked;
    this.box.disabled = !this.canToggle();
    this.dom.dataset.checked = String(checked);

    // Label the checkbox by the item's text, so it reads "Read chapter 4.2, checkbox, not checked".
    if (id) {
      this.contentDOM.id = `sl-rich-text-editor-task-${id}`;
      this.box.setAttribute('aria-labelledby', this.contentDOM.id);
    }
  }
}
