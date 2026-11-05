// source=packages/components/grid/src/grid.ts
// component=Grid
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  return figma.code`
    <sl-grid></sl-grid>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
