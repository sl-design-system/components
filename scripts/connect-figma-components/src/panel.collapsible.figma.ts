// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=3923-203981
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const border = instance.getBoolean('Border'),
    collapsed = instance.getString('State') === 'Collapsed',
    divider = instance.getBoolean('Divider'),
    elevationRaw = instance.getString('Elevation') || 'none',
    shadow = instance.getBoolean('Shadow');

  const togglePlacement =
    instance.getEnum('Toggle Position', {
      Start: 'start',
      End: 'end'
    }) ?? 'start';

  const density =
    instance.getEnum('Density', {
      Default: 'default',
      Relaxed: 'relaxed'
    }) ?? 'default';

  let elevation;
  if (elevationRaw === 'Raised' && shadow) {
    elevation = 'raised';
  } else if (elevationRaw === 'Sunken') {
    elevation = 'sunken';
  } else {
    elevation = 'none';
  }

  const header = instance.findInstance('sl-panel-header-collapsable');
  if (header.type === 'ERROR') return null;

  const hasPrefix = header.getBoolean('Prefix'),
    hasSuffix = header.getBoolean('Suffix');

  const heading = header.findText('title');
  if (heading.type === 'ERROR') return null;

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

  // const body = instance.findInstance('sl-base-panel-body');
  // if (body.type === 'ERROR') return null;

  return figma.code`
    <sl-panel
      ${border === false ? 'no-border' : ''}
      collapsible
      ${collapsed ? 'collapsed' : ''}
      ${density !== 'default' ? `density="${density}"` : ''}
      ${divider ? 'divider' : ''}
      ${elevation !== 'none' ? `elevation="${elevation}"` : ''}
      ${heading?.textContent ? `heading="${heading.textContent}"` : ''}
      ${togglePlacement !== 'start' ? `toggle-placement="${togglePlacement}"` : ''}
    >
      ${hasPrefix ? prefix : ''}
      ${hasSuffix ? suffix : ''}
    </sl-panel>
  `;
}

export default {
  example: getExample(),
  id: 'panel'
};
