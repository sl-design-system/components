import { expect } from '@open-wc/testing';
import { camelize, capitalize, classify, dasherize, decamelize, humanize, underscore } from './string.js';

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
});
