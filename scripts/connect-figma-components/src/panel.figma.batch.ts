// source=packages/components/panel/src/panel.ts
// component=Panel
import figma from 'figma';
import {
  type InstanceHandle,
  type TextHandle,
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const collapsible = figma.batch.collapsible,
    border = checkBooleanProperty(instance.getBoolean('display-border'), 'display-border'),
    divider = checkBooleanProperty(instance.getBoolean('display-divider'), 'display-divider'),
    elevationRaw = checkEnum(
      instance.getEnum('elevation', { None: 'none', Raised: 'raised', Sunken: 'sunken' }) ?? 'none'
    ),
    shadow = checkBooleanProperty(instance.getBoolean('display-shadow'), 'display-shadow');

  const density = checkEnum(
    instance.getEnum('density', {
      Default: 'default',
      Relaxed: 'relaxed'
    }) ?? 'default'
  );

  const togglePlacement = collapsible
    ? checkEnum(instance.getEnum('toggle-placement', { Start: 'start', End: 'end' }) ?? 'start')
    : undefined;

  const collapsed = collapsible
    ? checkStringProperty(instance.getString('state'), 'state') === 'Collapsed'
    : false;

  let elevation;
  if (elevationRaw === 'Raised' && shadow) {
    elevation = 'raised';
  } else if (elevationRaw === 'Sunken') {
    elevation = 'sunken';
  } else {
    elevation = 'none';
  }

  const header = (
    collapsible
      ? instance.findInstance('sl-panel-header-collapsable')
      : instance.findInstance('sl-panel-header-default')
  ) as InstanceHandle;

  const hasActions = collapsible
      ? false
      : checkBooleanProperty(header.getBoolean('actions'), 'actions'),
    hasPrefix = checkBooleanProperty(header.getBoolean('prefix'), 'prefix'),
    hasSuffix = checkBooleanProperty(header.getBoolean('suffix'), 'suffix');

  const heading = header.findText('title') as TextHandle;

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
    const prefixInstance = header.getInstanceSwap('prefix');
    if (!prefixInstance || prefixInstance.type === 'ERROR') {
      throw new Error('Missing Figma instance swap: prefix');
    }

    // Set the slot property to ensure the slot attribute is rendered
    prefixInstance.properties.slot = { value: 'prefix' };

    prefix = prefixInstance?.executeTemplate().example;
  }

  let suffix;
  if (hasSuffix) {
    const suffixInstance = header.getInstanceSwap('suffix');
    if (!suffixInstance || suffixInstance.type === 'ERROR') {
      throw new Error('Missing Figma instance swap: suffix');
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
