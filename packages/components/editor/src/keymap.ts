import {
  chainCommands,
  createParagraphNear,
  deleteSelection,
  exitCode,
  joinBackward,
  liftEmptyBlock,
  newlineInCode,
  selectNodeBackward,
  splitBlockKeepMarks,
  toggleMark
} from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { type Schema } from 'prosemirror-model';
import { type Command, type EditorState } from 'prosemirror-state';
import { type DispatchFn } from './commands.js';
import { splitListItemKeepMarks } from './list-utils.js';
import { type EditorMarks, type EditorNodes } from './schema.js';

// Detect macOS to register platform-specific key bindings.
const mac = typeof navigator !== 'undefined' ? /Mac|iPhone|iPad|iPod/.test(navigator.userAgent) : false;

/**
 * Build the core key bindings for the editor: undo/redo, backspace, enter,
 * bold/italic/underline toggles, and hard-break insertion.
 */
export const buildKeymap = (schema: Schema<EditorNodes, EditorMarks>): { [key: string]: Command } => {
  const keys: { [key: string]: Command } = {};

  keys['Mod-z'] = undo;
  keys['Shift-Mod-z'] = redo;
  keys['Backspace'] = chainCommands(undoInputRule, deleteSelection, joinBackward, selectNodeBackward);
  keys['Enter'] = chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlockKeepMarks);

  if (!mac) {
    keys['Mod-y'] = redo;
  }

  if (schema.marks.strong) {
    keys['Mod-b'] = toggleMark(schema.marks.strong);
  }

  if (schema.marks.em) {
    keys['Mod-i'] = toggleMark(schema.marks.em);
  }

  if (schema.marks.underline) {
    keys['Mod-u'] = toggleMark(schema.marks.underline);
  }

  if (schema.nodes.hardBreak) {
    const br = schema.nodes.hardBreak;
    const cmd = chainCommands(exitCode, (state: EditorState, dispatch?: DispatchFn) => {
      dispatch?.(state.tr.replaceSelectionWith(br.create()).scrollIntoView());

      return true;
    });

    keys['Mod-Enter'] = cmd;
    keys['Shift-Enter'] = cmd;

    if (mac) {
      keys['Ctrl-Enter'] = cmd;
    }
  }

  return keys;
};

/**
 * Build list-specific key bindings. This is registered as a separate keymap
 * so list Enter handling takes priority over the generic Enter behavior.
 */
export const buildListKeymap = (schema: Schema<EditorNodes, EditorMarks>): { [key: string]: Command } => {
  const keys: { [key: string]: Command } = {};

  if (schema.nodes.listItem) {
    keys['Enter'] = splitListItemKeepMarks(schema.nodes.listItem);
  }

  return keys;
};
