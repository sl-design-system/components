export const getScrollParent = element => {
  const { overflow, overflowY } = getComputedStyle(element),
    scrollable = /(auto|scroll)/.test(overflow + overflowY);
  if (scrollable || element.scrollHeight > element.clientHeight) {
    return element;
  } else if (element.parentElement) {
    return getScrollParent(element.parentElement);
  } else {
    return element;
  }
};
export function closestElementComposed(element, selector) {
  if (element instanceof HTMLElement) {
    const found = element.closest(selector);
    return found ?? closestElementComposed(element.getRootNode({ composed: true }), selector);
  } else {
    return null;
  }
}
//# sourceMappingURL=dom.js.map
