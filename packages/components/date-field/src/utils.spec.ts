import { describe, expect, it } from 'vitest';
import { getDateFormat, getDateTemplate, getDateUnitLetter, getDateUnitName, getMonthName } from './utils.js';

describe('date-field utils', () => {
  describe('getDateFormat', () => {
    it('should return an array of date format parts', () => {
      const parts = getDateFormat('en-US');

      expect(parts).to.be.an('array');
      expect(parts.length).to.be.greaterThan(0);
    });

    it('should include day, month, and year parts', () => {
      const parts = getDateFormat('en-US'),
        types = parts.map(p => p.type);

      expect(types).to.include('day');
      expect(types).to.include('month');
      expect(types).to.include('year');
    });

    it('should include literal separator parts', () => {
      const parts = getDateFormat('en-US'),
        literals = parts.filter(p => p.type === 'literal');

      expect(literals.length).to.be.greaterThan(0);
    });

    it('should have start and end indices on each part', () => {
      const parts = getDateFormat('en-US');

      for (const part of parts) {
        expect(part).to.have.property('start');
        expect(part).to.have.property('end');
        expect(part.end).to.be.greaterThan(part.start);
      }
    });

    it('should have consecutive start/end indices', () => {
      const parts = getDateFormat('en-US');

      for (let i = 1; i < parts.length; i++) {
        expect(parts[i].start).to.equal(parts[i - 1].end);
      }

      expect(parts[0].start).to.equal(0);
    });

    it('should use 2-digit formatting for day and month', () => {
      const parts = getDateFormat('en-US'),
        day = parts.find(p => p.type === 'day'),
        month = parts.find(p => p.type === 'month');

      expect(day?.value).to.have.length(2);
      expect(month?.value).to.have.length(2);
    });

    it('should return month before day for en-US', () => {
      const parts = getDateFormat('en-US'),
        monthIndex = parts.findIndex(p => p.type === 'month'),
        dayIndex = parts.findIndex(p => p.type === 'day');

      expect(monthIndex).to.be.lessThan(dayIndex);
    });

    it('should return day before month for nl-NL', () => {
      const parts = getDateFormat('nl-NL'),
        dayIndex = parts.findIndex(p => p.type === 'day'),
        monthIndex = parts.findIndex(p => p.type === 'month');

      expect(dayIndex).to.be.lessThan(monthIndex);
    });

    it('should return parts for a specific date', () => {
      const date = new Date(2026, 0, 5),
        parts = getDateFormat('en-US', date),
        day = parts.find(p => p.type === 'day'),
        month = parts.find(p => p.type === 'month'),
        year = parts.find(p => p.type === 'year');

      expect(day?.value).to.equal('05');
      expect(month?.value).to.equal('01');
      expect(year?.value).to.equal('2026');
    });

    it('should return cached results when no date is provided', () => {
      const parts1 = getDateFormat('en-US'),
        parts2 = getDateFormat('en-US');

      expect(parts1).to.equal(parts2);
    });

    it('should not cache results when a date is provided', () => {
      const parts1 = getDateFormat('en-US', new Date(2026, 0, 1)),
        parts2 = getDateFormat('en-US', new Date(2026, 5, 15));

      expect(parts1).to.not.equal(parts2);
    });
  });

  describe('getDateUnitName', () => {
    it('should return "Day" for en-US day', () => {
      expect(getDateUnitName('en-US', 'day')).to.equal('Day');
    });

    it('should return "Month" for en-US month', () => {
      expect(getDateUnitName('en-US', 'month')).to.equal('Month');
    });

    it('should return "Year" for en-US year', () => {
      expect(getDateUnitName('en-US', 'year')).to.equal('Year');
    });

    it('should capitalize the first letter', () => {
      const name = getDateUnitName('en-US', 'day');

      expect(name.charAt(0)).to.equal(name.charAt(0).toUpperCase());
    });

    it('should return localized names for nl-NL', () => {
      expect(getDateUnitName('nl-NL', 'day')).to.equal('Dag');
      expect(getDateUnitName('nl-NL', 'month')).to.equal('Maand');
      expect(getDateUnitName('nl-NL', 'year')).to.equal('Jaar');
    });

    it('should return localized names for de-DE', () => {
      expect(getDateUnitName('de-DE', 'day')).to.equal('Tag');
      expect(getDateUnitName('de-DE', 'month')).to.equal('Monat');
      expect(getDateUnitName('de-DE', 'year')).to.equal('Jahr');
    });

    it('should return localized names for fr-FR', () => {
      expect(getDateUnitName('fr-FR', 'day')).to.equal('Jour');
      expect(getDateUnitName('fr-FR', 'month')).to.equal('Mois');
      expect(getDateUnitName('fr-FR', 'year')).to.equal('An');
    });
  });

  describe('getDateUnitLetter', () => {
    it('should return "D" for en-US day', () => {
      expect(getDateUnitLetter('en-US', 'day')).to.equal('D');
    });

    it('should return "M" for en-US month', () => {
      expect(getDateUnitLetter('en-US', 'month')).to.equal('M');
    });

    it('should return "Y" for en-US year', () => {
      expect(getDateUnitLetter('en-US', 'year')).to.equal('Y');
    });

    it('should return localized letters for nl-NL', () => {
      expect(getDateUnitLetter('nl-NL', 'day')).to.equal('D');
      expect(getDateUnitLetter('nl-NL', 'month')).to.equal('M');
      expect(getDateUnitLetter('nl-NL', 'year')).to.equal('J');
    });

    it('should return localized letters for de-DE', () => {
      expect(getDateUnitLetter('de-DE', 'day')).to.equal('T');
      expect(getDateUnitLetter('de-DE', 'month')).to.equal('M');
      expect(getDateUnitLetter('de-DE', 'year')).to.equal('J');
    });

    it('should return the first letter of the unit name', () => {
      const letter = getDateUnitLetter('en-US', 'day'),
        name = getDateUnitName('en-US', 'day');

      expect(letter).to.equal(name.charAt(0));
    });
  });

  describe('getDateTemplate', () => {
    it('should return "MM/DD/YYYY" for en-US', () => {
      expect(getDateTemplate('en-US')).to.equal('MM/DD/YYYY');
    });

    it('should return a template with localized letters for nl-NL', () => {
      expect(getDateTemplate('nl-NL')).to.equal('DD-MM-JJJJ');
    });

    it('should return a template with localized letters for de-DE', () => {
      expect(getDateTemplate('de-DE')).to.equal('TT.MM.JJJJ');
    });

    it('should use the locale-specific separator', () => {
      const enTemplate = getDateTemplate('en-US'),
        nlTemplate = getDateTemplate('nl-NL'),
        deTemplate = getDateTemplate('de-DE');

      expect(enTemplate).to.include('/');
      expect(nlTemplate).to.include('-');
      expect(deTemplate).to.include('.');
    });

    it('should have 4 characters for the year part', () => {
      const template = getDateTemplate('en-US'),
        yearLetter = getDateUnitLetter('en-US', 'year');

      expect(template).to.include(yearLetter.repeat(4));
    });

    it('should have 2 characters for the day part', () => {
      const template = getDateTemplate('en-US'),
        dayLetter = getDateUnitLetter('en-US', 'day');

      expect(template).to.include(dayLetter.repeat(2));
    });

    it('should have 2 characters for the month part', () => {
      const template = getDateTemplate('en-US'),
        monthLetter = getDateUnitLetter('en-US', 'month');

      expect(template).to.include(monthLetter.repeat(2));
    });
  });

  describe('getMonthName', () => {
    it('should return "January" for month 1 in en-US', () => {
      expect(getMonthName('en-US', 1)).to.equal('January');
    });

    it('should return "December" for month 12 in en-US', () => {
      expect(getMonthName('en-US', 12)).to.equal('December');
    });

    it('should return localized month names for nl-NL', () => {
      expect(getMonthName('nl-NL', 1)).to.equal('januari');
      expect(getMonthName('nl-NL', 6)).to.equal('juni');
      expect(getMonthName('nl-NL', 12)).to.equal('december');
    });

    it('should return localized month names for de-DE', () => {
      expect(getMonthName('de-DE', 1)).to.equal('Januar');
      expect(getMonthName('de-DE', 3)).to.equal('März');
    });

    it('should return all 12 months', () => {
      for (let i = 1; i <= 12; i++) {
        const name = getMonthName('en-US', i);

        expect(name).to.be.a('string');
        expect(name.length).to.be.greaterThan(0);
      }
    });
  });
});
