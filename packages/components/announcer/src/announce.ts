/**
 * Sends a notification to the live aria.
 * Please be aware that sending messages too soon after each other can cause the screenreader
 * to stop reading the earlier messages, or even skip them, when a new message is sent.
 * If you want to send multiple messages in a row, consider using a single message with all the information.
 *
 * @param message - The message to send to the live aria.
 * @param urgency - The urgency of the message. Default is 'polite'.
 */
export function announce(message: string, urgency?: 'polite' | 'assertive'): void {
  document.body.dispatchEvent(new CustomEvent('sl-announce', { detail: { message, urgency } }));
}
