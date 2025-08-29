import { expect } from '@open-wc/testing';
import { NumberParser } from './number-parser.js';

describe('NumberParser', () => {
  let parser: NumberParser;

  describe('default locale and options', () => {
    beforeEach(() => {
      parser = new NumberParser();
    });

    it('should return undefined for empty string', () => {
      expect(parser.parse('')).to.be.undefined;
    });

    it('should parse a simple number', () => {
      expect(parser.parse('1234')).to.equal(1234);
    });

    it('should parse a number with decimal point', () => {
      expect(parser.parse('1234.56')).to.equal(1234.56);
    });

    it('should parse a number with thousand separators', () => {
      expect(parser.parse('1,234')).to.equal(1234);
    });

    it('should return NaN for invalid number', () => {
      expect(parser.parse('1abc')).to.be.NaN;
    });
  });

  describe('percentage', () => {
    beforeEach(() => {
      parser = new NumberParser('pl-PL', { style: 'percent' });
    });

    it('should parse a percentage', () => {
      expect(parser.parse('50.5%')).to.equal(50.5);
    });

    it('should return NaN for invalid percentage', () => {
      expect(parser.parse('abc%')).to.be.NaN;
    });
  });

  describe('currency style', () => {
    beforeEach(() => {
      parser = new NumberParser('en-US', { style: 'currency', currency: 'USD' });
    });

    it('should parse a currency value', () => {
      expect(parser.parse('$1,234.56')).to.equal(1234.56);
    });

    it('should return NaN for invalid currency value', () => {
      expect(parser.parse('$abc')).to.be.NaN;
    });
  });
});
