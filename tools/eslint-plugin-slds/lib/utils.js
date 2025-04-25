export function isElement(node) {
  return node.type !== 'text';
}

export function isTextContent(node) {
  return node.type === 'text' && node.data.trim() !== '';
}

export function hasTextContent(element) {
  if (element.name === 'slot') {
    return true;
  }

  return element.children.some(child => {
    return isTextContent(child) || (isElement(child) && hasTextContent(child));
  });
}
