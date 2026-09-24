// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7401-934
import figma from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkInstance,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const colorInstance = instance.getInstanceSwap('Color'),
    { color = 'grey', emphasis = 'subtle' } =
      colorInstance?.executeTemplate().metadata?.props ?? {};

  const initials = checkStringProperty(instance.getString('Initals'), 'Initals'),
    headerPosition = checkStringProperty(instance.getString('Header position'), 'Header position'),
    vertical = headerPosition === 'Under';

  const shape = checkEnum(
    instance.getEnum('Shape', { Circle: 'circle', Square: 'square' }) ?? 'circle'
  );

  const size = checkEnum(
    instance.getEnum('Size', {
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
      XL: 'xl',
      '2XL': '2xl',
      '3XL': '3xl',
      '4XL': '4xl'
    }) ?? 'md'
  );

  const header = checkInstance(instance.findInstance('avatar-header'), 'avatar-header');

  const heading = checkStringProperty(header.getString('Header'), 'Header'),
    subheading = checkStringProperty(header.getString('Subheader'), 'Subheader');

  const hasBadge = checkBooleanProperty(instance.getBoolean('Badge'), 'Badge');

  let badgeColor, badgeEmphasis, badgeText;
  if (hasBadge) {
    const badgeMetadata = instance.getInstanceSwap('Badge color')?.executeTemplate().metadata;

    badgeColor = (badgeMetadata?.props?.color as string) ?? 'grey';
    badgeEmphasis = (badgeMetadata?.props?.emphasis as string) ?? 'subtle';
    badgeText = checkStringProperty(instance.getString('Badge Label'), 'Badge Label');
  }

  return figma.code`
    <sl-avatar
      ${color !== 'grey' ? `color="${color as string}"` : ''}
      ${emphasis !== 'subtle' ? `emphasis="${emphasis as string}"` : ''}
      ${heading ? `display-name="${heading}"` : ''}
      ${initials ? `display-initials="${initials}"` : ''}
      ${shape !== 'circle' ? `shape="${shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
      ${vertical ? 'vertical' : ''}
    >
      ${subheading}
      ${
        hasBadge
          ? `
          <sl-badge
            ${badgeColor !== 'grey' ? `color="${badgeColor}"` : ''}
            ${badgeEmphasis !== 'subtle' ? `emphasis="${badgeEmphasis}"` : ''}
            slot="badge"
          >
            ${badgeText}
          </sl-badge>`
          : ''
      }
    </sl-avatar>
  `;
}

export default {
  example: getExample(),
  id: 'avatar'
};
