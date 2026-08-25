const DurationFormat = Intl.DurationFormat;
const timeFormatCache = {},
  timeUnitCache = {};
export function getTimeFormat(locale, date) {
  const normalizedLocale = locale && locale !== 'default' ? locale : void 0;
  const cacheKey = locale;
  if (!date && timeFormatCache[cacheKey]) {
    return timeFormatCache[cacheKey];
  }
  const intlParts = new Intl.DateTimeFormat(normalizedLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date ?? /* @__PURE__ */ new Date());
  let index = 0;
  const parts = intlParts.map(part => {
    const start = index,
      end = index + part.value.length;
    index = end;
    return { ...part, start, end };
  });
  if (!date) {
    timeFormatCache[cacheKey] = parts;
  }
  return parts;
}
export function getTimeUnitName(locale, unit) {
  let name = unit;
  try {
    if (typeof DurationFormat === 'function') {
      const pluralUnit = `${unit}s`,
        df = new DurationFormat(locale, { style: 'long' }),
        part = df.formatToParts({ [pluralUnit]: 1 }).find(p => p.type === 'unit');
      name = part?.value ?? unit;
    }
  } catch {
    name = unit;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}
function getTimeUnitLetters(locale) {
  if (timeUnitCache[locale]) {
    return timeUnitCache[locale];
  }
  const units = {
    hours: getTimeUnitName(locale, 'hour').charAt(0),
    minutes: getTimeUnitName(locale, 'minute').charAt(0),
    seconds: getTimeUnitName(locale, 'second').charAt(0)
  };
  timeUnitCache[locale] = units;
  return units;
}
export function getTimeUnitLetter(locale, unit) {
  const units = getTimeUnitLetters(locale);
  return units[`${unit}s`] ?? unit.charAt(0).toUpperCase();
}
export function getTimeTemplate(locale) {
  const parts = getTimeFormat(locale),
    units = getTimeUnitLetters(locale);
  return parts
    .map(part => {
      switch (part.type) {
        case 'hour':
          return units.hours.repeat(part.value.length);
        case 'minute':
          return units.minutes.repeat(part.value.length);
        case 'second':
          return units.seconds.repeat(part.value.length);
        default:
          return part.value;
      }
    })
    .join('');
}
//# sourceMappingURL=utils.js.map
