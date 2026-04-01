import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { describe, expect, it } from 'vitest';
import { ProxyAriaAttributesMixin } from '../mixins/proxy-aria-attributes-mixin.js';
import {
  getProxiedAccessibleName,
  getProxiedAriaAttribute,
  getProxiedAriaProperty,
  getProxiedDescription,
  isProxiedDisabled
} from './proxy-aria-attributes.js';

class SingleProxyElement extends ProxyAriaAttributesMixin(LitElement, [
  'aria-controls',
  'aria-describedby',
  'aria-description',
  'aria-disabled',
  'aria-expanded',
  'aria-label',
  'aria-labelledby'
]) {
  override render() {
    return html`<button><slot></slot></button>`;
  }

  override firstUpdated(): void {
    this.setProxyTarget(this.renderRoot.querySelector('button')!);
  }
}

class InnerProxyElement extends ProxyAriaAttributesMixin(LitElement, [
  'aria-describedby',
  'aria-description',
  'aria-disabled',
  'aria-label',
  'aria-labelledby'
]) {
  override render() {
    return html`<button><slot></slot></button>`;
  }

  override firstUpdated(): void {
    this.setProxyTarget(this.renderRoot.querySelector('button')!);
  }
}

class NestedProxyElement extends ProxyAriaAttributesMixin(LitElement, [
  'aria-describedby',
  'aria-description',
  'aria-disabled',
  'aria-label',
  'aria-labelledby'
]) {
  disabled = false;

  override render() {
    return html`<proxy-helper-inner><slot></slot></proxy-helper-inner>`;
  }

  override firstUpdated(): void {
    this.setProxyTarget(this.renderRoot.querySelector('proxy-helper-inner')!);
  }
}

try {
  customElements.define('proxy-helper-single', SingleProxyElement);
  customElements.define('proxy-helper-inner', InnerProxyElement);
  customElements.define('proxy-helper-nested', NestedProxyElement);
} catch {
  // Already defined
}

describe('proxy-aria-attributes helpers', () => {
  describe('single-level proxy', () => {
    let el: SingleProxyElement;

    describe('getProxiedAccessibleName', () => {
      it('should return slotted text content', async () => {
        el = await fixture(html`<proxy-helper-single>Click me</proxy-helper-single>`);

        expect(getProxiedAccessibleName(el)).to.equal('Click me');
      });

      it('should prefer aria-label over slotted content', async () => {
        el = await fixture(html`<proxy-helper-single aria-label="Label">Click me</proxy-helper-single>`);

        expect(getProxiedAccessibleName(el)).to.equal('Label');
      });

      it('should prefer aria-labelledby over aria-label', async () => {
        const div = await fixture(html`
          <div>
            <span id="single-lbl">External</span>
            <proxy-helper-single aria-labelledby="single-lbl" aria-label="Label">Click me</proxy-helper-single>
          </div>
        `);

        el = div.querySelector('proxy-helper-single')!;
        expect(getProxiedAccessibleName(el)).to.equal('External');
      });

      it('should return empty string when there is no label', async () => {
        el = await fixture(html`<proxy-helper-single></proxy-helper-single>`);

        expect(getProxiedAccessibleName(el)).to.equal('');
      });

      it('should join multiple aria-labelledby references', async () => {
        const div = await fixture(html`
          <div>
            <span id="lbl-a">First</span>
            <span id="lbl-b">Second</span>
            <proxy-helper-single aria-labelledby="lbl-a lbl-b">Click me</proxy-helper-single>
          </div>
        `);

        el = div.querySelector('proxy-helper-single')!;
        expect(getProxiedAccessibleName(el)).to.equal('First Second');
      });
    });

    describe('getProxiedDescription', () => {
      it('should return empty string when there is no description', async () => {
        el = await fixture(html`<proxy-helper-single>Click me</proxy-helper-single>`);

        expect(getProxiedDescription(el)).to.equal('');
      });

      it('should return aria-description value', async () => {
        el = await fixture(html`<proxy-helper-single aria-description="Helpful hint">Click me</proxy-helper-single>`);

        expect(getProxiedDescription(el)).to.equal('Helpful hint');
      });

      it('should return text from aria-describedby reference', async () => {
        const div = await fixture(html`
          <div>
            <span id="single-desc">Description text</span>
            <proxy-helper-single aria-describedby="single-desc">Click me</proxy-helper-single>
          </div>
        `);

        el = div.querySelector('proxy-helper-single')!;
        expect(getProxiedDescription(el)).to.equal('Description text');
      });

      it('should prefer aria-describedby over aria-description', async () => {
        const div = await fixture(html`
          <div>
            <span id="desc-prio">From describedby</span>
            <proxy-helper-single aria-describedby="desc-prio" aria-description="From description">
              Click me
            </proxy-helper-single>
          </div>
        `);

        el = div.querySelector('proxy-helper-single')!;
        expect(getProxiedDescription(el)).to.equal('From describedby');
      });
    });

    describe('getProxiedAriaAttribute', () => {
      it('should return the attribute value from the target', async () => {
        el = await fixture(html`<proxy-helper-single aria-expanded="true">Click me</proxy-helper-single>`);

        expect(getProxiedAriaAttribute(el, 'aria-expanded')).to.equal('true');
      });

      it('should return null when the attribute is not set', async () => {
        el = await fixture(html`<proxy-helper-single>Click me</proxy-helper-single>`);

        expect(getProxiedAriaAttribute(el, 'aria-expanded')).to.be.null;
      });
    });

    describe('getProxiedAriaProperty', () => {
      it('should return the property value from the target', async () => {
        const div = await fixture(html`
          <div>
            <div id="ctrl-target">Panel</div>
            <proxy-helper-single aria-controls="ctrl-target">Click me</proxy-helper-single>
          </div>
        `);

        el = div.querySelector('proxy-helper-single')!;

        const elements = getProxiedAriaProperty(el, 'ariaControlsElements' as keyof HTMLElement);
        expect(elements).to.deep.equal([div.querySelector('#ctrl-target')]);
      });
    });

    describe('isProxiedDisabled', () => {
      it('should return false when not disabled', async () => {
        el = await fixture(html`<proxy-helper-single>Click me</proxy-helper-single>`);

        expect(isProxiedDisabled(el)).to.equal(false);
      });

      it('should return true when the disabled property is set', async () => {
        el = await fixture(html`<proxy-helper-single>Click me</proxy-helper-single>`);
        (el as unknown as { disabled: boolean }).disabled = true;

        expect(isProxiedDisabled(el)).to.equal(true);
      });

      it('should return aria when aria-disabled is set', async () => {
        el = await fixture(html`<proxy-helper-single aria-disabled="true">Click me</proxy-helper-single>`);

        expect(isProxiedDisabled(el)).to.equal('aria');
      });
    });
  });

  describe('nested proxy chain', () => {
    let el: NestedProxyElement;

    describe('getProxiedAccessibleName', () => {
      it('should follow the proxy chain to the deepest target', async () => {
        el = await fixture(html`<proxy-helper-nested aria-label="Deep label">Click me</proxy-helper-nested>`);

        expect(getProxiedAccessibleName(el)).to.equal('Deep label');
      });

      it('should resolve aria-labelledby through the chain', async () => {
        const div = await fixture(html`
          <div>
            <span id="nested-lbl">Nested external</span>
            <proxy-helper-nested aria-labelledby="nested-lbl">Click me</proxy-helper-nested>
          </div>
        `);

        el = div.querySelector('proxy-helper-nested')!;
        expect(getProxiedAccessibleName(el)).to.equal('Nested external');
      });

      it('should fall back to slotted text content', async () => {
        el = await fixture(html`<proxy-helper-nested>Nested text</proxy-helper-nested>`);

        expect(getProxiedAccessibleName(el)).to.equal('Nested text');
      });
    });

    describe('getProxiedDescription', () => {
      it('should follow the proxy chain for aria-description', async () => {
        el = await fixture(html`
          <proxy-helper-nested aria-description="Deep description">Click me</proxy-helper-nested>
        `);

        expect(getProxiedDescription(el)).to.equal('Deep description');
      });

      it('should follow the proxy chain for aria-describedby', async () => {
        const div = await fixture(html`
          <div>
            <span id="nested-desc">Nested description</span>
            <proxy-helper-nested aria-describedby="nested-desc">Click me</proxy-helper-nested>
          </div>
        `);

        el = div.querySelector('proxy-helper-nested')!;
        expect(getProxiedDescription(el)).to.equal('Nested description');
      });
    });

    describe('isProxiedDisabled', () => {
      it('should return false when not disabled', async () => {
        el = await fixture(html`<proxy-helper-nested>Click me</proxy-helper-nested>`);

        expect(isProxiedDisabled(el)).to.equal(false);
      });

      it('should return true for native disabled', async () => {
        el = await fixture(html`<proxy-helper-nested>Click me</proxy-helper-nested>`);
        el.disabled = true;

        expect(isProxiedDisabled(el)).to.equal(true);
      });

      it('should follow the proxy chain for aria-disabled', async () => {
        el = await fixture(html`<proxy-helper-nested aria-disabled="true">Click me</proxy-helper-nested>`);

        expect(isProxiedDisabled(el)).to.equal('aria');
      });
    });
  });
});
