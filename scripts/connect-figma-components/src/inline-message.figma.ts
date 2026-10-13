// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=2050-275668
import figma from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const description = checkStringProperty(instance.getString('description'), 'description'),
    showTitle = checkBooleanProperty(instance.getBoolean('display-title'), 'display-title'),
    indismissible = !checkBooleanProperty(
      instance.getBoolean('display-close-button'),
      'display-close-button'
    ),
    title = checkStringProperty(instance.getString('title'), 'title'),
    variant = checkEnum(
      instance.getEnum('variant', {
        info: 'info',
        positive: 'success',
        caution: 'warning',
        negative: 'danger'
      }) ?? 'info'
    );

  return figma.code`
    <sl-inline-message
      ${indismissible ? 'indismissible' : ''}
      ${variant !== 'info' ? `variant="${variant}"` : ''}
    >
      ${showTitle ? `<h2 slot="title">${title}</h2>` : ''}
      ${description}
    </sl-inline-message>
  `;
}

export default {
  example: getExample(),
  id: 'inline-message'
};
