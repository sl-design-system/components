import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  camelize,
  capitalize,
  classify,
  dasherize,
  decamelize,
  getCharacterPluralSuffix,
  humanize,
  underscore
} from './string.js';

describe('string utils', () => {
  describe('camelize', () => {
    it('should fail gracefully when no string is given', () => {
      expect(camelize('')).to.equal('');
    });

    it('should return the correct string with uppercase in the original string', () => {
      expect(camelize('innerHTML')).to.equal('innerHTML');
    });

    it('should return the correct string with _ in the original string', () => {
      expect(camelize('action_name')).to.equal('actionName');
    });

    it('should return the correct string with - in the original string', () => {
      expect(camelize('css-class-name')).to.equal('cssClassName');
    });

    it('should return the correct string with . in the original string', () => {
      expect(camelize('object.path.name')).to.equal('objectPathName');
    });

    it('should return the correct string with space in the original string', () => {
      expect(camelize('my favorite items')).to.equal('myFavoriteItems');
    });

    it('should return the correct string, ignoring origninal capitalization', () => {
      expect(camelize('My Favorite Items')).to.equal('myFavoriteItems');
    });

    it('should remove splitting characters at the end of a string', () => {
      expect(camelize('css-class-name-')).to.equal('cssClassName');
    });
  });

  describe('capitalize', () => {
    it('should fail gracefully when no string is given', () => {
      expect(capitalize('')).to.equal('');
    });

    it('should return the correct string with uppercase in the original string', () => {
      expect(capitalize('innerHTML')).to.equal('InnerHTML');
    });

    it('should return the correct string with _ in the original string', () => {
      expect(capitalize('action_name')).to.equal('Action_name');
    });

    it('should return the correct string with - in the original string', () => {
      expect(capitalize('css-class-name')).to.equal('Css-class-name');
    });

    it('should return the correct string with . in the original string', () => {
      expect(capitalize('object.path.name')).to.equal('Object.path.name');
    });

    it('should return the correct string with space in the original string', () => {
      expect(capitalize('my favorite items')).to.equal('My favorite items');
    });
  });

  describe('classify', () => {
    it('should fail gracefully when no string is given', () => {
      expect(classify('')).to.equal('');
    });

    it('should return the correct string with uppercase in the original string', () => {
      expect(classify('innerHTML')).to.equal('InnerHTML');
    });

    it('should return the correct string with _ in the original string', () => {
      expect(classify('action_name')).to.equal('ActionName');
    });

    it('should return the correct string with - in the original string', () => {
      expect(classify('css-class-name')).to.equal('CssClassName');
    });

    it('should return the correct string with . in the original string', () => {
      expect(classify('object.path.name')).to.equal('Object.Path.Name');
    });

    it('should return the correct string with space in the original string', () => {
      expect(classify('my favorite items')).to.equal('MyFavoriteItems');
    });
  });

  describe('dasherize', () => {
    it('should fail gracefully when no string is given', () => {
      expect(dasherize('')).to.equal('');
    });

    it('should return the correct string with uppercase in the original string', () => {
      expect(dasherize('innerHTML')).to.equal('inner-html');
    });

    it('should return the correct string with _ in the original string', () => {
      expect(dasherize('action_name')).to.equal('action-name');
    });

    it('should return the correct string with - in the original string', () => {
      expect(dasherize('css-class-name')).to.equal('css-class-name');
    });

    it('should return the correct string with . in the original string', () => {
      expect(dasherize('object.path.name')).to.equal('object.path.name');
    });

    it('should return the correct string with space in the original string', () => {
      expect(dasherize('my favorite items')).to.equal('my-favorite-items');
    });
  });

  describe('decamelize', () => {
    it('should fail gracefully when no string is given', () => {
      expect(decamelize('')).to.equal('');
    });

    it('should return the correct string with uppercase in the original string', () => {
      expect(decamelize('innerHTML')).to.equal('inner_html');
    });

    it('should return the correct string with _ in the original string', () => {
      expect(decamelize('action_name')).to.equal('action_name');
    });

    it('should return the correct string with - in the original string', () => {
      expect(decamelize('css-class-name')).to.equal('css-class-name');
    });

    it('should return the correct string with . in the original string', () => {
      expect(decamelize('object.path.name')).to.equal('object.path.name');
    });

    it('should return the correct string with space in the original string', () => {
      expect(decamelize('my favorite items')).to.equal('my favorite items');
    });
  });

  describe('humanize', () => {
    it('should fail gracefully when no string is given', () => {
      expect(humanize('')).to.equal('');
    });

    it('should return the correct string with uppercase in the original string', () => {
      expect(humanize('innerHTML')).to.equal('Inner html');
    });

    it('should return the correct string with _ in the original string', () => {
      expect(humanize('action_name')).to.equal('Action name');
    });

    it('should return the correct string with - in the original string', () => {
      expect(humanize('css-class-name')).to.equal('Css class name');
    });

    it('should return the correct string with . in the original string', () => {
      expect(humanize('object.path.name')).to.equal('Object path name');
    });

    it('should return the correct string with space in the original string', () => {
      expect(humanize('my favorite items')).to.equal('My favorite items');
    });

    it('should remove splitting characters at the end of a string', () => {
      expect(humanize('my favorite items-')).to.equal('My favorite items ');
    });
  });

  describe('underscore', () => {
    it('should fail gracefully when no string is given', () => {
      expect(underscore('')).to.equal('');
    });

    it('should return the correct string with uppercase in the original string', () => {
      expect(underscore('innerHTML')).to.equal('inner_html');
    });

    it('should return the correct string with _ in the original string', () => {
      expect(underscore('action_name')).to.equal('action_name');
    });

    it('should return the correct string with - in the original string', () => {
      expect(underscore('css-class-name')).to.equal('css_class_name');
    });

    it('should return the correct string with . in the original string', () => {
      expect(camelize('object.path.name')).to.equal('objectPathName');
    });

    it('should return the correct string with space in the original string', () => {
      expect(underscore('my favorite items')).to.equal('my_favorite_items');
    });
  });

  describe('getCharacterPluralSuffix', () => {
    const originalLang = document.documentElement.lang;

    afterEach(() => {
      document.documentElement.lang = originalLang;
    });

    describe('English', () => {
      it('should return empty string for 1 character', () => {
        document.documentElement.lang = 'en';
        expect(getCharacterPluralSuffix(1)).to.equal('');
      });

      it('should return "s" for 0 characters', () => {
        document.documentElement.lang = 'en';
        expect(getCharacterPluralSuffix(0)).to.equal('s');
      });

      it('should return "s" for 2 characters', () => {
        document.documentElement.lang = 'en';
        expect(getCharacterPluralSuffix(2)).to.equal('s');
      });

      it('should return "s" for many characters', () => {
        document.documentElement.lang = 'en';
        expect(getCharacterPluralSuffix(100)).to.equal('s');
      });

      it('should work with en-GB locale', () => {
        document.documentElement.lang = 'en-GB';
        expect(getCharacterPluralSuffix(1)).to.equal('');
        expect(getCharacterPluralSuffix(2)).to.equal('s');
      });
    });

    describe('Polish', () => {
      beforeEach(() => {
        document.documentElement.lang = 'pl';
      });

      it('should return empty string for 1 (one form)', () => {
        expect(getCharacterPluralSuffix(1)).to.equal('');
      });

      it('should return "i" for 2 (few form)', () => {
        expect(getCharacterPluralSuffix(2)).to.equal('i');
      });

      it('should return "i" for 3 (few form)', () => {
        expect(getCharacterPluralSuffix(3)).to.equal('i');
      });

      it('should return "i" for 4 (few form)', () => {
        expect(getCharacterPluralSuffix(4)).to.equal('i');
      });

      it('should return "ów" for 5 (many form)', () => {
        expect(getCharacterPluralSuffix(5)).to.equal('ów');
      });

      it('should return "ów" for 0 (many form)', () => {
        expect(getCharacterPluralSuffix(0)).to.equal('ów');
      });

      it('should return "ów" for 11-14 (many form)', () => {
        expect(getCharacterPluralSuffix(11)).to.equal('ów');
        expect(getCharacterPluralSuffix(12)).to.equal('ów');
        expect(getCharacterPluralSuffix(13)).to.equal('ów');
        expect(getCharacterPluralSuffix(14)).to.equal('ów');
      });

      it('should return "i" for 22-24 (few form)', () => {
        expect(getCharacterPluralSuffix(22)).to.equal('i');
        expect(getCharacterPluralSuffix(23)).to.equal('i');
        expect(getCharacterPluralSuffix(24)).to.equal('i');
      });

      it('should return "ów" for 25+ (many form)', () => {
        expect(getCharacterPluralSuffix(25)).to.equal('ów');
        expect(getCharacterPluralSuffix(100)).to.equal('ów');
      });
    });

    describe('Spanish', () => {
      beforeEach(() => {
        document.documentElement.lang = 'es-ES';
      });

      it('should return "carácter" for 1', () => {
        expect(getCharacterPluralSuffix(1)).to.equal('carácter');
      });

      it('should return "caracteres" for 0', () => {
        expect(getCharacterPluralSuffix(0)).to.equal('caracteres');
      });

      it('should return "caracteres" for 2', () => {
        expect(getCharacterPluralSuffix(2)).to.equal('caracteres');
      });

      it('should return "caracteres" for many', () => {
        expect(getCharacterPluralSuffix(100)).to.equal('caracteres');
      });

      it('should work with other Spanish locales', () => {
        document.documentElement.lang = 'es-MX';
        expect(getCharacterPluralSuffix(1)).to.equal('carácter');
        expect(getCharacterPluralSuffix(2)).to.equal('caracteres');
      });
    });

    describe('Italian', () => {
      beforeEach(() => {
        document.documentElement.lang = 'it';
      });

      it('should return "e" for 1', () => {
        expect(getCharacterPluralSuffix(1)).to.equal('e');
      });

      it('should return "i" for 0', () => {
        expect(getCharacterPluralSuffix(0)).to.equal('i');
      });

      it('should return "i" for 2', () => {
        expect(getCharacterPluralSuffix(2)).to.equal('i');
      });

      it('should return "i" for many', () => {
        expect(getCharacterPluralSuffix(100)).to.equal('i');
      });
    });

    describe('Dutch (fallback)', () => {
      beforeEach(() => {
        document.documentElement.lang = 'nl';
      });

      it('should return empty string for 1', () => {
        expect(getCharacterPluralSuffix(1)).to.equal('');
      });

      it('should return "s" for 0', () => {
        expect(getCharacterPluralSuffix(0)).to.equal('s');
      });

      it('should return "s" for 2', () => {
        expect(getCharacterPluralSuffix(2)).to.equal('s');
      });

      it('should return "s" for many', () => {
        expect(getCharacterPluralSuffix(100)).to.equal('s');
      });
    });

    describe('fallback behavior', () => {
      it('should use navigator.language if document.documentElement.lang is empty', () => {
        document.documentElement.lang = '';
        const originalNavigatorLanguage = Object.getOwnPropertyDescriptor(navigator, 'language');

        Object.defineProperty(navigator, 'language', {
          value: 'en',
          configurable: true
        });

        expect(getCharacterPluralSuffix(1)).to.equal('');
        expect(getCharacterPluralSuffix(2)).to.equal('s');

        if (originalNavigatorLanguage) {
          Object.defineProperty(navigator, 'language', originalNavigatorLanguage);
        }
      });

      it('should default to "en" if both are empty', () => {
        document.documentElement.lang = '';
        const originalNavigatorLanguage = Object.getOwnPropertyDescriptor(navigator, 'language');

        Object.defineProperty(navigator, 'language', {
          value: '',
          configurable: true
        });

        expect(getCharacterPluralSuffix(1)).to.equal('');
        expect(getCharacterPluralSuffix(2)).to.equal('s');

        if (originalNavigatorLanguage) {
          Object.defineProperty(navigator, 'language', originalNavigatorLanguage);
        }
      });

      it('should use simple pluralization for unsupported locales', () => {
        document.documentElement.lang = 'fr';
        expect(getCharacterPluralSuffix(1)).to.equal('');
        expect(getCharacterPluralSuffix(2)).to.equal('s');
      });
    });
  });
});
