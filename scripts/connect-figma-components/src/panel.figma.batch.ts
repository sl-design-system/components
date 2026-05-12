/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const collapsible = figma.batch.collapsible,
    border = instance.getBoolean('Border'),
    divider = instance.getBoolean('Divider'),
    elevationRaw = instance.getString('Elevation') || 'none',
    shadow = instance.getBoolean('Shadow');

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

  const header = collapsible
    ? instance.findInstance('sl-panel-header-collapsable')
    : instance.findInstance('sl-panel-header-default');
  if (header.type === 'ERROR') return null;

  const hasActions = collapsible ? false : header.getBoolean('Actions'),
    hasPrefix = header.getBoolean('Prefix'),
    hasSuffix = header.getBoolean('Suffix');

  const heading = header.findText('title');
  if (heading.type === 'ERROR') return null;

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
    if (!prefixInstance) return null;

    // Set the slot property to ensure the slot attribute is rendered
    prefixInstance.properties.slot = { value: 'prefix' };

    prefix = prefixInstance?.executeTemplate().example;
  }

  let suffix;
  if (hasSuffix) {
    const suffixInstance = header.getInstanceSwap('Suffix instance');
    if (!suffixInstance) return null;

    // Set the slot property to ensure the slot attribute is rendered
    suffixInstance.properties.slot = { value: 'suffix' };

    suffix = suffixInstance?.executeTemplate().example;
  }

  if (!collapsible) {
    const body = instance.findInstance('sl-base-panel-body');
    if (body.type === 'ERROR') return null;
  }

  return figma.code`
    <sl-panel
      ${border === false ? 'no-border' : ''}
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
