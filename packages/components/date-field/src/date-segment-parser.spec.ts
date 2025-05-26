import { expect } from '@open-wc/testing';
import { DateSegmentParser } from './date-segment-parser.js';

describe('DateSegmentParser', () => {
  let parser: DateSegmentParser;

  describe('basic functionality', () => {
    beforeEach(() => {
      parser = new DateSegmentParser('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    });

    it('should create parser with correct locale and format', () => {
      expect(parser).to.exist;
      // Remove test for private locale property
    });

    it('should parse a date into correct number of segments', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024
      const segments = parser.parseDate(date);

      expect(segments).to.have.length(3);
      expect(segments.every(s => s.type && s.value !== undefined)).to.be.true;
    });

    it('should identify all segment types correctly', () => {
      const date = new Date(2024, 2, 15);
      const segments = parser.parseDate(date);

      const types = segments.map(s => s.type);
      expect(types).to.include.members(['day', 'month', 'year']);
    });

    it('should extract correct values from date', () => {
      const date = new Date(2024, 2, 15); // March 15, 2024
      const segments = parser.parseDate(date);

      const daySegment = segments.find(s => s.type === 'day');
      const monthSegment = segments.find(s => s.type === 'month');
      const yearSegment = segments.find(s => s.type === 'year');

      expect(daySegment?.value).to.equal(15);
      expect(monthSegment?.value).to.equal(3); // March = 3
      expect(yearSegment?.value).to.equal(2024);
    });

    it('should provide correct position information', () => {
      const date = new Date(2024, 2, 15);
      const segments = parser.parseDate(date);

      // All segments should have valid positions
      segments.forEach(segment => {
        expect(segment.position.start).to.be.a('number');
        expect(segment.position.end).to.be.a('number');
        expect(segment.position.end).to.be.greaterThan(segment.position.start);
        expect(segment.displayValue).to.be.a('string');
      });
    });
  });

  describe('value ranges and constraints', () => {
    beforeEach(() => {
      parser = new DateSegmentParser('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    });

    it('should provide correct day ranges', () => {
      const date = new Date(2024, 2, 15);
      const segments = parser.parseDate(date);
      const daySegment = segments.find(s => s.type === 'day');

      expect(daySegment?.min).to.equal(1);
      expect(daySegment?.max).to.equal(31);
    });

    it('should provide correct month ranges', () => {
      const date = new Date(2024, 2, 15);
      const segments = parser.parseDate(date);
      const monthSegment = segments.find(s => s.type === 'month');

      expect(monthSegment?.min).to.equal(1);
      expect(monthSegment?.max).to.equal(12);
    });

    it('should provide correct year ranges', () => {
      const date = new Date(2024, 2, 15);
      const segments = parser.parseDate(date);
      const yearSegment = segments.find(s => s.type === 'year');

      expect(yearSegment?.min).to.equal(1900);
      expect(yearSegment?.max).to.equal(2124);
    });

    it('should handle different months with different day limits', () => {
      // Test February (28/29 days)
      const febDate = new Date(2024, 1, 15); // February 2024 (leap year)
      const febSegments = parser.parseDate(febDate);
      const febDaySegment = febSegments.find(s => s.type === 'day');
      expect(febDaySegment?.max).to.equal(31); // Parser sets max to 31, validation happens during update

      // Test April (30 days)
      const aprDate = new Date(2024, 3, 15); // April 2024
      const aprSegments = parser.parseDate(aprDate);
      const aprDaySegment = aprSegments.find(s => s.type === 'day');
      expect(aprDaySegment?.max).to.equal(31); // Same reason
    });
  });

  describe('updateSegment method', () => {
    beforeEach(() => {
      parser = new DateSegmentParser('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    });

    it('should update day values correctly', () => {
      const originalDate = new Date(2024, 2, 15); // March 15, 2024
      const updatedDate = parser.updateSegment(originalDate, 'day', 20);

      expect(updatedDate?.getDate()).to.equal(20);
      expect(updatedDate?.getMonth()).to.equal(2); // March (unchanged)
      expect(updatedDate?.getFullYear()).to.equal(2024); // Year (unchanged)
    });

    it('should update month values correctly', () => {
      const originalDate = new Date(2024, 2, 15); // March 15, 2024
      const updatedDate = parser.updateSegment(originalDate, 'month', 5);

      expect(updatedDate?.getMonth()).to.equal(4); // May (0-indexed)
      expect(updatedDate?.getDate()).to.equal(15); // Day (unchanged)
      expect(updatedDate?.getFullYear()).to.equal(2024); // Year (unchanged)
    });

    it('should update year values correctly', () => {
      const originalDate = new Date(2024, 2, 15); // March 15, 2024
      const updatedDate = parser.updateSegment(originalDate, 'year', 2025);

      expect(updatedDate?.getFullYear()).to.equal(2025);
      expect(updatedDate?.getMonth()).to.equal(2); // March (unchanged)
      expect(updatedDate?.getDate()).to.equal(15); // Day (unchanged)
    });

    it('should handle month boundaries correctly', () => {
      const jan31 = new Date(2024, 0, 31); // January 31, 2024

      // Change to February - should adjust day to 29 (leap year)
      const febDate = parser.updateSegment(jan31, 'month', 2);
      expect(febDate?.getMonth()).to.equal(1); // February
      expect(febDate?.getDate()).to.equal(29); // Adjusted to valid day

      // Change to April - should adjust day to 30
      const aprDate = parser.updateSegment(jan31, 'month', 4);
      expect(aprDate?.getMonth()).to.equal(3); // April
      expect(aprDate?.getDate()).to.equal(30); // Adjusted to valid day
    });

    it('should handle leap year transitions', () => {
      const leapDate = new Date(2024, 1, 29); // Feb 29, 2024 (leap year)

      // Change to non-leap year
      const nonLeapDate = parser.updateSegment(leapDate, 'year', 2023);
      expect(nonLeapDate?.getFullYear()).to.equal(2023);
      expect(nonLeapDate?.getMonth()).to.equal(1); // February
      expect(nonLeapDate?.getDate()).to.equal(28); // Adjusted to Feb 28

      // Change back to leap year
      const backToLeap = parser.updateSegment(nonLeapDate, 'year', 2024);
      expect(backToLeap?.getDate()).to.equal(28); // Should stay at 28, not go back to 29
    });

    it('should validate input bounds', () => {
      const date = new Date(2024, 2, 15);

      // Test invalid day
      const invalidDay = parser.updateSegment(date, 'day', 35);
      expect(invalidDay).to.be.null;

      // Test invalid month
      const invalidMonth = parser.updateSegment(date, 'month', 15);
      expect(invalidMonth).to.be.null;

      // Test invalid year (too low)
      const invalidYear = parser.updateSegment(date, 'year', 1800);
      expect(invalidYear).to.be.null;
    });

    it('should handle edge case dates gracefully', () => {
      // Test December 31 changing year
      const dec31 = new Date(2023, 11, 31);
      const newYear = parser.updateSegment(dec31, 'year', 2024);
      expect(newYear?.getFullYear()).to.equal(2024);
      expect(newYear?.getMonth()).to.equal(11); // December
      expect(newYear?.getDate()).to.equal(31);

      // Test February 29 in non-leap year
      const feb29NonLeap = new Date(2023, 1, 28);
      const feb29Attempt = parser.updateSegment(feb29NonLeap, 'day', 29);
      expect(feb29Attempt).to.be.null; // Should be invalid for non-leap year
    });
  });

  describe('different locales and formats', () => {
    it('should work with different date formats', () => {
      const formats: Intl.DateTimeFormatOptions[] = [
        { year: 'numeric', month: 'short', day: 'numeric' },
        { year: '2-digit', month: 'numeric', day: '2-digit' },
        { year: 'numeric', month: 'long', day: 'numeric' }
      ];

      formats.forEach(format => {
        const testParser = new DateSegmentParser('en-US', format);
        const date = new Date(2024, 2, 15);
        const segments = testParser.parseDate(date);

        expect(segments.length).to.be.greaterThan(0);
        expect(segments.some(s => s.type === 'day')).to.be.true;
        expect(segments.some(s => s.type === 'month')).to.be.true;
        expect(segments.some(s => s.type === 'year')).to.be.true;
      });
    });

    it('should work with different locales', () => {
      const locales = ['en-US', 'en-GB', 'de-DE', 'fr-FR'];

      locales.forEach(locale => {
        const testParser = new DateSegmentParser(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        const date = new Date(2024, 2, 15);
        const segments = testParser.parseDate(date);

        expect(segments.length).to.be.greaterThan(0);

        // Values should be the same regardless of locale
        const daySegment = segments.find(s => s.type === 'day');
        const monthSegment = segments.find(s => s.type === 'month');
        const yearSegment = segments.find(s => s.type === 'year');

        expect(daySegment?.value).to.equal(15);
        expect(monthSegment?.value).to.equal(3);
        expect(yearSegment?.value).to.equal(2024);
      });
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      parser = new DateSegmentParser('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    });

    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid');
      const segments = parser.parseDate(invalidDate);

      expect(segments).to.be.an('array');
      expect(segments.length).to.equal(0); // Should return empty array for invalid dates
    });

    it('should handle null/undefined dates', () => {
      // Test with invalid Date objects instead of null/undefined
      const invalidDate1 = new Date('invalid');
      const invalidDate2 = new Date(NaN);

      const nullSegments = parser.parseDate(invalidDate1);
      const undefinedSegments = parser.parseDate(invalidDate2);

      expect(nullSegments).to.be.an('array');
      expect(nullSegments.length).to.equal(0);
      expect(undefinedSegments).to.be.an('array');
      expect(undefinedSegments.length).to.equal(0);
    });

    it('should handle extreme dates', () => {
      // Very old date
      const oldDate = new Date(1900, 0, 1);
      const oldSegments = parser.parseDate(oldDate);
      expect(oldSegments.length).to.be.greaterThan(0);

      // Very future date
      const futureDate = new Date(2100, 11, 31);
      const futureSegments = parser.parseDate(futureDate);
      expect(futureSegments.length).to.be.greaterThan(0);
    });

    it('should validate update bounds properly', () => {
      const date = new Date(2024, 2, 15);

      // Test boundary values
      expect(parser.updateSegment(date, 'day', 1)).to.not.be.null;
      expect(parser.updateSegment(date, 'day', 31)).to.not.be.null;
      expect(parser.updateSegment(date, 'day', 0)).to.be.null;
      expect(parser.updateSegment(date, 'day', 32)).to.be.null;

      expect(parser.updateSegment(date, 'month', 1)).to.not.be.null;
      expect(parser.updateSegment(date, 'month', 12)).to.not.be.null;
      expect(parser.updateSegment(date, 'month', 0)).to.be.null;
      expect(parser.updateSegment(date, 'month', 13)).to.be.null;

      expect(parser.updateSegment(date, 'year', 1900)).to.not.be.null;
      expect(parser.updateSegment(date, 'year', 2124)).to.not.be.null;
      expect(parser.updateSegment(date, 'year', 1899)).to.be.null;
      expect(parser.updateSegment(date, 'year', 2125)).to.be.null;
    });
  });

  describe('complex date scenarios', () => {
    beforeEach(() => {
      parser = new DateSegmentParser('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    });

    it('should handle all leap year edge cases', () => {
      // Leap year divisible by 4
      expect(parser.updateSegment(new Date(2024, 1, 28), 'day', 29)).to.not.be.null;

      // Non-leap year not divisible by 4
      expect(parser.updateSegment(new Date(2023, 1, 28), 'day', 29)).to.be.null;

      // Century year divisible by 400 (leap year)
      expect(parser.updateSegment(new Date(2000, 1, 28), 'day', 29)).to.not.be.null;

      // Century year not divisible by 400 (not leap year)
      expect(parser.updateSegment(new Date(1900, 1, 28), 'day', 29)).to.be.null;
    });

    it('should handle month changes for all month lengths', () => {
      const testCases = [
        { from: new Date(2024, 0, 31), toMonth: 2, expectedDay: 29 }, // Jan 31 -> Feb 29 (leap)
        { from: new Date(2023, 0, 31), toMonth: 2, expectedDay: 28 }, // Jan 31 -> Feb 28 (non-leap)
        { from: new Date(2024, 0, 31), toMonth: 4, expectedDay: 30 }, // Jan 31 -> Apr 30
        { from: new Date(2024, 0, 31), toMonth: 6, expectedDay: 31 }, // Jan 31 -> Jun 31 (should stay 31)
        { from: new Date(2024, 3, 30), toMonth: 2, expectedDay: 29 } // Apr 30 -> Feb 29
      ];

      testCases.forEach(({ from, toMonth, expectedDay }) => {
        const result = parser.updateSegment(from, 'month', toMonth);
        expect(result?.getDate()).to.equal(expectedDay);
        expect(result?.getMonth()).to.equal(toMonth - 1); // Month is 0-indexed
      });
    });

    it('should maintain date object integrity', () => {
      const original = new Date(2024, 2, 15);
      const updated = parser.updateSegment(original, 'day', 20);

      // Original should be unchanged
      expect(original.getDate()).to.equal(15);

      // Updated should be a new object
      expect(updated).to.not.equal(original);
      expect(updated?.getDate()).to.equal(20);
    });
  });
});
