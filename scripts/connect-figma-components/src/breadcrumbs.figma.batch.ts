// source=packages/components/breadcrumbs/src/breadcrumbs.ts
// component=Breadcrumbs
import figma from 'figma';
import { type InstanceHandle, checkBooleanProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const inverted = checkBooleanProperty(instance.getBoolean('Inverted'), 'Inverted');

  const container = instance.findInstance(`SL-breadcrumb ${inverted ? 'inverted' : 'regular'}`);
  if (container.type !== 'INSTANCE') throw new Error('Missing breadcrumb container instance');

  const homeBreadcrumb = container.findInstance('breadcrumb/home');
  if (homeBreadcrumb.type !== 'INSTANCE') throw new Error('Missing home breadcrumb instance');

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
