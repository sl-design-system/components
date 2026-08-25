export const format = (date, locale = 'default', options) => {
  return Intl.DateTimeFormat(locale, options).format(date);
};
//# sourceMappingURL=format.js.map
