// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7401-934
import figma, { type InstanceHandle } from 'figma';
import {
  checkBooleanProperty,
  checkEnum,
  checkStringProperty
} from './_shared/figma-assertions.js';

const instance = figma.selectedInstance;

function getExample() {
  const colorInstance = instance.getInstanceSwap('emphasis'),
    { color = 'grey', emphasis = 'subtle' } =
      colorInstance?.executeTemplate().metadata?.props ?? {};

  const initials = checkStringProperty(instance.getString('initials'), 'initials'),
    showInitials =
      checkEnum(
        instance.getEnum('display-initials', { True: 'true', False: 'false' }) ?? 'false'
      ) === 'true',
    showName = checkBooleanProperty(instance.getBoolean('display-name'), 'display-name'),
    imageOnly = !showName,
    headerPosition = checkStringProperty(instance.getString('header-position'), 'header-position'),
    vertical = headerPosition === 'Under';

  const shape = checkEnum(
    instance.getEnum('shape', { Circle: 'circle', Square: 'square' }) ?? 'circle'
  );

  const size = checkEnum(
    instance.getEnum('size', {
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
      XL: 'xl',
      '2XL': '2xl',
      '3XL': '3xl',
      '4XL': '4xl'
    }) ?? 'md'
  );

  const header = instance.findInstance('avatar-header') as InstanceHandle;

  const displayName = checkStringProperty(header.getString('display-name'), 'display-name'),
    subheading = checkStringProperty(header.getString('subheading'), 'subheading'),
    showSubheading = checkBooleanProperty(header.getBoolean('show subheading'), 'show subheading');

  const hasBadge = checkBooleanProperty(instance.getBoolean('badge'), 'badge');

  let badgeColor, badgeEmphasis, badgeText;
  if (hasBadge) {
    const badgeMetadata = instance.getInstanceSwap('badge-color')?.executeTemplate().metadata;

    badgeColor = (badgeMetadata?.props?.color as string) ?? 'grey';
    badgeEmphasis = (badgeMetadata?.props?.emphasis as string) ?? 'subtle';
    badgeText = checkStringProperty(instance.getString('badge-label'), 'badge-label');
  }

  return figma.code`
    <sl-avatar
      ${color !== 'grey' ? `color="${color as string}"` : ''}
      ${emphasis !== 'subtle' ? `emphasis="${emphasis as string}"` : ''}
      ${imageOnly ? 'image-only' : ''}
      ${showName && displayName ? `display-name="${displayName}"` : ''}
      ${showInitials && initials ? `display-initials="${initials}"` : ''}
      ${shape !== 'circle' ? `shape="${shape}"` : ''}
      ${size !== 'md' ? `size="${size}"` : ''}
      ${vertical ? 'vertical' : ''}
    >
      ${showSubheading ? subheading : ''}
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
