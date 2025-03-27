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

export function closestElementComposed<K extends keyof HTMLElementTagNameMap>(
  element: Node,
  selector: K
): HTMLElementTagNameMap[K] | null;

export function closestElementComposed<E extends Element = Element>(element: Node, selector: string): E | null;

/**
 * Returns the closest element that matches the selector, across all
 * parent shadow roots.
 */
export function closestElementComposed(element: Node, selector: string): Element | null {
  if (element instanceof HTMLElement) {
    const found = element.closest(selector);

    return found ?? closestElementComposed(element.getRootNode({ composed: true }), selector);
  } else {
    return null;
  }
}
