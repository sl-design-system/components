// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=10995-110181
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const density =
    instance.getEnum('Density', {
      Default: 'default',
      Relaxed: 'relaxed'
    }) ?? 'default';

  const description = instance.getString('Description'),
    title = instance.getString('Title'),
    variant = instance.getString('variant') ?? 'info';

  const swapSlot = instance.getInstanceSwap('Swap Slot');

  let slotted;
  if (swapSlot) {
    slotted = swapSlot.executeTemplate().example;
  }

  return figma.code`
    <sl-callout
      ${density !== 'default' ? `density="${density}"` : ''}
      ${variant !== 'info' ? `variant="${variant}"` : ''}
    >
      ${title ? `<h1 slot="title">${title}</h1>` : ''}
      ${description ? `<p>${description}</p>` : ''}
      ${slotted}
    </sl-callout>
  `;
}

export default {
  example: getExample(),
  id: 'callout'
};
