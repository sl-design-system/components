import { describe, expect, it } from 'vitest';
import {
  calculateGrandTotals,
  formatGrandTotals,
  getDefaultGrandTotalsFormat,
  getGrandTotalsFormats,
  resolveGrandTotalsFormat
} from './grand-totals.js';

describe('grand totals', () => {
  describe('calculateGrandTotals', () => {
    it('should sum numbers and keep the number of evaluated values', () => {
      expect(calculateGrandTotals([1, 2, 3.5])).to.include({
        evaluated: 3,
        sum: 6.5
      });
    });

    it('should exclude empty, invalid and non-numeric values from the evaluation', () => {
      const totals = calculateGrandTotals([1, undefined, null, '', ' ', 'abc', NaN, '2', true]);

      expect(totals).to.include({ evaluated: 2, sum: 3, totalRecords: 9 });
    });

    it('should count non-empty values', () => {
      const totals = calculateGrandTotals(['a', '', ' ', undefined, null, 'b', 0, false]);

      expect(totals.nonEmpty).to.equal(4);
    });

    it('should count true values and keep all records as denominator', () => {
      const totals = calculateGrandTotals([true, false, true, undefined, 'true']);

      expect(totals).to.include({ trueCount: 2, totalRecords: 5 });
    });

    it('should handle no values', () => {
      expect(calculateGrandTotals([])).to.deep.equal({
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
      expect(getGrandTotalsFormats('number')).to.deep.equal(['sum', 'average']);
      expect(getGrandTotalsFormats('text')).to.deep.equal(['count']);
      expect(getGrandTotalsFormats('boolean')).to.deep.equal(['fraction', 'count', 'percentage']);
    });

    it('should have a default format for each type', () => {
      expect(getDefaultGrandTotalsFormat('number')).to.equal('sum');
      expect(getDefaultGrandTotalsFormat('text')).to.equal('count');
      expect(getDefaultGrandTotalsFormat('boolean')).to.equal('fraction');
    });

    it('should fall back to the default when the format is not available for the type', () => {
      expect(resolveGrandTotalsFormat('text', 'percentage')).to.equal('count');
      expect(resolveGrandTotalsFormat('number', 'fraction')).to.equal('sum');
      expect(resolveGrandTotalsFormat('boolean', 'percentage')).to.equal('percentage');
      expect(resolveGrandTotalsFormat('boolean')).to.equal('fraction');
    });
  });

  describe('formatGrandTotals', () => {
    const booleans = calculateGrandTotals([
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
      expect(formatGrandTotals(undefined, 'number', 'sum', 'en')).to.equal('-');
    });

    it('should format the sum and the average of numbers', () => {
      const totals = calculateGrandTotals([5.5, 3.5, 9, 7]);

      expect(formatGrandTotals(totals, 'number', 'sum', 'en')).to.equal('25');
      expect(formatGrandTotals(totals, 'number', 'average', 'en')).to.equal('6.3');
    });

    it('should use the locale for numbers', () => {
      const totals = calculateGrandTotals([6, 6.2]);

      expect(formatGrandTotals(totals, 'number', 'average', 'nl')).to.equal('6,1');
    });

    it('should return a dash when no number could be evaluated', () => {
      const totals = calculateGrandTotals(['a', undefined]);

      expect(formatGrandTotals(totals, 'number', 'sum', 'en')).to.equal('-');
      expect(formatGrandTotals(totals, 'number', 'average', 'en')).to.equal('-');
    });

    it('should count non-empty text values', () => {
      expect(
        formatGrandTotals(calculateGrandTotals(['a', '', 'b']), 'text', 'count', 'en')
      ).to.equal('2');
    });

    it('should format booleans as count, fraction and percentage with the same denominator', () => {
      expect(formatGrandTotals(booleans, 'boolean', 'count', 'en')).to.equal('3');
      expect(formatGrandTotals(booleans, 'boolean', 'fraction', 'en')).to.equal('3 / 11');
      expect(formatGrandTotals(booleans, 'boolean', 'percentage', 'en')).to.equal('27%');
    });

    it('should return a dash for fractions and percentages without records', () => {
      const totals = calculateGrandTotals([]);

      expect(formatGrandTotals(totals, 'boolean', 'fraction', 'en')).to.equal('-');
      expect(formatGrandTotals(totals, 'boolean', 'percentage', 'en')).to.equal('-');
    });
  });
});
