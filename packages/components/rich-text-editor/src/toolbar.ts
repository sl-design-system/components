import { lift, setBlockType, toggleMark, wrapIn } from 'prosemirror-commands';
import { redo, redoDepth, undo, undoDepth } from 'prosemirror-history';
import { type MarkType, type NodeType, type ResolvedPos, type Schema } from 'prosemirror-model';
import { liftListItem, sinkListItem, wrapInList } from 'prosemirror-schema-list';
import { type Command, type EditorState } from 'prosemirror-state';
import { type RichTextEditorFeature } from './features.js';

/** The groups of the toolbar, in the order they appear. */
export type ToolbarGroup = 'marks' | 'link' | 'lists' | 'blocks' | 'history';

export const TOOLBAR_GROUPS: readonly ToolbarGroup[] = [
  'marks',
  'link',
  'lists',
  'blocks',
  'history'
];

export interface ToolbarItem {
  id: string;
  group: ToolbarGroup;
  icon: string;
  /** The (localized) label, used as the accessible name and tooltip. */
  label: string;
  /** The keyboard shortcut, shown in the tooltip. */
  shortcut?: string;
  /** Whether the button toggles something on and off; if so, it reflects `aria-pressed`. */
  toggle: boolean;
  /** The command to run; `link` is handled by the editor itself. */
  command?: Command;
  isActive?(state: EditorState): boolean;
  isEnabled(state: EditorState): boolean;
}

export type ToolbarLabels = Record<
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'link'
  | 'bulletList'
  | 'orderedList'
  | 'checklist'
  | 'outdent'
  | 'indent'
  | 'quote'
  | 'undo'
  | 'redo',
  string
>;

const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false,
  mod = mac ? '⌘' : 'Ctrl';

/** Whether the mark is active for the current selection (or the stored marks for a caret). */
export const markActive = (state: EditorState, type: MarkType): boolean => {
  const { empty, from, $from, to } = state.selection;

  if (empty) {
    return !!type.isInSet(state.storedMarks || $from.marks());
  }

  return state.doc.rangeHasMark(from, to, type);
};

/** Returns the depth of the closest ancestor of the selection with one of the given types. */
const findParentDepth = (state: EditorState, types: Array<NodeType | undefined>): number => {
  const { $from } = state.selection;

  for (let depth = $from.depth; depth > 0; depth--) {
    if (types.includes($from.node(depth).type)) {
      return depth;
    }
  }

  return -1;
};

/** Whether the selection is directly inside a list of the given type. */
const inList = (state: EditorState, listType: NodeType, schema: Schema): boolean => {
  const { bulletList, orderedList, taskList } = schema.nodes,
    depth = findParentDepth(state, [bulletList, orderedList, taskList]);

  return depth > -1 && state.selection.$from.node(depth).type === listType;
};

/** Returns the list item type at the selection, if any. */
const listItemTypeAt = (state: EditorState, schema: Schema): NodeType | undefined => {
  const { listItem, taskItem } = schema.nodes,
    depth = findParentDepth(state, [listItem, taskItem]);

  return depth > -1 ? state.selection.$from.node(depth).type : undefined;
};

/**
 * Turns the selection into a list of the given type. Inside that list already, it lifts the items
 * out of it; inside another list with the same item type, it changes the list type in place.
 */
const toggleList =
  (listType: NodeType, itemType: NodeType, schema: Schema): Command =>
  (state, dispatch) => {
    const { bulletList, orderedList, taskList } = schema.nodes,
      depth = findParentDepth(state, [bulletList, orderedList, taskList]);

    if (depth > -1) {
      const list = state.selection.$from.node(depth);

      if (list.type === listType) {
        return liftListItem(itemType)(state, dispatch);
      } else if (list.type.contentMatch.defaultType === itemType) {
        dispatch?.(state.tr.setNodeMarkup(state.selection.$from.before(depth), listType));

        return true;
      }
    }

    return wrapInList(listType)(state, dispatch);
  };

/** Wraps the selection in a block quote, or lifts it out when it is already in one. */
const toggleBlockquote =
  (blockquote: NodeType): Command =>
  (state, dispatch) =>
    findParentDepth(state, [blockquote]) > -1
      ? lift(state, dispatch)
      : wrapIn(blockquote)(state, dispatch);

/** Indents or outdents the list item the caret is in. */
const indent =
  (schema: Schema, sink: boolean): Command =>
  (state, dispatch) => {
    const itemType = listItemTypeAt(state, schema);

    if (!itemType) {
      return false;
    }

    return (sink ? sinkListItem(itemType) : liftListItem(itemType))(state, dispatch);
  };

/** The block types the "text style" select offers. */
export interface BlockType {
  /** Unique value used by the select. */
  value: string;
  label: string;
  level?: number;
}

/** Returns the value of the block type the selection starts in. */
export const getBlockType = (state: EditorState): string => {
  const { parent } = state.selection.$from;

  return parent.type.name === 'heading' ? `h${parent.attrs.level as number}` : 'p';
};

/** Changes the text block(s) in the selection into the given block type. */
export const setBlockTypeCommand = (schema: Schema, value: string): Command => {
  const { heading, paragraph } = schema.nodes;

  return value.startsWith('h') && heading
    ? setBlockType(heading, { level: Number(value.slice(1)) })
    : setBlockType(paragraph);
};

/** Builds the toolbar items for the enabled features and schema. */
export const buildToolbarItems = (
  features: Set<RichTextEditorFeature>,
  schema: Schema,
  labels: ToolbarLabels
): ToolbarItem[] => {
  const items: ToolbarItem[] = [],
    { marks, nodes } = schema;

  const markItem = (
    feature: RichTextEditorFeature,
    type: MarkType | undefined,
    icon: string,
    label: string,
    shortcut?: string
  ): void => {
    if (!features.has(feature) || !type) {
      return;
    }

    const command = toggleMark(type);

    items.push({
      id: feature,
      group: 'marks',
      icon,
      label,
      shortcut,
      toggle: true,
      command,
      isActive: state => markActive(state, type),
      isEnabled: state => command(state)
    });
  };

  markItem('bold', marks.strong, 'bold', labels.bold, `${mod}+B`);
  markItem('italic', marks.em, 'italic', labels.italic, `${mod}+I`);
  markItem('underline', marks.underline, 'underline', labels.underline, `${mod}+U`);
  markItem('strike', marks.strikethrough, 'strikethrough', labels.strike);
  markItem('code', marks.code, 'code', labels.code, `${mod}+E`);

  if (features.has('link') && marks.link) {
    const link = marks.link;

    items.push({
      id: 'link',
      group: 'link',
      icon: 'link',
      label: labels.link,
      shortcut: `${mod}+K`,
      toggle: true,
      isActive: state => markActive(state, link),
      isEnabled: state => markActive(state, link) || toggleMark(link)(state)
    });
  }

  const listItem = (
    feature: RichTextEditorFeature,
    listType: NodeType | undefined,
    itemType: NodeType | undefined,
    icon: string,
    label: string
  ): void => {
    if (!features.has(feature) || !listType || !itemType) {
      return;
    }

    const command = toggleList(listType, itemType, schema);

    items.push({
      id: feature,
      group: 'lists',
      icon,
      label,
      toggle: true,
      command,
      isActive: state => inList(state, listType, schema),
      isEnabled: state => command(state)
    });
  };

  listItem('bullet-list', nodes.bulletList, nodes.listItem, 'list-ul', labels.bulletList);
  listItem('ordered-list', nodes.orderedList, nodes.listItem, 'list-ol', labels.orderedList);
  listItem('checklist', nodes.taskList, nodes.taskItem, 'list-check', labels.checklist);

  if (items.some(item => item.group === 'lists')) {
    const outdent = indent(schema, false),
      sink = indent(schema, true);

    items.push(
      {
        id: 'outdent',
        group: 'lists',
        icon: 'outdent',
        label: labels.outdent,
        shortcut: 'Shift+Tab',
        toggle: false,
        command: outdent,
        isEnabled: state => outdent(state)
      },
      {
        id: 'indent',
        group: 'lists',
        icon: 'indent',
        label: labels.indent,
        shortcut: 'Tab',
        toggle: false,
        command: sink,
        isEnabled: state => sink(state)
      }
    );
  }

  if (features.has('quote') && nodes.blockquote) {
    const blockquote = nodes.blockquote,
      command = toggleBlockquote(blockquote);

    items.push({
      id: 'quote',
      group: 'blocks',
      icon: 'block-quote',
      label: labels.quote,
      toggle: true,
      command,
      isActive: state => findParentDepth(state, [blockquote]) > -1,
      isEnabled: state => command(state)
    });
  }

  if (features.has('history')) {
    items.push(
      {
        id: 'undo',
        group: 'history',
        icon: 'arrow-rotate-left',
        label: labels.undo,
        shortcut: `${mod}+Z`,
        toggle: false,
        command: undo,
        isEnabled: state => undoDepth(state) > 0
      },
      {
        id: 'redo',
        group: 'history',
        icon: 'arrow-rotate-right',
        label: labels.redo,
        shortcut: mac ? '⌘+Shift+Z' : 'Ctrl+Y',
        toggle: false,
        command: redo,
        isEnabled: state => redoDepth(state) > 0
      }
    );
  }

  return items;
};

export interface LinkRange {
  from: number;
  to: number;
  href: string;
}

/**
 * Returns the whole link around a position, so editing a link with the caret in it changes all of
 * it rather than just the caret position. Returns `undefined` when the position isn't in a link.
 */
export const linkRangeAt = ($pos: ResolvedPos, type: MarkType): LinkRange | undefined => {
  const { parent } = $pos;
  let index = $pos.index();

  // At the end of a link, the caret sits after its last text node.
  if (index === parent.childCount || !type.isInSet(parent.child(index).marks)) {
    if (index > 0 && type.isInSet(parent.child(index - 1).marks)) {
      index--;
    } else {
      return undefined;
    }
  }

  const mark = type.isInSet(parent.child(index).marks)!;
  let start = index,
    end = index + 1;

  while (start > 0 && mark.isInSet(parent.child(start - 1).marks)) {
    start--;
  }

  while (end < parent.childCount && mark.isInSet(parent.child(end).marks)) {
    end++;
  }

  let from = $pos.start();
  for (let i = 0; i < start; i++) {
    from += parent.child(i).nodeSize;
  }

  let to = from;
  for (let i = start; i < end; i++) {
    to += parent.child(i).nodeSize;
  }

  return { from, to, href: (mark.attrs.href as string) ?? '' };
};
