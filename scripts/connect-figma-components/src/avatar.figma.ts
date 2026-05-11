// url=https://www.figma.com/design/CHpKrPIdXdbV2u7X8vizKI/Components-2.0?node-id=7401-934
/// <reference types="@figma/code-connect/figma-types" />
import figma from 'figma';

const instance = figma.selectedInstance;

function getExample() {
  const colorInstance = instance.getInstanceSwap('Color'),
    { color = 'grey', emphasis = 'subtle' } =
      colorInstance?.executeTemplate().metadata?.props ?? {};

  const initials = instance.getString('Initals'),
    vertical = instance.getString('Header position') === 'Under';

  const shape = instance.getEnum('Shape', { Circle: 'circle', Square: 'square' }) ?? 'circle';

  const size =
    instance.getEnum('Size', {
      SM: 'sm',
      MD: 'md',
      LG: 'lg',
      XL: 'xl',
      '2XL': '2xl',
      '3XL': '3xl',
      '4XL': '4xl'
    }) ?? 'md';

  const header = instance.findInstance('avatar-header');
  if (header.type === 'ERROR') return null;

  const heading = header.getString('Header'),
    subheading = header.getString('Subheader');

  const hasBadge = instance.getBoolean('Badge');

  let badgeColor, badgeEmphasis, badgeText;
  if (hasBadge) {
    const badgeMetadata = instance.getInstanceSwap('Badge color')?.executeTemplate().metadata;

    badgeColor = (badgeMetadata?.props?.color as string) ?? 'grey';
    badgeEmphasis = (badgeMetadata?.props?.emphasis as string) ?? 'subtle';
    badgeText = instance.getString('Badge Label');
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
