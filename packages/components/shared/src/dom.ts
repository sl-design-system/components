/**
 * Returns the first scrollable parent of the given element.
 * @param element The element to find the scrollable parent of.
 * @returns The first scrollable parent of the given element; if no explicit scroll parent, returns the html element.
 */
export const getScrollParent = (element: Element): Element => {
  if (element.scrollHeight > element.clientHeight) {
    return element;
  } else if (element.parentElement) {
    return getScrollParent(element.parentElement);
  } else {
    return element;
  }
};
