import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type ReactiveController, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { ElementInternalsMixin } from '../mixins/element-internals-mixin.js';
import { cssState } from './css-state.js';

class DecoratedElement extends ElementInternalsMixin(LitElement) {
  @cssState() @property({ type: Boolean }) checked?: boolean;

  @cssState() @state() hasDescription = false;

  @cssState('custom-name') @state() renamed = false;

  @state() hasLabel = false;

  @cssState('no-label')
  get noLabel(): boolean {
    return !this.hasLabel;
  }

  override render() {
    return html`<slot></slot>`;
  }
}

try {
  customElements.define('decorated-element', DecoratedElement);
} catch {
  // Element may already be defined in watch / repeated test runs
}

describe('cssState', () => {
  let el: DecoratedElement;

  beforeEach(async () => {
    el = await fixture(html`<decorated-element></decorated-element>`);
  });

  it('should share a single controller between all the decorated properties', () => {
    const controllers: ReactiveController[] = [];

    class CountingElement extends DecoratedElement {
      override addController(controller: ReactiveController): void {
        controllers.push(controller);
        super.addController(controller);
      }
    }

    try {
      customElements.define('decorated-counting-element', CountingElement);
    } catch {
      // Already defined
    }

    const counting = document.createElement('decorated-counting-element');
    document.body.append(counting);

    // The element decorates four properties, but they are all handled by one controller
    expect(
      controllers.filter(controller => controller.constructor.name === 'CssStateController')
    ).to.have.length(1);

    counting.remove();
  });

  it('should not set the state when the property is falsy', () => {
    expect(el).not.to.match(':state(checked)');
  });

  it('should set the state when the property becomes truthy', async () => {
    el.checked = true;
    await el.updateComplete;

    expect(el).to.match(':state(checked)');
  });

  it('should remove the state when the property becomes falsy again', async () => {
    el.checked = true;
    await el.updateComplete;

    el.checked = false;
    await el.updateComplete;

    expect(el).not.to.match(':state(checked)');
  });

  it('should use the dasherized property name as the state', async () => {
    el.hasDescription = true;
    await el.updateComplete;

    expect(el).to.match(':state(has-description)');
  });

  it('should use the given name instead of the property name', async () => {
    el.renamed = true;
    await el.updateComplete;

    expect(el).not.to.match(':state(renamed)');
    expect(el).to.match(':state(custom-name)');
  });

  it('should set the state from an attribute on the first render', async () => {
    const checked = await fixture<DecoratedElement>(
      html`<decorated-element checked></decorated-element>`
    );

    expect(checked).to.match(':state(checked)');
  });

  it('should support a getter', async () => {
    expect(el).to.match(':state(no-label)');

    el.hasLabel = true;
    await el.updateComplete;

    expect(el).not.to.match(':state(no-label)');
  });

  it('should toggle the state in standards mode', async () => {
    const states = new Set<string>(),
      host = await fixture<DecoratedElement>(html`<decorated-element></decorated-element>`);

    let value = false;

    // Mimic what a standard decorator does: register an initializer, then run it on the host
    const initializers: Array<(this: unknown) => void> = [];

    const decorate = cssState('standards') as (
      value: unknown,
      context: ClassFieldDecoratorContext
    ) => void;

    decorate(undefined, {
      kind: 'field',
      name: 'standards',
      static: false,
      private: false,
      access: { get: () => value },
      addInitializer: (initializer: (this: unknown) => void) => initializers.push(initializer)
    } as unknown as ClassFieldDecoratorContext);

    // The controller reads the internals through the getter, so point those at our own set
    Object.defineProperty(host.elementInternals, 'states', {
      get: () => states,
      configurable: true
    });

    initializers.forEach(initializer => initializer.call(host));

    value = true;
    host.requestUpdate();
    await host.updateComplete;

    expect(states.has('standards')).to.be.true;

    value = false;
    host.requestUpdate();
    await host.updateComplete;

    expect(states.has('standards')).to.be.false;
  });
});
