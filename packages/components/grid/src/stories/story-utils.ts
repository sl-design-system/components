import { type Student } from '@sl-design-system/example-data';
import { html } from 'lit';
import { type GridColumnDataRenderer } from '../column.js';

export const avatarRenderer: GridColumnDataRenderer<Student> = (student: Student) => {
  const { firstName, infix, lastName, pictureUrl } = student;

  return html`
    <sl-avatar
      .displayName=${[firstName, infix, lastName].filter(Boolean).join(' ')}
      .pictureUrl=${pictureUrl}
      size="sm"></sl-avatar>
  `;
};

export interface Pupil {
  id: number;
  name: string;
  class: string;
  grade: number;
  homework: boolean;
  present: boolean;
  passed: boolean;
}

const pupilNames = [
  'Gert Flits',
  'René Top',
  'Anna Bos',
  'Mila de Vries',
  'Daan Jansen',
  'Sophie Visser',
  'Lucas Smit',
  'Emma Meijer',
  'Finn Mulder',
  'Julia Bakker',
  'Sem Dekker'
];

/** Deterministic example data, so the totals in the stories (and snapshots) are stable. */
export const pupils: Pupil[] = Array.from({ length: 33 }, (_, index) => ({
  id: index + 1,
  name: `${pupilNames[index % pupilNames.length]}${index >= pupilNames.length ? ` ${Math.floor(index / pupilNames.length) + 1}` : ''}`,
  class: index % 3 === 0 ? 'F5AB' : 'F3CB',
  grade: 3 + ((index * 7) % 8) + (index % 2) / 2,
  homework: index % 3 !== 0,
  present: index % 5 !== 0,
  passed: 3 + ((index * 7) % 8) >= 6
}));
