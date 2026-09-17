// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=3671-300714
import figma from 'figma';
import { checkStringProperty } from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const size = checkStringProperty(instance.getString('Size'), 'Size'),
    sizes = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

  if (!sizes.includes(size)) {
    throw new Error(
      `Unsupported Figma Size value: ${size}. sl-spinner supports: ${sizes.join(', ')}`
    );
  }

  return figma.code`
    <sl-spinner
      ${size !== 'md' ? `size="${size}"` : ''}
    ></sl-spinner>
  `;
}

export default {
  example: getExample(),
  id: 'spinner'
};
