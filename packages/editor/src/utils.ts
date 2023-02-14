import type { Node, Schema } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import { DOMParser, DOMSerializer } from 'prosemirror-model';

export const createContentNode = (schema: Schema, value = ''): Node => {
  const element = document.createElement('div');

  element.innerHTML = value.trim();

  return DOMParser.fromSchema(schema).parse(element);
};

export const getHTML = (state: EditorState): string => {
  const fragment = DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.content),
    element = document.createElement('div');

  element.appendChild(fragment);

  return element.innerHTML;
};
