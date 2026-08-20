import { describe, expect, it } from 'vitest';
import { getSlottedText, hasSlottedContent } from './slot.js';

describe('slot utils', () => {
  const slotWith = (html: string, shadowHtml = '<slot></slot>'): HTMLSlotElement => {
    const host = document.createElement('div');
    host.attachShadow({ mode: 'open' }).innerHTML = shadowHtml;
    host.innerHTML = html;
    document.body.appendChild(host);

    return host.shadowRoot!.querySelector('slot')!;
  };

  describe('getSlottedText', () => {
    it('should return an empty string when the target is not a slot', () => {
      expect(getSlottedText(document.createElement('div'))).to.equal('');
    });

    it('should return an empty string when nothing is slotted', () => {
      expect(getSlottedText(slotWith(''))).to.equal('');
    });

    it('should return the slotted text', () => {
      expect(getSlottedText(slotWith('Hello world'))).to.equal('Hello world');
    });

    it('should trim the slotted text and collapse whitespace', () => {
      expect(getSlottedText(slotWith('  Hello \n  world  '))).to.equal('Hello world');
    });

    it('should combine the text of all assigned nodes', () => {
      expect(getSlottedText(slotWith('Hello <b>world</b>'))).to.equal('Hello world');
    });
  });

  describe('hasSlottedContent', () => {
    it('should return false when the target is null', () => {
      expect(hasSlottedContent(null)).to.equal(false);
    });

    it('should return false when the target is not a slot', () => {
      expect(hasSlottedContent(document.createElement('div'))).to.equal(false);
    });

    it('should return false when nothing is slotted', () => {
      expect(hasSlottedContent(slotWith(''))).to.equal(false);
    });

    it('should return true when only fallback content is rendered', () => {
      // `assignedNodes({ flatten: true })` returns the fallback content when nothing is slotted
      expect(hasSlottedContent(slotWith('', '<slot>Fallback</slot>'))).to.equal(true);
    });

    it('should return true when text is slotted', () => {
      expect(hasSlottedContent(slotWith('Hello world'))).to.equal(true);
    });

    it('should return true when an element is slotted', () => {
      expect(hasSlottedContent(slotWith('<b>Hello world</b>'))).to.equal(true);
    });

    it('should return true when only whitespace is slotted', () => {
      expect(hasSlottedContent(slotWith(' '))).to.equal(true);
    });

    it('should return false when the slotted content is assigned to another slot', () => {
      const slot = slotWith(
        '<span slot="foo">Hello world</span>',
        '<slot></slot><slot name="foo"></slot>'
      );

      expect(hasSlottedContent(slot)).to.equal(false);
    });
  });
});
