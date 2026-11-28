import {
  type InputRule,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule
} from 'prosemirror-inputrules';
import { type Schema } from 'prosemirror-model';
import { type Plugin } from 'prosemirror-state';

/**
 * Markdown shortcuts at the start of a line: `- ` or `* ` for a bulleted list, `1. ` for a numbered
 * list, `[] ` for a checklist, `> ` for a quote and `## ` to `#### ` for headings. Only rules for
 * nodes in the schema are added. ProseMirror holds input rules back during IME composition.
 */
export const buildInputRules = (schema: Schema): Plugin => {
  const rules: InputRule[] = [],
    { blockquote, bulletList, heading, orderedList, taskList } = schema.nodes;

  if (taskList) {
    rules.push(wrappingInputRule(/^\s*\[ ?\]\s$/, taskList));
  }

  if (bulletList) {
    rules.push(wrappingInputRule(/^\s*([-+*])\s$/, bulletList));
  }

  if (orderedList) {
    rules.push(
      wrappingInputRule(
        /^(\d+)\.\s$/,
        orderedList,
        match => ({ order: +match[1] }),
        (match, node) => node.childCount + (node.attrs.order as number) === +match[1]
      )
    );
  }

  if (blockquote) {
    rules.push(wrappingInputRule(/^\s*>\s$/, blockquote));
  }

  if (heading) {
    rules.push(
      textblockTypeInputRule(/^(#{2,4})\s$/, heading, match => ({
        level: match[1].length
      }))
    );
  }

  return inputRules({ rules });
};
