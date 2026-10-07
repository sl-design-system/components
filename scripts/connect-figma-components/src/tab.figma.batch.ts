import figma from 'figma';
import {
  checkBooleanProperty,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const selected = checkStringProperty(instance.getString('State'), 'State') === 'selected';

  const tabBase = checkInstance(
    instance.findInstance('tab-base', { traverseInstances: true }),
    'tab-base'
  );

  const title = checkStringProperty(tabBase.getString('𝑻 - Title'), '𝑻 - Title');

  const tabConfig = checkInstance(
    instance.findInstance('tab-config', { traverseInstances: true }),
    'tab-config'
  );

  const hasBadge = checkBooleanProperty(tabConfig.getBoolean('badge'), 'badge'),
    hasIcon = checkBooleanProperty(tabConfig.getBoolean('icon'), 'icon'),
    iconOnly = checkBooleanProperty(tabConfig.getBoolean('icon only'), 'icon only');

  let badge;
  if (hasBadge) {
    badge = checkInstance(
      tabConfig.findInstance('sl-badge', { traverseInstances: true }),
      'sl-badge'
    );

    badge.properties.slot = { value: 'badge' };
  }

  let icon;
  if (hasIcon) {
    icon = checkInstance(
      tabConfig.findInstance('Base/Icon', { traverseInstances: true }),
      'Base/Icon'
    );

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
