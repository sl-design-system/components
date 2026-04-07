import { AllSelection, type Command, type EditorState, type Transaction } from 'prosemirror-state';
import { createContentNode } from './utils.js';

/** Shorthand for a ProseMirror transaction dispatch function. */
export type DispatchFn = (tr: Transaction) => void;

/**
 * Returns a ProseMirror command that replaces the entire document content
 * with the given HTML string.
 */
export const setHTML =
  (content: string): Command =>
  (state: EditorState, dispatch?: DispatchFn): boolean => {
    dispatch?.(
      state.tr.setSelection(new AllSelection(state.doc)).replaceSelectionWith(createContentNode(state.schema, content))
    );

    return true;
  };
