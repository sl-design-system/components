import { expect } from '@open-wc/testing';
import { getNameByPath, getStringByPath } from './path.js';

describe('path utils', () => {
  describe('getNameByPath', () => {
    it('should fail gracefully when no path is set', () => {
      expect(getNameByPath('')).to.equal('No path set');
    });

    it('should return the name of the last node of the path', () => {
      expect(getNameByPath('address.street')).to.equal('Street');
      expect(getNameByPath('person.address.street')).to.equal('Street');
    });
  });

  describe('getStringByPath', () => {
    const person = { address: { street: 'Main Street' } };

    it('should fail gracefully when no path is set', () => {
      expect(getStringByPath(person, '')).to.equal('');
    });

    it('should return the value at the given path', () => {
      expect(getStringByPath(person, 'address.street')).to.equal(person.address.street);
    });
  });
});
