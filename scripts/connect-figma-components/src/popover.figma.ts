// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=2888-98096
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  return figma.code`
    <sl-popover></sl-popover>
  `;
}

export default {
  example: getExample(),
  id: 'popover'
};
