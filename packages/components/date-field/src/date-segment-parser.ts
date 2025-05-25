/**
 * Interface defining a date segment (day, month, year) with its position and constraints.
 */
export interface DateSegment {
  /** The type of segment */
  type: 'day' | 'month' | 'year';
  /** The current numeric value */
  value: number;
  /** The minimum allowed value */
  min: number;
  /** The maximum allowed value */
  max: number;
  /** The position of this segment in the formatted string */
  position: { start: number; end: number };
  /** The display value as it appears in the input */
  displayValue: string;
}

/**
 * Class for parsing formatted date strings into navigable segments.
 * Supports various date formats based on Intl.DateTimeFormat.
 */
export class DateSegmentParser {
  #formatter: Intl.DateTimeFormat;

  constructor(locale: string = 'en-US', options: Intl.DateTimeFormatOptions = {}) {
    this.#formatter = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      ...options
    });
  }

  /**
   * Parse a date into segments based on the current formatter.
   */
  parseDate(date: Date): DateSegment[] {
    const parts = this.#formatter.formatToParts(date);

    let position = 0;
    const segments: DateSegment[] = [];

    for (const part of parts) {
      const startPos = position;
      const endPos = position + part.value.length;

      if (part.type === 'day' || part.type === 'month' || part.type === 'year') {
        const numericValue = parseInt(part.value, 10);
        const segment: DateSegment = {
          type: part.type,
          value: numericValue,
          min: this.#getMinValue(part.type, date),
          max: this.#getMaxValue(part.type, date),
          position: { start: startPos, end: endPos },
          displayValue: part.value
        };
        segments.push(segment);
      }

      position = endPos;
    }

    return segments;
  }

  /**
   * Parse a formatted string back into segments, if possible.
   */
  parseFormattedString(formattedString: string, referenceDate?: Date): DateSegment[] {
    // Use current date as reference if none provided
    const ref = referenceDate || new Date();

    try {
      // Try to extract numbers from the formatted string
      const parts = this.#formatter.formatToParts(ref);
      const segments: DateSegment[] = [];
      let position = 0;

      // Find numeric values in the string at expected positions
      for (const part of parts) {
        if (part.type === 'day' || part.type === 'month' || part.type === 'year') {
          const startPos = position;
          const endPos = this.#findSegmentEnd(formattedString, startPos);

          if (endPos > startPos) {
            const segmentText = formattedString.substring(startPos, endPos);
            const numericValue = parseInt(segmentText, 10);

            if (!isNaN(numericValue)) {
              const testDate = this.#createTestDate(part.type, numericValue, ref);
              const segment: DateSegment = {
                type: part.type,
                value: numericValue,
                min: this.#getMinValue(part.type, testDate),
                max: this.#getMaxValue(part.type, testDate),
                position: { start: startPos, end: endPos },
                displayValue: segmentText
              };
              segments.push(segment);
            }
          }
        }

        position = this.#findNextPosition(formattedString, position, part.value);
      }

      return segments;
    } catch {
      // If parsing fails, return empty array
      return [];
    }
  }

  /**
   * Get the formatted string for a complete date.
   */
  format(date: Date): string {
    return this.#formatter.format(date);
  }

  /**
   * Create a new date by updating a specific segment.
   * Phase 3: Enhanced with better validation and edge case handling.
   */
  updateSegment(currentDate: Date, segmentType: 'day' | 'month' | 'year', newValue: number): Date {
    const newDate = new Date(currentDate);

    // Phase 3 Enhancement: Validate input bounds first
    const minValue = this.#getMinValue(segmentType, currentDate);
    const maxValue = this.#getMaxValue(segmentType, currentDate);

    if (newValue < minValue || newValue > maxValue) {
      // Return original date if value is out of bounds
      return currentDate;
    }

    switch (segmentType) {
      case 'day': {
        // Phase 3: Handle month boundary cases
        const originalMonth = newDate.getMonth();
        newDate.setDate(newValue);

        // Check if setting the day caused the month to change (invalid day)
        if (newDate.getMonth() !== originalMonth) {
          // The day was invalid for this month (e.g., Feb 30)
          // Reset to last valid day of the original month
          newDate.setMonth(originalMonth + 1, 0); // Last day of original month
        }
        break;
      }
      case 'month': {
        // Phase 3: Handle month changes with day validation
        const originalDay = newDate.getDate();
        newDate.setMonth(newValue - 1); // Month is 0-based

        // Check if the day is still valid in the new month
        const lastDayOfNewMonth = new Date(newDate.getFullYear(), newValue, 0).getDate();
        if (originalDay > lastDayOfNewMonth) {
          // Adjust to the last valid day of the new month
          newDate.setDate(lastDayOfNewMonth);
        }
        break;
      }
      case 'year': {
        // Phase 3: Handle leap year transitions
        const originalMonth = newDate.getMonth();
        const originalDay = newDate.getDate();
        newDate.setFullYear(newValue);

        // Special case: Feb 29 in non-leap year
        if (originalMonth === 1 && originalDay === 29) {
          const isLeapYear = (newValue % 4 === 0 && newValue % 100 !== 0) || newValue % 400 === 0;
          if (!isLeapYear) {
            // Change Feb 29 to Feb 28 in non-leap year
            newDate.setDate(28);
          }
        }
        break;
      }
    }

    // Phase 3: Final validation - ensure we have a valid date
    if (isNaN(newDate.getTime())) {
      return currentDate;
    }

    return newDate;
  }

  /**
   * Get minimum value for a segment type.
   */
  #getMinValue(type: 'day' | 'month' | 'year', _date: Date): number {
    switch (type) {
      case 'day':
        return 1;
      case 'month':
        return 1;
      case 'year':
        return 1900; // Reasonable minimum year
      default:
        return 1;
    }
  }

  /**
   * Get maximum value for a segment type.
   */
  #getMaxValue(type: 'day' | 'month' | 'year', date: Date): number {
    switch (type) {
      case 'day':
        // Get the last day of the current month
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      case 'month':
        return 12;
      case 'year':
        return new Date().getFullYear() + 100; // Reasonable maximum year
      default:
        return 1;
    }
  }

  /**
   * Find the end position of a numeric segment.
   */
  #findSegmentEnd(text: string, start: number): number {
    let end = start;
    while (end < text.length && /\d/.test(text[end])) {
      end++;
    }
    return end;
  }

  /**
   * Find the next position after a separator.
   */
  #findNextPosition(text: string, currentPos: number, expectedPart: string): number {
    if (expectedPart.match(/\d/)) {
      // For numeric parts, find the end of the number
      return this.#findSegmentEnd(text, currentPos);
    } else {
      // For separators, move past them
      return currentPos + expectedPart.length;
    }
  }

  /**
   * Create a test date with a specific segment value for validation.
   */
  #createTestDate(segmentType: 'day' | 'month' | 'year', value: number, referenceDate: Date): Date {
    const testDate = new Date(referenceDate);

    switch (segmentType) {
      case 'day':
        testDate.setDate(value);
        break;
      case 'month':
        testDate.setMonth(value - 1);
        break;
      case 'year':
        testDate.setFullYear(value);
        break;
    }

    return testDate;
  }
}
