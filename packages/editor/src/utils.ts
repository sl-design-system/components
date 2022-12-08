import type { Node, Schema } from 'prosemirror-model';
import { DOMParser } from 'prosemirror-model';

export const createContentNode = (schema: Schema, value = ''): Node => {
  const element = document.createElement('div');

  element.innerHTML = value.trim();

  return DOMParser.fromSchema(schema).parse(element);
};
