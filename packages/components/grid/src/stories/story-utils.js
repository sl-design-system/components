import { html } from 'lit';
export const avatarRenderer = student => {
  const { firstName, infix, lastName, pictureUrl } = student;
  return html`
    <sl-avatar
      .displayName=${[firstName, infix, lastName].filter(Boolean).join(' ')}
      .pictureUrl=${pictureUrl}
      size="sm"></sl-avatar>
  `;
};
//# sourceMappingURL=story-utils.js.map
