import type { Command, EditorState, Transaction } from 'prosemirror-state';
import { AllSelection } from 'prosemirror-state';
import { createContentNode } from './utils.js';

export type DispatchFn = (tr: Transaction) => void;

export const setHTML =
  (content: string): Command =>
  (state: EditorState, dispatch?: DispatchFn): boolean => {
    dispatch?.(
      state.tr.setSelection(new AllSelection(state.doc)).replaceSelectionWith(createContentNode(state.schema, content))
    );

    return true;
  };
