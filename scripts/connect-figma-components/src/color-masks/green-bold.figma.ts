// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7377-4947
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

function getProps() {
  const color = 'green',
    emphasis = 'bold';

  return { color, emphasis };
}

export default {
  example: figma.code``,
  id: 'color-mask',
  metadata: {
    props: getProps()
  }
};
