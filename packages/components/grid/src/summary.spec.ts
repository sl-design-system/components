import { describe, expect, it } from 'vitest';
import {
  calculateSummaryTotals,
  formatSummary,
  getDefaultSummaryFormat,
  getSummaryFormats,
  resolveSummaryFormat
} from './summary.js';

describe('summary', () => {
  describe('calculateSummaryTotals', () => {
    it('should sum numbers and keep the number of evaluated values', () => {
      expect(calculateSummaryTotals([1, 2, 3.5])).to.include({
        evaluated: 3,
        sum: 6.5
      });
    });

    it('should exclude empty, invalid and non-numeric values from the evaluation', () => {
      const totals = calculateSummaryTotals([1, undefined, null, '', ' ', 'abc', NaN, '2', true]);

      expect(totals).to.include({ evaluated: 2, sum: 3, totalRecords: 9 });
    });

    it('should count non-empty values', () => {
      const totals = calculateSummaryTotals(['a', '', ' ', undefined, null, 'b', 0, false]);

      expect(totals.nonEmpty).to.equal(4);
    });

    it('should count true values and keep all records as denominator', () => {
      const totals = calculateSummaryTotals([true, false, true, undefined, 'true']);

      expect(totals).to.include({ trueCount: 2, totalRecords: 5 });
    });

    it('should handle no values', () => {
      expect(calculateSummaryTotals([])).to.deep.equal({
        evaluated: 0,
        nonEmpty: 0,
        sum: 0,
        totalRecords: 0,
        trueCount: 0
      });
    });
  });

  describe('formats', () => {
    it('should list the formats for each type', () => {
      expect(getSummaryFormats('number')).to.deep.equal(['sum', 'average']);
      expect(getSummaryFormats('text')).to.deep.equal(['count']);
      expect(getSummaryFormats('boolean')).to.deep.equal(['fraction', 'count', 'percentage']);
    });

    it('should have a default format for each type', () => {
      expect(getDefaultSummaryFormat('number')).to.equal('sum');
      expect(getDefaultSummaryFormat('text')).to.equal('count');
      expect(getDefaultSummaryFormat('boolean')).to.equal('fraction');
    });

    it('should fall back to the default when the format is not available for the type', () => {
      expect(resolveSummaryFormat('text', 'percentage')).to.equal('count');
      expect(resolveSummaryFormat('number', 'fraction')).to.equal('sum');
      expect(resolveSummaryFormat('boolean', 'percentage')).to.equal('percentage');
      expect(resolveSummaryFormat('boolean')).to.equal('fraction');
    });
  });

  describe('formatSummary', () => {
    const booleans = calculateSummaryTotals([
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]);

    it('should return a dash without totals', () => {
      expect(formatSummary(undefined, 'number', 'sum', 'en')).to.equal('-');
    });

    it('should format the sum and the average of numbers', () => {
      const totals = calculateSummaryTotals([5.5, 3.5, 9, 7]);

      expect(formatSummary(totals, 'number', 'sum', 'en')).to.equal('25');
      expect(formatSummary(totals, 'number', 'average', 'en')).to.equal('6.3');
    });

    it('should use the locale for numbers', () => {
      const totals = calculateSummaryTotals([6, 6.2]);

      expect(formatSummary(totals, 'number', 'average', 'nl')).to.equal('6,1');
    });

    it('should return a dash when no number could be evaluated', () => {
      const totals = calculateSummaryTotals(['a', undefined]);

      expect(formatSummary(totals, 'number', 'sum', 'en')).to.equal('-');
      expect(formatSummary(totals, 'number', 'average', 'en')).to.equal('-');
    });

    it('should count non-empty text values', () => {
      expect(formatSummary(calculateSummaryTotals(['a', '', 'b']), 'text', 'count', 'en')).to.equal(
        '2'
      );
    });

    it('should format booleans as count, fraction and percentage with the same denominator', () => {
      expect(formatSummary(booleans, 'boolean', 'count', 'en')).to.equal('3');
      expect(formatSummary(booleans, 'boolean', 'fraction', 'en')).to.equal('3 / 11');
      expect(formatSummary(booleans, 'boolean', 'percentage', 'en')).to.equal('27%');
    });

    it('should return a dash for fractions and percentages without records', () => {
      const totals = calculateSummaryTotals([]);

      expect(formatSummary(totals, 'boolean', 'fraction', 'en')).to.equal('-');
      expect(formatSummary(totals, 'boolean', 'percentage', 'en')).to.equal('-');
    });
  });
});
