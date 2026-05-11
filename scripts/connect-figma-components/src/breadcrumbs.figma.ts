// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7476-189273
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const inverted = instance.getBoolean('Inverted');

  const container = instance.findInstance(`SL-breadcrumb ${inverted ? 'inverted' : 'regular'}`);
  if (container.type === 'ERROR') return null;

  const homeBreadcrumb = container.findInstance('breadcrumb-home');
  if (homeBreadcrumb.type === 'ERROR') return null;

  const hideHomeLabel = !homeBreadcrumb.getBoolean('Show label');

  const crumbs = container
    .findConnectedInstances(node => node.codeConnectId() === 'breadcrumb')
    .map(child => child.executeTemplate().example)
    .flatMap(results => results.find(r => r.type === 'CODE'))
    .map(result => result?.code)
    .join('\n');

  return figma.code`
    <sl-breadcrumbs
      ${hideHomeLabel ? 'hide-home-label' : ''}
      ${inverted ? 'inverted' : ''}
    >
      ${crumbs}
    </sl-breadcrumbs>
  `;
}

export default {
  example: getExample(),
  id: 'breadcrumbs'
};
