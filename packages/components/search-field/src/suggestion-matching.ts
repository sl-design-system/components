/** Match phrases without case, diacritics or repeated whitespace, retaining display offsets. */
export function matchSuggestion(
  label: string,
  query: string
): { start: number; end: number; prefix: boolean; complete: boolean } | undefined {
  const fold = (value: string): string =>
    value
      .toLocaleLowerCase()
      .replace(/ς/g, 'σ')
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(
        /[łøæœßðþ]/g,
        letter => ({ ł: 'l', ø: 'o', æ: 'ae', œ: 'oe', ß: 'ss', ð: 'd', þ: 'th' })[letter]!
      );
  const starts: number[] = [],
    ends: number[] = [];
  let text = '';
  for (const { segment, index } of new Intl.Segmenter(undefined, {
    granularity: 'grapheme'
  }).segment(label)) {
    for (const character of fold(segment)) {
      if (/\s/u.test(character) && text.endsWith(' ')) {
        ends[ends.length - 1] = index + segment.length;
        continue;
      }
      text += /\s/u.test(character) ? ' ' : character;
      for (let offset = 0; offset < character.length; offset++) {
        starts.push(index);
        ends.push(index + segment.length);
      }
    }
  }
  const needle = fold(query).trim().replace(/\s+/gu, ' '),
    index = text.indexOf(needle);
  return needle && index >= 0
    ? {
        start: starts[index],
        end: ends[index + needle.length - 1],
        prefix: index === 0,
        complete: ends[index + needle.length - 1] !== ends[index + needle.length]
      }
    : undefined;
}
