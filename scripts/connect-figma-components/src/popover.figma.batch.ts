// source=packages/components/popover/src/popover.ts
// component=Popover
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  return figma.code`
    <sl-popover></sl-popover>
  `;
}

export default {
  example: getExample(),
  id: figma.batch.id
};
