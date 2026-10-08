import figma, { type InstanceHandle } from 'figma';
import { checkBooleanProperty, checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const selected = checkStringProperty(instance.getString('State'), 'State') === 'selected';

  const tabBase = instance.findInstance('tab-base', { traverseInstances: true }) as InstanceHandle;

  const title = checkStringProperty(tabBase.getString('𝑻 - Title'), '𝑻 - Title');

  const tabConfig = instance.findInstance('tab-config', {
    traverseInstances: true
  }) as InstanceHandle;

  const hasBadge = checkBooleanProperty(tabConfig.getBoolean('badge'), 'badge'),
    hasIcon = checkBooleanProperty(tabConfig.getBoolean('icon'), 'icon'),
    iconOnly = checkBooleanProperty(tabConfig.getBoolean('icon only'), 'icon only');

  let badge;
  if (hasBadge) {
    badge = tabConfig.findInstance('sl-badge', { traverseInstances: true }) as InstanceHandle;

    badge.properties.slot = { value: 'badge' };
  }

  let icon;
  if (hasIcon) {
    icon = tabConfig.findInstance('Base/Icon', { traverseInstances: true }) as InstanceHandle;

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
