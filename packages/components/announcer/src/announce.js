export function announce(message, urgency, force) {
  document.body.dispatchEvent(
    new CustomEvent('sl-announce', { detail: { message, urgency, ...(force ? { force } : {}) } })
  );
}
//# sourceMappingURL=announce.js.map
