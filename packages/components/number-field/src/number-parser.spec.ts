import { expect } from '@open-wc/testing';
import { NumberParser } from './number-parser.js';

describe('NumberParser', () => {
  let parser: NumberParser;

  describe('default locale and options', () => {
    beforeEach(() => {
      parser = new NumberParser();
    });

    it('should parse a simple number', () => {
      expect(parser.parse('1234')).to.equal(1234);
    });

    it('should parse a number with decimal point', () => {
      expect(parser.parse('1234.56')).to.equal(1234.56);
    });

    it('should return undefined for invalid number', () => {
      expect(parser.parse('1abc')).to.be.undefined;
    });
  });

  describe('percentage', () => {
    beforeEach(() => {
      parser = new NumberParser('pl-PL', { style: 'percent' });
    });

    it('should parse a percentage', () => {
      expect(parser.parse('50,5%')).to.equal(50.5);
    });

    it('should return undefined for invalid percentage', () => {
      expect(parser.parse('abc%')).to.be.undefined;
    });
  });

  describe('currency style', () => {
    beforeEach(() => {
      parser = new NumberParser('en-US', { style: 'currency', currency: 'USD' });
    });

    it('should parse a currency value', () => {
      expect(parser.parse('$1,234.56')).to.equal(1234.56);
    });

    it('should return undefined for invalid currency value', () => {
      expect(parser.parse('$abc')).to.be.undefined;
    });
  });

  describe('unit', () => {
    beforeEach(() => {
      parser = new NumberParser('en-GB', { style: 'unit', unit: 'meter', unitDisplay: 'long' });
    });

    it('should parse a unit value', () => {
      expect(parser.parse('1,234 meters')).to.equal(1234);
    });

    it('should return undefined for invalid unit value', () => {
      expect(parser.parse('a2bc meteros')).to.be.undefined;
    });
  });
});
