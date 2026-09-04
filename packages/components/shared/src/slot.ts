/**
 * Returns the text assigned to the given slot, with all whitespace collapsed into single spaces and
 * trimmed.
 *
 * ```javascript
 * getSlottedText(event.target); // 'Label text'
 * getSlottedText(document.body); // ''
 * ```
 *
 * @param slot The slot to get the assigned text from; usually the `target` of a `slotchange` event.
 * @returns The slotted text, or a blank string if the given target is not a slot.
 */
export function getSlottedText(slot: EventTarget | null): string {
  if (!slot || !(slot instanceof HTMLSlotElement)) {
    return '';
  }

  return slot
    .assignedNodes({ flatten: true })
    .map(node => node.textContent?.trim() ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns true if the given slot has any assigned nodes, false otherwise.
 *
 * ```javascript
 * hasSlottedContent(event.target); // true
 * hasSlottedContent(document.body); // false
 * ```
 *
 * @param slot The slot to check for assigned nodes; usually the `target` of a `slotchange` event.
 * @returns True if the slot has any assigned nodes, false otherwise.
 */
export function hasSlottedContent(slot: EventTarget | null): boolean {
  if (!slot || !(slot instanceof HTMLSlotElement)) {
    return false;
  }

  return slot.assignedNodes({ flatten: true }).length > 0;
}
