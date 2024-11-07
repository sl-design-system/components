import { expect } from '@open-wc/testing';
import { type PathKeys, getNameByPath, getStringByPath, getValueByPath, setValueByPath } from './path.js';

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

    it('should return the string representation of the object', () => {
      expect(getStringByPath(person, '' as PathKeys<typeof person>)).to.equal('[object Object]');
    });

    it('should return the value at the given path', () => {
      expect(getStringByPath(person, 'address.street')).to.equal(person.address.street);
    });
  });

  describe('getValueByPath', () => {
    it('should return undefined if the path does not exist', () => {
      const object: { foo?: string } = {};

      expect(getValueByPath(object, 'foo')).to.be.undefined;
    });

    it('should return a value in the root of the object', () => {
      const object = { foo: 'bar' };

      expect(getValueByPath(object, 'foo')).to.equal('bar');
    });

    it('should return a value in a nested object', () => {
      const object = { foo: { bar: 'baz' } };

      expect(getValueByPath(object, 'foo.bar')).to.equal('baz');
    });

    it('should return an array item', () => {
      const object = { foo: { bar: ['baz'] } };

      expect(getValueByPath(object, 'foo.bar[0]')).to.equal('baz');
    });

    it('should return a value in a nested object in an array item', () => {
      const object = { foo: [{ bar: 'baz' }] };

      expect(getValueByPath(object, 'foo[0].bar')).to.equal('baz');
    });
  });

  describe('setValueByPath', () => {
    describe('new object', () => {
      it('should set a value in the root of the object', () => {
        const obj: { foo?: string } = {};

        setValueByPath(obj, 'foo', 'baz');

        expect(obj).to.deep.equal({ foo: 'baz' });
      });

      it('should set a value in a nested object', () => {
        const obj: { foo?: { bar: string } } = {};

        setValueByPath(obj, 'foo.bar', 'qux');

        expect(obj).to.deep.equal({ foo: { bar: 'qux' } });
      });

      it('should set an array item', () => {
        const obj: { foo?: { bar: string[] } } = {};

        setValueByPath(obj, 'foo.bar[0]', 'qux');

        expect(obj).to.deep.equal({ foo: { bar: ['qux'] } });
      });

      it('should set a non-zero array item', () => {
        const obj: { foo?: { bar: string[] } } = {};

        setValueByPath(obj, 'foo.bar[1]', 'qux');

        expect(obj).to.deep.equal({ foo: { bar: [undefined, 'qux'] } });
      });

      it('should set a value in a nested object in an array item', () => {
        const obj: { foo?: [{ bar: string }] } = {};

        setValueByPath(obj, 'foo[0].bar', 'qux');

        expect(obj).to.deep.equal({ foo: [{ bar: 'qux' }] });
      });
    });

    describe('existing object', () => {
      it('should set a value in the root of the object', () => {
        const obj = { foo: 'bar' };

        setValueByPath(obj, 'foo', 'baz');

        expect(obj).to.deep.equal({ foo: 'baz' });
      });

      it('should set a value in a nested object', () => {
        const obj = { foo: { bar: 'baz' } };

        setValueByPath(obj, 'foo.bar', 'qux');

        expect(obj).to.deep.equal({ foo: { bar: 'qux' } });
      });

      it('should set an array item', () => {
        const obj = { foo: { bar: ['baz'] } };

        setValueByPath(obj, 'foo.bar[0]', 'qux');

        expect(obj).to.deep.equal({ foo: { bar: ['qux'] } });
      });

      it('should set a value in a nested object in an array item', () => {
        const obj = { foo: [{ bar: 'baz' }] };

        setValueByPath(obj, 'foo[0].bar', 'qux');

        expect(obj).to.deep.equal({ foo: [{ bar: 'qux' }] });
      });
    });
  });
});
