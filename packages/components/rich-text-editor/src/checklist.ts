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

/**
 * Renders a checklist item with a real checkbox. The checkbox lives outside the editable content in
 * a non-editable label, so the editor never treats it as text. Cancelling `mousedown` keeps the
 * caret (and a phone's keyboard) where it is; the click that follows still toggles the box.
 */
export class TaskItemView implements NodeView {
  box: HTMLInputElement;
  contentDOM: HTMLElement;
  dom: HTMLLIElement;
  node: PMNode;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: () => number | undefined,
    readonly canToggle: () => boolean
  ) {
    this.node = node;

    this.dom = document.createElement('li');
    this.dom.className = 'task-item';

    const label = document.createElement('label');
    label.contentEditable = 'false';
    label.className = 'task-box';
    label.addEventListener('mousedown', event => event.preventDefault());

    this.box = document.createElement('input');
    this.box.type = 'checkbox';
    this.box.addEventListener('change', () => {
      const pos = getPos();

      if (pos !== undefined) {
        toggleTaskAt(this.node.type, pos)(view.state, view.dispatch);
      }
    });
    label.append(this.box);

    this.contentDOM = document.createElement('div');
    this.contentDOM.className = 'task-content';

    this.dom.append(label, this.contentDOM);
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
    return event.target === this.box;
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
