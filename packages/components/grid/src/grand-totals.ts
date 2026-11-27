/** The kind of data the grand totals are calculated for. */
export type GridGrandTotalsType = 'number' | 'text' | 'boolean';

/** The format in which a total is displayed. Formats only change the display, not the totals. */
export type GridGrandTotalsFormat = 'sum' | 'average' | 'count' | 'fraction' | 'percentage';

/** Where the grand totals row is displayed. */
export type GridGrandTotalsPosition = 'top' | 'bottom';

/** Which rows the totals are calculated for: all rows matching the filters, or the current page. */
export type GridGrandTotalsScope = 'all' | 'page';

/**
 * The raw totals for a single column. These are independent of the display format, so changing the
 * format never requires recalculating (or fetching) the totals.
 */
export interface GridGrandTotals {
  /** The number of values that could be evaluated as a number (numeric columns). */
  evaluated: number;

  /** The number of non-empty values (text columns). */
  nonEmpty: number;

  /** The sum of all values that could be evaluated as a number. */
  sum: number;

  /** The total number of records, used as denominator for fractions and percentages. */
  totalRecords: number;

  /** The number of values that are `true` (boolean columns). */
  trueCount: number;
}

const FORMATS: Record<GridGrandTotalsType, GridGrandTotalsFormat[]> = {
  boolean: ['fraction', 'count', 'percentage'],
  number: ['sum', 'average'],
  text: ['count']
};

/** Returns the formats that are available for the given grand totals type. */
export function getGrandTotalsFormats(type: GridGrandTotalsType): GridGrandTotalsFormat[] {
  return [...FORMATS[type]];
}

/** Returns the default format for the given grand totals type. */
export function getDefaultGrandTotalsFormat(type: GridGrandTotalsType): GridGrandTotalsFormat {
  return FORMATS[type][0];
}

/**
 * Returns the format to use: the requested one if it is available for the type, otherwise the
 * default format for the type.
 */
export function resolveGrandTotalsFormat(
  type: GridGrandTotalsType,
  format?: GridGrandTotalsFormat
): GridGrandTotalsFormat {
  return format && FORMATS[type].includes(format) ? format : getDefaultGrandTotalsFormat(type);
}

/** Returns the numeric value, or `undefined` if the value cannot be evaluated as a number. */
function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function isEmpty(value: unknown): boolean {
  return (
    value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
  );
}

/**
 * Calculates the raw totals for the given values. Empty, invalid or mixed-type values are excluded
 * from the evaluation in the same way for all formats. The `totalRecords` always counts all
 * records, so fractions and percentages keep the same denominator.
 */
export function calculateGrandTotals(values: unknown[]): GridGrandTotals {
  const totals: GridGrandTotals = {
    evaluated: 0,
    nonEmpty: 0,
    sum: 0,
    totalRecords: values.length,
    trueCount: 0
  };

  for (const value of values) {
    const numeric = toNumber(value);

    if (numeric !== undefined) {
      totals.evaluated++;
      totals.sum += numeric;
    }

    if (!isEmpty(value)) {
      totals.nonEmpty++;
    }

    if (value === true) {
      totals.trueCount++;
    }
  }

  return totals;
}

/**
 * Formats the totals for display. Returns `'-'` when the total does not apply for the type and
 * format, or when there is nothing to evaluate.
 */
export function formatGrandTotals(
  totals: GridGrandTotals | undefined,
  type: GridGrandTotalsType,
  format?: GridGrandTotalsFormat,
  locale?: string
): string {
  if (!totals) {
    return '-';
  }

  const resolved = resolveGrandTotalsFormat(type, format),
    number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });

  switch (resolved) {
    case 'sum':
      return totals.evaluated ? number.format(totals.sum) : '-';
    case 'average':
      return totals.evaluated ? number.format(totals.sum / totals.evaluated) : '-';
    case 'count':
      return number.format(type === 'boolean' ? totals.trueCount : totals.nonEmpty);
    case 'fraction':
      return totals.totalRecords
        ? `${number.format(totals.trueCount)} / ${number.format(totals.totalRecords)}`
        : '-';
    case 'percentage':
      return totals.totalRecords
        ? new Intl.NumberFormat(locale, {
            maximumFractionDigits: 0,
            style: 'percent'
          }).format(totals.trueCount / totals.totalRecords)
        : '-';
  }
}
