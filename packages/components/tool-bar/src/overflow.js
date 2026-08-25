export function calculateVisibility(items, widths, availableWidth, gap, menuButtonWidth) {
  let cumulativeWidth = 0,
    needsMenu = false;
  for (let i = 0; i < items.length; i++) {
    const itemWidth = widths[i],
      gapWidth = i > 0 ? gap : 0,
      requiredWidth = cumulativeWidth + gapWidth + itemWidth;
    if (requiredWidth > availableWidth) {
      needsMenu = true;
      break;
    }
    cumulativeWidth = requiredWidth;
  }
  const effectiveWidth = availableWidth - (needsMenu ? menuButtonWidth : 0);
  setItemVisibility(items, widths, effectiveWidth, gap);
  if (needsMenu && items.every(item => !item.visible || item.type === 'divider')) {
    setItemVisibility(items, widths, effectiveWidth + gap, gap);
    const visibleWidth = items.reduce(
      (sum, item, i) => (item.visible ? sum + (sum > 0 ? gap : 0) + widths[i] : sum),
      0
    );
    if (visibleWidth > 0 && visibleWidth + menuButtonWidth > availableWidth) {
      items.forEach(item => (item.visible = false));
    }
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].type !== 'divider' || !items[i].visible) {
      continue;
    }
    const hasVisibleBefore =
        i > 0 && items.slice(0, i).some(item => item.visible && item.type !== 'divider'),
      hasVisibleAfter =
        i < items.length - 1 &&
        items.slice(i + 1).some(item => item.visible && item.type !== 'divider');
    if (!hasVisibleBefore || !hasVisibleAfter) {
      items[i].visible = false;
    }
  }
}
function setItemVisibility(items, widths, effectiveWidth, gap) {
  let cumulativeWidth = 0,
    overflowing = false;
  for (let i = 0; i < items.length; i++) {
    const itemWidth = widths[i],
      gapWidth = cumulativeWidth > 0 ? gap : 0,
      requiredWidth = cumulativeWidth + gapWidth + itemWidth;
    if (overflowing || requiredWidth > effectiveWidth) {
      items[i].visible = false;
      overflowing = true;
    } else {
      items[i].visible = true;
      cumulativeWidth = requiredWidth;
    }
  }
}
export function applyVisibility(items) {
  items.forEach(item => {
    item.element.style.visibility = item.visible ? '' : 'hidden';
    item.element.style.position = item.visible ? '' : 'absolute';
  });
}
export function revealAllItems(items) {
  items.forEach(item => {
    item.element.style.visibility = '';
    item.element.style.position = '';
    item.visible = true;
  });
}
export function measureItemWidths(items) {
  const widths = items.map(item => item.element.getBoundingClientRect().width),
    hasInvalidMeasurements = items.some((item, i) => item.type !== 'divider' && widths[i] === 0);
  return hasInvalidMeasurements ? void 0 : widths;
}
export function measureMenuButtonWidth(wrapper, menuButton, gap) {
  let width = wrapper.getBoundingClientRect().height;
  if ((isNaN(width) || width === 0) && menuButton) {
    width = menuButton.getBoundingClientRect().width;
  }
  if (menuButton) {
    width += parseFloat(getComputedStyle(menuButton).marginInlineStart) || 0;
  } else {
    width += gap;
  }
  return width;
}
export function measureConstrainedWidth(host, internals) {
  const hostStyles = getComputedStyle(host),
    paddingInline =
      (parseFloat(hostStyles.paddingInlineStart) || 0) +
      (parseFloat(hostStyles.paddingInlineEnd) || 0),
    borderInline =
      (parseFloat(hostStyles.borderInlineStartWidth) || 0) +
      (parseFloat(hostStyles.borderInlineEndWidth) || 0);
  internals.states.add('measuring');
  try {
    void host.offsetHeight;
    let measuredWidth = host.getBoundingClientRect().width - paddingInline - borderInline;
    if (measuredWidth <= 0 && host.parentElement) {
      measuredWidth = host.parentElement.clientWidth - paddingInline - borderInline;
    }
    return measuredWidth;
  } finally {
    internals.states.delete('measuring');
  }
}
export function getContentBoxWidth(host) {
  const rect = host.getBoundingClientRect(),
    styles = getComputedStyle(host),
    padding =
      (parseFloat(styles.paddingInlineStart) || 0) + (parseFloat(styles.paddingInlineEnd) || 0),
    border =
      (parseFloat(styles.borderInlineStartWidth) || 0) +
      (parseFloat(styles.borderInlineEndWidth) || 0);
  return rect.width - padding - border;
}
export function isFitContent(host, parent) {
  return host.getBoundingClientRect().width > parent.clientWidth + 1;
}
export function hasWrapperOverflow(wrapper) {
  return wrapper.clientWidth < wrapper.scrollWidth || wrapper.clientHeight < wrapper.scrollHeight;
}
//# sourceMappingURL=overflow.js.map
