// source=packages/components/breadcrumbs/src/breadcrumbs.ts
// component=Breadcrumbs
import figma from 'figma';
import { type InstanceHandle, checkBooleanProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const inverted = checkBooleanProperty(instance.getBoolean('Inverted'), 'Inverted');

  const container = instance.findInstance(
    `SL-breadcrumb ${inverted ? 'inverted' : 'regular'}`
  ) as InstanceHandle;

  const homeBreadcrumb = (
    inverted ? container.findInstance('breadcrumb-home') : container.findInstance('breadcrumb/home')
  ) as InstanceHandle;

  const hideHomeLabel = !checkBooleanProperty(
    homeBreadcrumb.getBoolean('Show label'),
    'Show label'
  );

  const crumbs = container
    .findConnectedInstances(
      node => node.type === 'INSTANCE' && node.codeConnectId() === 'breadcrumb'
    )
    .filter(child => child.type === 'INSTANCE')
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
  id: figma.batch.id
};
