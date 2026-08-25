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
import { splitListItemKeepMarks } from './list-utils.js';
const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;
export const buildKeymap = schema => {
  const keys = {};
  keys['Mod-z'] = undo;
  keys['Shift-Mod-z'] = redo;
  keys['Backspace'] = chainCommands(
    undoInputRule,
    deleteSelection,
    joinBackward,
    selectNodeBackward
  );
  keys['Enter'] = chainCommands(
    newlineInCode,
    createParagraphNear,
    liftEmptyBlock,
    splitBlockKeepMarks
  );
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
    const cmd = chainCommands(exitCode, (state, dispatch) => {
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
export const buildListKeymap = schema => {
  const keys = {};
  if (schema.nodes.listItem) {
    keys['Enter'] = splitListItemKeepMarks(schema.nodes.listItem);
  }
  return keys;
};
//# sourceMappingURL=keymap.js.map
