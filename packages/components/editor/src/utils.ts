import { DOMParser, DOMSerializer, type Node, type Schema } from 'prosemirror-model';
import { type EditorState } from 'prosemirror-state';

/**
 * Parse an HTML string into a ProseMirror document node using the given schema.
 * Returns an empty document when value is empty or undefined.
 */
export const createContentNode = (schema: Schema, value = ''): Node => {
  const element = document.createElement('div');

  element.innerHTML = value.trim();

  return DOMParser.fromSchema(schema).parse(element);
};

/**
 * Serialize the current editor state's document back to an HTML string.
 */
export const getHTML = (state: EditorState): string => {
  const fragment = DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.content),
    element = document.createElement('div');

  element.appendChild(fragment);

  return element.innerHTML;
};
