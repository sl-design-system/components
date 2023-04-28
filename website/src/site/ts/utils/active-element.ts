export const getActiveElement = (el: Node): Element | null => {
  return (el.getRootNode() as Document).activeElement;
};
