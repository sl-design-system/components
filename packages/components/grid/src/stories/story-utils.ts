import { type Student } from '@sl-design-system/example-data';
import { html } from 'lit';
import { type GridColumnDataRenderer } from '../column.js';

export const avatarRenderer: GridColumnDataRenderer<Student> = (student: Student) => {
  const { firstName, infix, lastName, pictureUrl } = student;

  return html`
    <sl-avatar
      .displayName=${[firstName, infix, lastName].filter(Boolean).join(' ')}
      .pictureUrl=${pictureUrl}
      size="sm"
    ></sl-avatar>
  `;
};
