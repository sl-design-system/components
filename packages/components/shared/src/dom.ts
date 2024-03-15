export const getScrollParent = (element: Element): Element | null => {
  if (element == null) {
    return null;
  }

  if (element.scrollHeight > element.clientHeight) {
    return element;
  } else if (element.parentElement) {
    return getScrollParent(element.parentElement);
  } else {
    return element;
  }
};
