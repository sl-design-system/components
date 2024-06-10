import { expect } from '@open-wc/testing';
import { getValueByPath, setValueByPath } from './path.js';

describe('path utils', () => {
  describe('getValueByPath', () => {
    it('should return undefined if the path does not exist', () => {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      expect(getValueByPath({}, 'foo')).to.be.undefined;
    });

    it('should return a value in the root of the object', () => {
      expect(getValueByPath({ foo: 'bar' }, 'foo')).to.equal('bar');
    });

    it('should return a value in a nested object', () => {
      expect(getValueByPath({ foo: { bar: 'baz' } }, 'foo.bar')).to.equal('baz');
    });

    it('should return an array item', () => {
      expect(getValueByPath({ foo: { bar: ['baz'] } }, 'foo.bar[0]')).to.equal('baz');
    });

    it('should return a value in a nested object in an array item', () => {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      expect(getValueByPath({ foo: [{ bar: 'baz' }] }, 'foo[0].bar')).to.equal('baz');
    });
  });

  describe('setValueByPath', () => {
    describe('new object', () => {
      it('should set a value in the root of the object', () => {
        const obj = {};

        setValueByPath(obj, 'foo', 'baz');

        expect(obj).to.deep.equal({ foo: 'baz' });
      });

      it('should set a value in a nested object', () => {
        const obj = {};

        setValueByPath(obj, 'foo.bar', 'qux');

        expect(obj).to.deep.equal({ foo: { bar: 'qux' } });
      });

      it('should set an array item', () => {
        const obj = {};

        setValueByPath(obj, 'foo.bar[0]', 'qux');

        expect(obj).to.deep.equal({ foo: { bar: ['qux'] } });
      });

      it('should set a non-zero array item', () => {
        const obj = {};

        setValueByPath(obj, 'foo.bar[1]', 'qux');

        expect(obj).to.deep.equal({ foo: { bar: [undefined, 'qux'] } });
      });

      it('should set a value in a nested object in an array item', () => {
        const obj = {};

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
