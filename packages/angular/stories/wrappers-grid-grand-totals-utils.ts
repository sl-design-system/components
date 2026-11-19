export interface Pupil {
  class: string;
  grade: number;
  homework: boolean;
  id: number;
  name: string;
  passed: boolean;
  present: boolean;
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

/** Deterministic example data, so the totals in the stories are stable. */
export const pupils: Pupil[] = Array.from({ length: 33 }, (_, index) => ({
  class: index % 3 === 0 ? 'F5AB' : 'F3CB',
  grade: 3 + ((index * 7) % 8) + (index % 2) / 2,
  homework: index % 3 !== 0,
  id: index + 1,
  name: `${pupilNames[index % pupilNames.length]}${
    index >= pupilNames.length ? ` ${Math.floor(index / pupilNames.length) + 1}` : ''
  }`,
  passed: 3 + ((index * 7) % 8) >= 6,
  present: index % 5 !== 0
}));

/** Returns a column renderer that shows "Yes" or "No" for a boolean property of a pupil. */
export const yesNo =
  (key: 'homework' | 'passed' | 'present') =>
  (pupil: Pupil): string =>
    pupil[key] ? 'Yes' : 'No';

/** Grand totals text with the number of distinct classes, for example "2 classes". */
export const classesGrandTotals = (rows: Pupil[]): string => {
  const count = new Set(rows.map(row => row.class)).size;

  return `${count} ${count === 1 ? 'class' : 'classes'}`;
};
