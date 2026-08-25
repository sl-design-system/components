export const dateListConverter = {
  fromAttribute: value => {
    const dates = value
      .split(',')
      .filter(dateStr => !isNaN(Date.parse(dateStr)))
      .map(dateStr => new Date(dateStr));
    return dates;
  },
  toAttribute: values => {
    const dates = values.filter(value => value instanceof Date).map(date => date.toISOString());
    return dates.join(',');
  }
};
//# sourceMappingURL=date-list.js.map
