export const dateConverter = {
  fromAttribute: value => {
    const date = Date.parse(value);
    return isNaN(date) ? void 0 : new Date(date);
  },
  toAttribute: value => {
    return value ? value.toISOString() : '';
  }
};
//# sourceMappingURL=date.js.map
