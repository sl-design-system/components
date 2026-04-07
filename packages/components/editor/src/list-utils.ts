import { type NodeType } from 'prosemirror-model';
import { splitListItem } from 'prosemirror-schema-list';
import { type EditorState } from 'prosemirror-state';
import { type DispatchFn } from './commands.js';

/**
 * A variant of ProseMirror's `splitListItem` that preserves active marks
 * (bold, italic, etc.) when splitting a list item with Enter.
 *
 * Without this, pressing Enter inside a bold list item would reset the
 * marks on the new item. This reads the stored marks (or the marks at the
 * current cursor position) and re-applies them after the split.
 *
 * @see https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L321-L327
 */
export const splitListItemKeepMarks =
  (itemType: NodeType) =>
  (state: EditorState, dispatch?: DispatchFn): boolean => {
    return splitListItem(itemType)(state, tr => {
      const marks = state.storedMarks || (state.selection.$to.parentOffset && state.selection.$from.marks());

      if (marks) {
        tr.ensureMarks(marks);
      }

      dispatch?.(tr);
    });
  };
