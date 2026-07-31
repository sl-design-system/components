// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=4584-599514
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  return figma.code`
    <sl-grid></sl-grid>
  `;
}

export default {
  example: getExample(),
  id: 'grid'
};
