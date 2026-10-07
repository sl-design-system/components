// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7476-189273
import figma from 'figma';
import { checkBooleanProperty, checkInstance } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const inverted = checkBooleanProperty(instance.getBoolean('Inverted'), 'Inverted');

  const container = checkInstance(
    instance.findInstance(`SL-breadcrumb ${inverted ? 'inverted' : 'regular'}`),
    `SL-breadcrumb ${inverted ? 'inverted' : 'regular'}`
  );

  const homeBreadcrumb = checkInstance(
    container.findInstance('breadcrumb-home'),
    'breadcrumb-home'
  );

  const hideHomeLabel = !checkBooleanProperty(
    homeBreadcrumb.getBoolean('Show label'),
    'Show label'
  );

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
