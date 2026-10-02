// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7413-416778
import figma from 'figma';
import { checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const breadcrumbTitle = instance.findInstance('breadcrumb/title', { traverseInstances: true });

  let title;
  if (breadcrumbTitle.type === 'ERROR') {
    title = 'Replace me';
  } else {
    title = checkStringProperty(breadcrumbTitle.getString('Text'), 'Text');
  }

  return figma.code`
    <a href="#">${title}</a>
  `;
}

export default {
  example: getExample(),
  id: 'breadcrumb'
};
