/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const selected = instance.getString('State') === 'selected';

  const tabBase = instance.findInstance('tab-base', { traverseInstances: true });
  if (tabBase.type === 'ERROR') return null;

  const title = tabBase.getString('𝑻 - Title');

  const tabConfig = instance.findInstance('tab-config', { traverseInstances: true });
  if (tabConfig.type === 'ERROR') return null;

  const hasBadge = tabConfig.getBoolean('badge'),
    hasIcon = tabConfig.getBoolean('icon'),
    iconOnly = tabConfig.getBoolean('icon only');

  let badge;
  if (hasBadge) {
    badge = tabConfig.findInstance('sl-badge', { traverseInstances: true });
    if (badge.type === 'ERROR') return null;

    badge.properties.slot = { value: 'badge' };
  }

  let icon;
  if (hasIcon) {
    icon = tabConfig.findInstance('Base/Icon', { traverseInstances: true });
    if (icon.type === 'ERROR') return null;

    icon.properties.slot = { value: 'icon' };
  }

  return figma.code`
    <sl-tab ${selected ? 'selected' : ''}>
      ${icon?.executeTemplate().example}
      ${iconOnly ? '' : title}
      ${badge?.executeTemplate().example}
    </sl-tab>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
