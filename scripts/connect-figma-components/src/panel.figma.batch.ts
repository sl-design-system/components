import figma from 'figma';
import { checkBooleanProperty, checkInstance } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const collapsible = figma.batch.collapsible,
    border = checkBooleanProperty(instance.getBoolean('Border'), 'Border'),
    divider = checkBooleanProperty(instance.getBoolean('Divider'), 'Divider'),
    elevationRaw = instance.getString('Elevation') || 'none',
    shadow = checkBooleanProperty(instance.getBoolean('Shadow'), 'Shadow');

  const density =
    instance.getEnum('Density', {
      Default: 'default',
      Relaxed: 'relaxed'
    }) ?? 'default';

  const togglePlacement = collapsible
    ? (instance.getEnum('Toggle Position', { Start: 'start', End: 'end' }) ?? 'start')
    : undefined;

  const collapsed = collapsible ? instance.getString('State') === 'Collapsed' : false;

  let elevation;
  if (elevationRaw === 'Raised' && shadow) {
    elevation = 'raised';
  } else if (elevationRaw === 'Sunken') {
    elevation = 'sunken';
  } else {
    elevation = 'none';
  }

  const header = checkInstance(
    collapsible
      ? instance.findInstance('sl-panel-header-collapsable')
      : instance.findInstance('sl-panel-header-default'),
    collapsible ? 'sl-panel-header-collapsable' : 'sl-panel-header-default'
  );

  const hasActions = collapsible
      ? false
      : checkBooleanProperty(header.getBoolean('Actions'), 'Actions'),
    hasPrefix = checkBooleanProperty(header.getBoolean('Prefix'), 'Prefix'),
    hasSuffix = checkBooleanProperty(header.getBoolean('Suffix'), 'Suffix');

  const heading = checkInstance(header.findText('title'), 'title');

  let actions;
  if (hasActions) {
    actions = header
      .findConnectedInstances(() => true, { path: ['sl-panel-header-default', 'actions'] })
      .filter(instance => instance.type !== 'ERROR')
      .map(instance => {
        instance.properties.slot = { value: 'actions' };

        return instance.executeTemplate().example;
      })
      .flatMap(results => results.find(r => r.type === 'CODE'))
      .map(result => result?.code)
      .join('\n');
  }

  let prefix;
  if (hasPrefix) {
    const prefixInstance = header.getInstanceSwap('Prefix instance');
    if (!prefixInstance || prefixInstance.type === 'ERROR') {
      throw new Error('Missing Figma instance swap: Prefix instance');
    }

    // Set the slot property to ensure the slot attribute is rendered
    prefixInstance.properties.slot = { value: 'prefix' };

    prefix = prefixInstance?.executeTemplate().example;
  }

  let suffix;
  if (hasSuffix) {
    const suffixInstance = header.getInstanceSwap('Suffix instance');
    if (!suffixInstance || suffixInstance.type === 'ERROR') {
      throw new Error('Missing Figma instance swap: Suffix instance');
    }

    // Set the slot property to ensure the slot attribute is rendered
    suffixInstance.properties.slot = { value: 'suffix' };

    suffix = suffixInstance?.executeTemplate().example;
  }

  return figma.code`
    <sl-panel
      ${!border ? 'no-border' : ''}
      ${collapsible ? 'collapsible' : ''}
      ${collapsed ? 'collapsed' : ''}
      ${density !== 'default' ? `density="${density}"` : ''}
      ${divider ? 'divider' : ''}
      ${elevation !== 'none' ? `elevation="${elevation}"` : ''}
      ${heading?.textContent ? `heading="${heading.textContent}"` : ''}
      ${togglePlacement && togglePlacement !== 'start' ? `toggle-placement="${togglePlacement}"` : ''}
    >
      ${hasPrefix ? prefix : ''}
      ${hasSuffix ? suffix : ''}
      ${hasActions ? actions : ''}
    </sl-panel>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
