// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7413-416778
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const breadcrumbTitle = instance.findInstance('breadcrumb/title', { traverseInstances: true });

  let title;
  if (breadcrumbTitle.type === 'ERROR') {
    title = 'Replace me';
  } else {
    title = breadcrumbTitle.getString('Text');
  }

  return figma.code`
    <a href="#">${title}</a>
  `;
}

export default {
  example: getExample(),
  id: 'breadcrumb'
};
