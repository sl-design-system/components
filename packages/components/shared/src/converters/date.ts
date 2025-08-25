export const dateConverter = {
  fromAttribute: (value: string): Date | undefined => {
    const date = Date.parse(value);

    console.log(date);
    return isNaN(date) ? undefined : new Date(date);
  },
  toAttribute: (value: Date | undefined): string => {
    return value ? value.toISOString() : '';
  }
};
