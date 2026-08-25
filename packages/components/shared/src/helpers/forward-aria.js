function resolveDeepTarget(host) {
  let target = host.getProxyTarget();
  while (target && 'getProxyTarget' in target) {
    const next = target.getProxyTarget();
    if (!next || next === target) break;
    target = next;
  }
  return target;
}
export function getForwardedAccessibleName(host) {
  const target = resolveDeepTarget(host);
  const labelledBy = target?.ariaLabelledByElements ?? [];
  if (labelledBy.length) {
    return labelledBy
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');
  }
  const ariaLabel = target?.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const slot = host.renderRoot?.querySelector('slot'),
    nodes = slot?.assignedNodes({ flatten: true }) ?? [];
  return nodes
    .map(node => node.textContent?.trim())
    .filter(Boolean)
    .join(' ');
}
export function getForwardedDescription(host) {
  const target = resolveDeepTarget(host);
  const describedBy = target?.ariaDescribedByElements ?? [];
  if (describedBy.length) {
    return describedBy
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .join(' ');
  }
  return target?.getAttribute('aria-description') || host.getAttribute('aria-description') || '';
}
export function getForwardedAriaAttribute(host, name) {
  return resolveDeepTarget(host)?.getAttribute(name) ?? null;
}
export function getForwardedAriaProperty(host, name) {
  return resolveDeepTarget(host)?.[name];
}
export function isForwardedDisabled(host) {
  if (host.disabled) {
    return true;
  }
  const target = resolveDeepTarget(host);
  if (target?.ariaDisabled === 'true' || host.getAttribute('aria-disabled') === 'true') {
    return 'aria';
  }
  return false;
}
//# sourceMappingURL=forward-aria.js.map
