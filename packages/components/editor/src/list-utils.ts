import { autoJoin } from 'prosemirror-commands';
import { Fragment, type Node, NodeRange, type NodeType, type ResolvedPos, type Schema, Slice } from 'prosemirror-model';
import { wrapInList as pslWrapInList, splitListItem } from 'prosemirror-schema-list';
import {
  type Command,
  type EditorState,
  NodeSelection,
  type Selection,
  TextSelection,
  type Transaction
} from 'prosemirror-state';
import { ReplaceAroundStep, liftTarget } from 'prosemirror-transform';
import { type EditorView } from 'prosemirror-view';
import { type DispatchFn } from './commands.js';

export const rootListDepth = (pos: ResolvedPos, nodes: { [key: string]: NodeType }): number | undefined => {
  // Get the depth of the nearest ancestor list
  const { bulletList, orderedList, listItem } = nodes;

  let depth;
  for (let i = pos.depth - 1; i > 0; i--) {
    const node = pos.node(i);

    if (node.type === bulletList || node.type === orderedList) {
      depth = i;
    }

    if (node.type !== bulletList && node.type !== orderedList && node.type !== listItem) {
      break;
    }
  }

  return depth;
};

export const getListLiftTarget = (schema: Schema, resPos: ResolvedPos): number => {
  // This will return (depth - 1) for root list parent of a list.
  const { bulletList, orderedList, listItem } = schema.nodes;

  let target = resPos.depth;
  for (let i = resPos.depth; i > 0; i--) {
    const node = resPos.node(i);

    if (node.type === bulletList || node.type === orderedList) {
      target = i;
    }

    if (node.type !== bulletList && node.type !== orderedList && node.type !== listItem) {
      break;
    }
  }

  return target - 1;
};

export function liftSelectionList(state: EditorState, tr: Transaction): Transaction {
  // The function will list paragraphs in selection out to level 1 below root list.
  const { from, to } = state.selection,
    { paragraph } = state.schema.nodes,
    listCol: Array<{ node: Node; pos: number }> = [];

  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === paragraph) {
      listCol.push({ node, pos });
    }
  });

  for (let i = listCol.length - 1; i >= 0; i--) {
    const paragr = listCol[i],
      start = tr.doc.resolve(tr.mapping.map(paragr.pos));

    if (start.depth > 0) {
      let end;

      if (paragr.node.textContent && paragr.node.textContent.length > 0) {
        end = tr.doc.resolve(tr.mapping.map(paragr.pos + paragr.node.textContent.length));
      } else {
        end = tr.doc.resolve(tr.mapping.map(paragr.pos + 1));
      }

      const range = start.blockRange(end);
      if (range) {
        tr.lift(range, getListLiftTarget(state.schema, start));
      }
    }
  }

  return tr;
}

export const toggleList = (state: EditorState, dispatch: DispatchFn, view: EditorView, listType: string): boolean => {
  const { selection } = state,
    fromNode = selection.$from.node(selection.$from.depth - 2),
    endNode = selection.$to.node(selection.$to.depth - 2);

  if (!fromNode || fromNode.type.name !== listType || !endNode || endNode.type.name !== listType) {
    return toggleListCommand(listType)(state, dispatch, view);
  } else {
    const depth = rootListDepth(selection.$to, state.schema.nodes) || 0;

    let tr = liftFollowingList(state, selection.$to.pos, selection.$to.end(depth), depth, state.tr);
    tr = liftSelectionList(state, tr);
    dispatch(tr);

    return true;
  }
};

export function toggleListCommand(listType: string): Command {
  return function (state: EditorState, dispatch?: DispatchFn, view?: EditorView) {
    if (!view) {
      return false;
    }

    state = view.state;

    const { $from, $to } = state.selection,
      parent = $from.node(-2),
      grandgrandParent = $from.node(-3),
      isRangeOfSingleType = isRangeOfType(state.doc, $from, $to, state.schema.nodes[listType]);

    if (
      ((parent && parent.type === state.schema.nodes[listType]) ||
        (grandgrandParent && grandgrandParent.type === state.schema.nodes[listType])) &&
      isRangeOfSingleType
    ) {
      // Untoggles list
      return liftListItems()(state, dispatch);
    } else {
      // Wraps selection in list and converts list type e.g. bullet_list -> ordered_list if needed
      if (!isRangeOfSingleType) {
        liftListItems()(state, dispatch);
        state = view.state;
      }

      return wrapInList(state.schema.nodes[listType])(state, dispatch);
    }
  };
}

function liftListItem(state: EditorState, selection: Selection, tr: Transaction): Transaction {
  const { $from, $to } = selection,
    nodeType: NodeType = state.schema.nodes['listItem'];

  let range = $from.blockRange($to, node => !!node.childCount && node.firstChild?.type === nodeType);
  if (!range || range.depth < 2 || $from.node(range.depth - 1).type !== nodeType) {
    return tr;
  }

  const end = range.end,
    endOfList = $to.end(range.depth);

  if (end < endOfList) {
    tr.step(
      new ReplaceAroundStep(
        end - 1,
        endOfList,
        end,
        endOfList,
        new Slice(Fragment.from(nodeType.create(undefined, range.parent.copy())), 1, 0),
        1,
        true
      )
    );

    range = new NodeRange(tr.doc.resolve($from.pos), tr.doc.resolve(endOfList), range.depth);
  }

  return tr.lift(range, liftTarget(range) || 0).scrollIntoView();
}

export function liftFollowingList(
  state: EditorState,
  from: number,
  to: number,
  rootListDepthNum: number,
  tr: Transaction
): Transaction {
  // Function will lift list item following selection to level-1.
  const { listItem } = state.schema.nodes;

  let lifted = false;
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (!lifted && node.type === listItem && pos > from) {
      lifted = true;

      let listDepth = rootListDepthNum + 3;
      while (listDepth > rootListDepthNum + 2) {
        const start = tr.doc.resolve(tr.mapping.map(pos));
        listDepth = start.depth;
        const end = tr.doc.resolve(tr.mapping.map(pos + node.textContent.length));
        const sel = new TextSelection(start, end);
        tr = liftListItem(state, sel, tr);
      }
    }
  });

  return tr;
}

export function isRangeOfType(doc: Node, $from: ResolvedPos, $to: ResolvedPos, nodeType: NodeType): boolean {
  // Step through block-nodes between $from and $to and returns false if a node is
  // found that isn't of the specified type
  return getAncestorNodesBetween(doc, $from, $to).filter(node => node.type !== nodeType).length === 0;
}

export function getAncestorNodesBetween(doc: Node, $from: ResolvedPos, $to: ResolvedPos): Node[] {
  // Returns all top-level ancestor-nodes between $from and $to
  const nodes: Node[] = [],
    maxDepth = findAncestorPosition(doc, $from).depth;

  let current = doc.resolve($from.start(maxDepth));
  while (current.pos <= $to.start($to.depth)) {
    const depth = Math.min(current.depth, maxDepth),
      node = current.node(depth);

    if (node) {
      nodes.push(node);
    }

    if (depth === 0) {
      break;
    }

    let next = doc.resolve(current.after(depth));
    if (next.start(depth) >= doc.nodeSize - 2) {
      break;
    }

    if (next.depth !== current.depth) {
      next = doc.resolve(next.pos + 2);
    }

    if (next.depth) {
      current = doc.resolve(next.start(next.depth));
    } else {
      current = doc.resolve(next.end(next.depth));
    }
  }

  return nodes;
}

export function findAncestorPosition(doc: Node, pos: ResolvedPos): ResolvedPos {
  // Traverse the document until an "ancestor" is found. Any nestable block can be an ancestor.
  const nestableBlocks = ['blockquote', 'bulletList', 'orderedList'];

  if (pos.depth === 1) {
    return pos;
  }

  let node = pos.node(pos.depth),
    newPos = pos;
  while (pos.depth >= 1) {
    pos = doc.resolve(pos.before(pos.depth));
    node = pos.node(pos.depth);

    if (node && nestableBlocks.indexOf(node.type.name) !== -1) {
      newPos = pos;
    }
  }

  return newPos;
}

export function liftListItems(): Command {
  return function (state: EditorState, dispatch?: DispatchFn): true {
    const { tr } = state,
      { $from, $to } = state.selection;

    tr.doc.nodesBetween($from.pos, $to.pos, (node: Node, pos: number): boolean | void => {
      // Following condition will ensure that block types paragraph, heading, codeBlock, blockquote, panel are lifted.
      // isTextblock is true for paragraph, heading, codeBlock.
      if (node.isTextblock || node.type.name === 'blockquote' || node.type.name === 'panel') {
        const sel = new NodeSelection(tr.doc.resolve(tr.mapping.map(pos))),
          range = sel.$from.blockRange(sel.$to);

        if (!range || sel.$from.parent.type !== state.schema.nodes['listItem']) {
          return false;
        }

        const target = range && liftTarget(range);
        if (target === undefined || target === null) {
          return false;
        }

        tr.lift(range, target);
      }
    });

    dispatch?.(tr);

    return true;
  };
}

export function wrapInList(nodeType: NodeType): Command {
  return autoJoin(pslWrapInList(nodeType), (before, after) => before.type === after.type && before.type === nodeType);
}

export function toggleUnorderedList(state: EditorState, dispatch: DispatchFn, view: EditorView): boolean {
  return toggleList(state, dispatch, view, 'bulletList');
}

export function toggleOrderedList(state: EditorState, dispatch: DispatchFn, view: EditorView): boolean {
  return toggleList(state, dispatch, view, 'orderedList');
}

export const splitListItemKeepMarks =
  (itemType: NodeType) =>
  (state: EditorState, dispatch?: DispatchFn): boolean => {
    // see https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L321-L327
    return splitListItem(itemType)(state, tr => {
      const marks = state.storedMarks || (state.selection.$to.parentOffset && state.selection.$from.marks());

      if (marks) {
        tr.ensureMarks(marks);
      }

      if (dispatch) {
        dispatch(tr);
      }
    });
  };
