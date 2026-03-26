export const dateListConverter = {
  fromAttribute: (value: string): Array<Date | undefined> => {
    const dates = value
      .split(',')
      .filter(dateStr => !isNaN(Date.parse(dateStr)))
      .map(dateStr => new Date(dateStr));
    return dates;
  },
  toAttribute: (values: Array<Date | undefined>): string => {
    const dates = values.filter(value => value instanceof Date).map(date => date.toISOString());
    return dates.join(',');
  }
};
