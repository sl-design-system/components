import { DOMParser, DOMSerializer } from 'prosemirror-model';
export const createContentNode = (schema, value = '') => {
  const element = document.createElement('div');
  element.innerHTML = value.trim();
  return DOMParser.fromSchema(schema).parse(element);
};
export const getHTML = state => {
  const fragment = DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.content),
    element = document.createElement('div');
  element.appendChild(fragment);
  return element.innerHTML;
};
//# sourceMappingURL=utils.js.map
