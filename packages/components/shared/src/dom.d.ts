/**
 * Returns the first scrollable parent of the given element.
 *
 * @param element The element to find the scrollable parent of.
 * @returns The first scrollable parent of the given element; if no explicit scroll parent, returns
 *   the html element.
 */
export declare const getScrollParent: (element: Element) => Element;
export declare function closestElementComposed<K extends keyof HTMLElementTagNameMap>(
  element: Node,
  selector: K
): HTMLElementTagNameMap[K] | null;
export declare function closestElementComposed<E extends Element = Element>(
  element: Node,
  selector: string
): E | null;
