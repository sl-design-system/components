export function isElement(node) {
  return node.type !== 'text';
}

export function isTextContent(node) {
  return node.type === 'text' && node.data.trim() !== '';
}

export function hasTextContent(element) {
  // Return true for slot elements
  if (element.name === 'slot') {
    return true;
  }

  // Return false specifically for sl-icon elements
  if (element.name === 'sl-icon') {
    return false;
  }

  // For other custom elements (except sl-icon), continue checking their children
  // but also assume they might have content if they're not sl-button itself
  if (element.name.includes('-') && element.name !== 'sl-icon' && element.name !== 'sl-button') {
    // This handles elements like sl-foo that we want to consider as having content
    return true;
  }

  // Check if any children have text content
  const hasChildWithText = element.children.some(child => {
    return isTextContent(child) || (isElement(child) && hasTextContent(child));
  });

  return hasChildWithText;
}
