import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ForwardAriaMixin } from './forward-aria-mixin.js';

class TestElement extends ForwardAriaMixin(LitElement, [
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-disabled',
  'aria-label',
  'aria-labelledby',
  'aria-owns'
]) {
  override render() {
    return html`<button><slot></slot></button>`;
  }

  override firstUpdated(): void {
    this.setProxyTarget(this.renderRoot.querySelector('button')!);
  }
}

try {
  customElements.define('forward-aria-test', TestElement);
} catch {
  // Element may already be defined in watch / repeated test runs
}

class NestedAriaDisabledElement extends ForwardAriaMixin(LitElement, ['aria-disabled']) {
  override render() {
    return html`<forward-aria-test>Click me</forward-aria-test>`;
  }

  override firstUpdated(): void {
    this.setProxyTarget(this.renderRoot.querySelector('forward-aria-test')!);
  }
}

try {
  customElements.define('forward-aria-nested-disabled-test', NestedAriaDisabledElement);
} catch {
  // Element may already be defined in watch / repeated test runs
}

describe('ForwardAriaMixin', () => {
  let el: TestElement, button: HTMLButtonElement;

  beforeEach(async () => {
    el = await fixture(html`<forward-aria-test>Click me</forward-aria-test>`);
    button = el.renderRoot.querySelector('button')!;
  });

  it('should include the observed attributes in the static observedAttributes', () => {
    expect(TestElement.observedAttributes).to.include('aria-activedescendant');
    expect(TestElement.observedAttributes).to.include('aria-controls');
    expect(TestElement.observedAttributes).to.include('aria-describedby');
    expect(TestElement.observedAttributes).to.include('aria-details');
    expect(TestElement.observedAttributes).to.include('aria-disabled');
    expect(TestElement.observedAttributes).to.include('aria-label');
    expect(TestElement.observedAttributes).to.include('aria-labelledby');
    expect(TestElement.observedAttributes).to.include('aria-owns');
  });

  it('should return the proxy target from getProxyTarget', () => {
    expect(el.getProxyTarget()).to.equal(button);
  });

  it('should return undefined from getProxyTarget before setProxyTarget is called', () => {
    const fresh = document.createElement('forward-aria-test') as TestElement;

    expect(fresh.getProxyTarget()).to.be.undefined;
  });

  it('should forward a plain attribute to the target element', () => {
    el.setAttribute('aria-disabled', 'true');

    expect(button).to.have.attribute('aria-disabled', 'true');
  });

  it('should remove the attribute from the host after forwarding', () => {
    el.setAttribute('aria-disabled', 'true');

    expect(el).not.to.have.attribute('aria-disabled');
  });

  it('should forward multiple plain attributes independently', () => {
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('aria-label', 'Test label');

    expect(button).to.have.attribute('aria-disabled', 'true');
    expect(button).to.have.attribute('aria-label', 'Test label');
  });

  it('should not forward attributes that are not in the observed list', () => {
    el.setAttribute('aria-hidden', 'true');

    expect(button).not.to.have.attribute('aria-hidden');
    expect(el).to.have.attribute('aria-hidden', 'true');
  });

  it('should not forward the attribute if no target element is set', async () => {
    class NoTargetElement extends ForwardAriaMixin(LitElement, ['aria-label']) {
      override render() {
        return html`<button><slot></slot></button>`;
      }
    }

    try {
      customElements.define('forward-aria-no-target-test', NoTargetElement);
    } catch {
      // Already defined
    }

    const noTargetEl = await fixture<NoTargetElement>(
      html`<forward-aria-no-target-test>Click</forward-aria-no-target-test>`
    );
    noTargetEl.setAttribute('aria-label', 'Test');

    expect(noTargetEl).to.have.attribute('aria-label', 'Test');
    expect(noTargetEl.renderRoot.querySelector('button')).not.to.have.attribute('aria-label');
  });

  it('should update the target element when the attribute value changes', () => {
    el.setAttribute('aria-label', 'First');

    expect(button).to.have.attribute('aria-label', 'First');

    el.setAttribute('aria-label', 'Second');

    expect(button).to.have.attribute('aria-label', 'Second');
  });

  describe('ariaDisabled property', () => {
    it('should set aria-disabled on the target when set to "true"', () => {
      el.ariaDisabled = 'true';

      expect(button).to.have.attribute('aria-disabled', 'true');
    });

    it('should not set aria-disabled on the host when set to "true"', () => {
      el.ariaDisabled = 'true';

      expect(el).not.to.have.attribute('aria-disabled');
    });

    it('should remove aria-disabled from the target when set to null', () => {
      el.ariaDisabled = 'true';
      el.ariaDisabled = null;

      expect(button).not.to.have.attribute('aria-disabled');
    });

    it('should reflect the stored value via the getter', () => {
      el.ariaDisabled = 'true';
      expect(el.ariaDisabled).to.equal('true');

      el.ariaDisabled = null;
      expect(el.ariaDisabled).to.be.null;
    });

    it('should flush to the target when set before setProxyTarget is called', async () => {
      class DeferredTargetElement extends ForwardAriaMixin(LitElement, ['aria-disabled']) {
        override render() {
          // eslint-disable-next-line lit-a11y/accessible-name
          return html`<button></button>`;
        }
        // Does NOT call setProxyTarget — caller sets it manually
      }

      try {
        customElements.define('forward-aria-deferred', DeferredTargetElement);
      } catch {
        // Already defined
      }

      const deferredEl = document.createElement('forward-aria-deferred') as InstanceType<
        typeof DeferredTargetElement
      >;
      deferredEl.ariaDisabled = 'true';
      document.body.appendChild(deferredEl);
      await deferredEl.updateComplete;

      const btn = deferredEl.renderRoot.querySelector('button')!;

      // Target not registered yet — property was buffered, button is untouched
      expect(btn).not.to.have.attribute('aria-disabled');

      deferredEl.setProxyTarget(btn);

      expect(btn).to.have.attribute('aria-disabled', 'true');

      deferredEl.remove();
    });

    it('should clear aria-disabled from a nested proxy target', async () => {
      const nestedEl = await fixture<NestedAriaDisabledElement>(
          html`<forward-aria-nested-disabled-test></forward-aria-nested-disabled-test>`
        ),
        innerEl = nestedEl.renderRoot.querySelector<TestElement>('forward-aria-test')!,
        innerButton = innerEl.renderRoot.querySelector('button')!;

      nestedEl.ariaDisabled = 'true';

      expect(innerButton).to.have.attribute('aria-disabled', 'true');

      nestedEl.ariaDisabled = null;

      expect(innerButton).not.to.have.attribute('aria-disabled');
    });
  });

  describe('aria-labelledby', () => {
    it('should set ariaLabelledByElements on the target', () => {
      const label = document.createElement('span');
      label.id = 'my-label';
      label.textContent = 'My label';
      el.parentElement!.prepend(label);

      el.setAttribute('aria-labelledby', 'my-label');

      expect(button.ariaLabelledByElements).to.deep.equal([label]);

      label.remove();
    });

    it('should remove the aria-labelledby attribute from the host', () => {
      const label = document.createElement('span');
      label.id = 'my-label';
      label.textContent = 'My label';
      el.parentElement!.prepend(label);

      el.setAttribute('aria-labelledby', 'my-label');

      expect(el).not.to.have.attribute('aria-labelledby');

      label.remove();
    });

    it('should resolve multiple space-separated IDs', () => {
      const label1 = document.createElement('span');
      label1.id = 'label-1';
      label1.textContent = 'First';

      const label2 = document.createElement('span');
      label2.id = 'label-2';
      label2.textContent = 'Second';

      el.parentElement!.prepend(label1, label2);

      el.setAttribute('aria-labelledby', 'label-1 label-2');

      expect(button.ariaLabelledByElements).to.deep.equal([label1, label2]);

      label1.remove();
      label2.remove();
    });

    it('should set an empty array when the referenced element does not exist', () => {
      el.setAttribute('aria-labelledby', 'nonexistent');

      expect(button.ariaLabelledByElements).to.deep.equal([]);
    });
  });

  describe('aria-describedby', () => {
    it('should set ariaDescribedByElements on the target', () => {
      const desc = document.createElement('span');
      desc.id = 'my-desc';
      desc.textContent = 'Description';
      el.parentElement!.prepend(desc);

      el.setAttribute('aria-describedby', 'my-desc');

      expect(button.ariaDescribedByElements).to.deep.equal([desc]);

      desc.remove();
    });

    it('should remove the aria-describedby attribute from the host', () => {
      const desc = document.createElement('span');
      desc.id = 'my-desc';
      desc.textContent = 'Description';
      el.parentElement!.prepend(desc);

      el.setAttribute('aria-describedby', 'my-desc');

      expect(el).not.to.have.attribute('aria-describedby');

      desc.remove();
    });
  });

  describe('aria-controls', () => {
    it('should set ariaControlsElements on the target', () => {
      const panel = document.createElement('div');
      panel.id = 'my-panel';
      el.parentElement!.prepend(panel);

      el.setAttribute('aria-controls', 'my-panel');

      expect(button.ariaControlsElements).to.deep.equal([panel]);

      panel.remove();
    });

    it('should remove the aria-controls attribute from the host', () => {
      const panel = document.createElement('div');
      panel.id = 'my-panel';
      el.parentElement!.prepend(panel);

      el.setAttribute('aria-controls', 'my-panel');

      expect(el).not.to.have.attribute('aria-controls');

      panel.remove();
    });
  });

  describe('aria-owns', () => {
    it('should set ariaOwnsElements on the target', () => {
      const owned = document.createElement('div');
      owned.id = 'my-owned';
      el.parentElement!.prepend(owned);

      el.setAttribute('aria-owns', 'my-owned');

      expect(button.ariaOwnsElements).to.deep.equal([owned]);

      owned.remove();
    });

    it('should remove the aria-owns attribute from the host', () => {
      const owned = document.createElement('div');
      owned.id = 'my-owned';
      el.parentElement!.prepend(owned);

      el.setAttribute('aria-owns', 'my-owned');

      expect(el).not.to.have.attribute('aria-owns');

      owned.remove();
    });
  });

  describe('aria-details', () => {
    it('should set ariaDetailsElements on the target', () => {
      const details = document.createElement('div');
      details.id = 'my-details';
      el.parentElement!.prepend(details);

      el.setAttribute('aria-details', 'my-details');

      expect(button.ariaDetailsElements).to.deep.equal([details]);

      details.remove();
    });

    it('should remove the aria-details attribute from the host', () => {
      const details = document.createElement('div');
      details.id = 'my-details';
      el.parentElement!.prepend(details);

      el.setAttribute('aria-details', 'my-details');

      expect(el).not.to.have.attribute('aria-details');

      details.remove();
    });
  });

  describe('aria-activedescendant', () => {
    it('should set ariaActiveDescendantElement on the target', () => {
      const option = document.createElement('div');
      option.id = 'my-option';
      el.parentElement!.prepend(option);

      el.setAttribute('aria-activedescendant', 'my-option');

      expect(button.ariaActiveDescendantElement).to.equal(option);

      option.remove();
    });

    it('should remove the aria-activedescendant attribute from the host', () => {
      const option = document.createElement('div');
      option.id = 'my-option';
      el.parentElement!.prepend(option);

      el.setAttribute('aria-activedescendant', 'my-option');

      expect(el).not.to.have.attribute('aria-activedescendant');

      option.remove();
    });
  });

  describe('nested mixin', () => {
    class InnerElement extends ForwardAriaMixin(LitElement, ['aria-labelledby']) {
      override render() {
        return html`<button><slot></slot></button>`;
      }

      override firstUpdated(): void {
        this.setProxyTarget(this.renderRoot.querySelector('button')!);
      }
    }

    class OuterElement extends ForwardAriaMixin(LitElement, ['aria-labelledby']) {
      override render() {
        return html`<forward-aria-inner><slot></slot></forward-aria-inner>`;
      }

      override firstUpdated(): void {
        this.setProxyTarget(this.renderRoot.querySelector('forward-aria-inner')!);
      }
    }

    try {
      customElements.define('forward-aria-inner', InnerElement);
      customElements.define('forward-aria-outer', OuterElement);
    } catch {
      // Already defined
    }

    it('should set ariaLabelledByElements on the deepest target element', async () => {
      const label = document.createElement('span');
      label.id = 'nested-label';
      label.textContent = 'Nested label';
      document.body.prepend(label);

      const outer = await fixture<OuterElement>(
        html`<forward-aria-outer>Click me</forward-aria-outer>`
      );
      const inner = outer.renderRoot.querySelector('forward-aria-inner') as InnerElement;
      const deepButton = inner.renderRoot.querySelector('button')!;

      outer.setAttribute('aria-labelledby', 'nested-label');

      expect(deepButton.ariaLabelledByElements).to.deep.equal([label]);

      label.remove();
    });
  });

  describe('removeAttribute', () => {
    it('should remove a plain attribute from the proxy target', () => {
      el.setAttribute('aria-label', 'Test label');
      el.removeAttribute('aria-label');

      expect(button).not.to.have.attribute('aria-label');
    });

    it('should remove aria-disabled from the proxy target', () => {
      el.setAttribute('aria-disabled', 'true');
      el.removeAttribute('aria-disabled');

      expect(button).not.to.have.attribute('aria-disabled');
    });

    it('should clear element references from the proxy target', () => {
      const label = document.createElement('span');
      label.id = 'remove-label';
      el.parentElement!.prepend(label);

      el.setAttribute('aria-labelledby', 'remove-label');
      el.removeAttribute('aria-labelledby');

      expect(button.ariaLabelledByElements).to.be.null;

      label.remove();
    });

    it('should not affect the proxy for attributes not in the observed list', () => {
      button.setAttribute('aria-hidden', 'true');
      el.removeAttribute('aria-hidden');

      expect(button).to.have.attribute('aria-hidden', 'true');

      button.removeAttribute('aria-hidden');
    });
  });

  describe('element references', () => {
    let labelA: HTMLElement, labelB: HTMLElement;

    beforeEach(() => {
      labelA = document.createElement('span');
      labelA.id = 'ref-label-a';
      labelB = document.createElement('span');
      labelB.id = 'ref-label-b';
      el.parentElement!.prepend(labelA, labelB);
    });

    afterEach(() => {
      labelA.remove();
      labelB.remove();
    });

    it('should replace previously forwarded references when the attribute changes', () => {
      el.setAttribute('aria-labelledby', 'ref-label-a');
      el.setAttribute('aria-labelledby', 'ref-label-b');

      expect(button.ariaLabelledByElements).to.have.members([labelB]);
    });

    it('should not duplicate references when the same value is forwarded twice', () => {
      el.setAttribute('aria-labelledby', 'ref-label-a');
      el.setAttribute('aria-labelledby', 'ref-label-a');

      expect(button.ariaLabelledByElements).to.have.members([labelA]);
    });

    it('should preserve references added by others when forwarding', () => {
      button.ariaLabelledByElements = [labelB];

      el.setAttribute('aria-labelledby', 'ref-label-a');

      expect(button.ariaLabelledByElements).to.have.members([labelB, labelA]);
    });

    it('should preserve references added by others when the attribute is removed', () => {
      button.ariaLabelledByElements = [labelB];

      el.setAttribute('aria-labelledby', 'ref-label-a');
      el.removeAttribute('aria-labelledby');

      expect(button.ariaLabelledByElements).to.have.members([labelB]);
    });

    it('should replay stored references when the target is set again', () => {
      el.ariaLabelledByElements = [labelA];

      el.setProxyTarget(button);

      expect(button.ariaLabelledByElements).to.have.members([labelA]);
    });

    it('should not replay empty references when the target is set again', () => {
      // Something assigned an empty array earlier, e.g. a tooltip removing a relation it never
      // added. Replaying that would wipe the references the target set on itself.
      el.ariaLabelledByElements = [];
      button.setAttribute('aria-labelledby', 'ref-label-b');

      el.setProxyTarget(button);

      expect(button).to.have.attribute('aria-labelledby', 'ref-label-b');
    });

    it('should not replay null references when the target is set again', () => {
      el.ariaLabelledByElements = null;
      button.setAttribute('aria-labelledby', 'ref-label-b');

      el.setProxyTarget(button);

      expect(button).to.have.attribute('aria-labelledby', 'ref-label-b');
    });
  });

  describe('no observedAttributes specified', () => {
    let defaultEl: InstanceType<typeof DefaultElement>, defaultButton: HTMLButtonElement;

    class DefaultElement extends ForwardAriaMixin(LitElement) {
      override render() {
        return html`<button><slot></slot></button>`;
      }

      override firstUpdated(): void {
        this.setProxyTarget(this.renderRoot.querySelector('button')!);
      }
    }

    try {
      customElements.define('forward-aria-default-test', DefaultElement);
    } catch {
      // Already defined
    }

    beforeEach(async () => {
      defaultEl = await fixture(
        html`<forward-aria-default-test>Click me</forward-aria-default-test>`
      );
      defaultButton = defaultEl.renderRoot.querySelector('button')!;
    });

    it('should forward any aria-* attribute to the target', async () => {
      defaultEl.setAttribute('aria-disabled', 'true');

      // MutationObserver callbacks are async
      await new Promise(resolve => setTimeout(resolve));

      expect(defaultButton).to.have.attribute('aria-disabled', 'true');
      expect(defaultEl).not.to.have.attribute('aria-disabled');
    });

    it('should resolve aria-labelledby to ariaLabelledByElements', async () => {
      const label = document.createElement('span');
      label.id = 'default-label';
      label.textContent = 'Label';
      defaultEl.parentElement!.prepend(label);

      defaultEl.setAttribute('aria-labelledby', 'default-label');

      // MutationObserver callbacks are async
      await new Promise(resolve => setTimeout(resolve));

      expect(defaultButton.ariaLabelledByElements).to.deep.equal([label]);
      expect(defaultEl).not.to.have.attribute('aria-labelledby');

      label.remove();
    });

    it('should clear the target when the attribute is set and removed before the observer runs', async () => {
      defaultEl.setAttribute('aria-label', 'Forwarded');
      await new Promise(resolve => setTimeout(resolve));

      // Both happen before the MutationObserver gets a chance to forward the new value, so the
      // attribute the host removes here was never forwarded to the target.
      defaultEl.setAttribute('aria-label', 'Never forwarded');
      defaultEl.removeAttribute('aria-label');
      await new Promise(resolve => setTimeout(resolve));

      expect(defaultButton).not.to.have.attribute('aria-label');
    });

    it('should clear element references when the attribute is set and removed before the observer runs', async () => {
      const labelA = document.createElement('span'),
        labelB = document.createElement('span');

      labelA.id = 'default-ref-a';
      labelB.id = 'default-ref-b';
      defaultEl.parentElement!.prepend(labelA, labelB);

      defaultEl.setAttribute('aria-labelledby', 'default-ref-a');
      await new Promise(resolve => setTimeout(resolve));

      defaultEl.setAttribute('aria-labelledby', 'default-ref-b');
      defaultEl.removeAttribute('aria-labelledby');
      await new Promise(resolve => setTimeout(resolve));

      expect(defaultButton.ariaLabelledByElements).to.be.null;

      labelA.remove();
      labelB.remove();
    });

    it('should forward pre-existing aria-* attributes after the target is set', async () => {
      const el = document.createElement('forward-aria-default-test') as InstanceType<
        typeof DefaultElement
      >;
      el.setAttribute('aria-label', 'Pre-existing');
      el.textContent = 'Click me';

      document.body.appendChild(el);
      await el.updateComplete;

      const btn = el.renderRoot.querySelector('button')!;

      expect(btn).to.have.attribute('aria-label', 'Pre-existing');
      expect(el).not.to.have.attribute('aria-label');

      el.remove();
    });
  });

  describe('data-label-id', () => {
    let labelEl: InstanceType<typeof LabelIdElement>,
      labelButton: HTMLButtonElement,
      label: HTMLLabelElement;

    // Mirrors how the form controls apply the mixin: no explicit list of attributes, so the
    // MutationObserver picks up the attribute <sl-label> sets on the control.
    class LabelIdElement extends ForwardAriaMixin(LitElement) {
      override render() {
        return html`<button><slot></slot></button>`;
      }

      override firstUpdated(): void {
        this.setProxyTarget(this.renderRoot.querySelector('button')!);
      }
    }

    try {
      customElements.define('forward-aria-label-id-test', LabelIdElement);
    } catch {
      // Already defined
    }

    class ExplicitLabelIdElement extends ForwardAriaMixin(LitElement, [
      'aria-labelledby',
      'data-label-id'
    ]) {
      override render() {
        return html`<button><slot></slot></button>`;
      }

      override firstUpdated(): void {
        this.setProxyTarget(this.renderRoot.querySelector('button')!);
      }
    }

    try {
      customElements.define('forward-aria-explicit-label-id-test', ExplicitLabelIdElement);
    } catch {
      // Already defined
    }

    beforeEach(async () => {
      labelEl = await fixture(
        html`<forward-aria-label-id-test>Click me</forward-aria-label-id-test>`
      );
      labelButton = labelEl.renderRoot.querySelector('button')!;

      label = document.createElement('label');
      label.id = 'sl-label-test';
      label.textContent = 'Label';
      labelEl.parentElement!.prepend(label);
    });

    afterEach(() => label.remove());

    it('should forward the label to the target as an element reference', async () => {
      labelEl.setAttribute('data-label-id', 'sl-label-test');
      await new Promise(resolve => setTimeout(resolve));

      expect(labelButton.ariaLabelledByElements).to.deep.equal([label]);
    });

    it('should leave the attribute on the host', async () => {
      labelEl.setAttribute('data-label-id', 'sl-label-test');
      await new Promise(resolve => setTimeout(resolve));

      expect(labelEl).to.have.attribute('data-label-id', 'sl-label-test');
    });

    it('should forward an attribute that is already there when the target is set', async () => {
      const el = document.createElement('forward-aria-label-id-test') as InstanceType<
        typeof LabelIdElement
      >;
      el.setAttribute('data-label-id', 'sl-label-test');
      el.textContent = 'Click me';

      document.body.appendChild(el);
      await el.updateComplete;

      expect(el.renderRoot.querySelector('button')!.ariaLabelledByElements).to.deep.equal([label]);

      el.remove();
    });

    it('should update the reference when another label is set', async () => {
      const other = document.createElement('label');
      other.id = 'sl-label-other';
      other.textContent = 'Other label';
      labelEl.parentElement!.prepend(other);

      labelEl.setAttribute('data-label-id', 'sl-label-test');
      await new Promise(resolve => setTimeout(resolve));

      labelEl.setAttribute('data-label-id', 'sl-label-other');
      await new Promise(resolve => setTimeout(resolve));

      expect(labelButton.ariaLabelledByElements).to.deep.equal([other]);

      other.remove();
    });

    it('should clear the reference when the attribute is removed', async () => {
      labelEl.setAttribute('data-label-id', 'sl-label-test');
      await new Promise(resolve => setTimeout(resolve));

      labelEl.removeAttribute('data-label-id');
      await new Promise(resolve => setTimeout(resolve));

      expect(labelButton.ariaLabelledByElements).to.be.null;
    });

    it('should set an empty array when the label does not exist', async () => {
      labelEl.setAttribute('data-label-id', 'nonexistent');
      await new Promise(resolve => setTimeout(resolve));

      expect(labelButton.ariaLabelledByElements).to.deep.equal([]);
    });

    it('should keep references added by others', async () => {
      const tooltip = document.createElement('span');
      tooltip.id = 'sl-tooltip-test';
      labelEl.parentElement!.prepend(tooltip);

      labelButton.ariaLabelledByElements = [tooltip];

      labelEl.setAttribute('data-label-id', 'sl-label-test');
      await new Promise(resolve => setTimeout(resolve));

      expect(labelButton.ariaLabelledByElements).to.have.members([tooltip, label]);

      tooltip.remove();
    });

    it('should keep an aria-labelledby forwarded alongside it', async () => {
      const other = document.createElement('span');
      other.id = 'sl-labelledby-test';
      labelEl.parentElement!.prepend(other);

      labelEl.setAttribute('aria-labelledby', 'sl-labelledby-test');
      labelEl.setAttribute('data-label-id', 'sl-label-test');
      await new Promise(resolve => setTimeout(resolve));

      expect(labelButton.ariaLabelledByElements).to.have.members([other, label]);

      other.remove();
    });

    it('should not affect a forwarded aria-describedby', async () => {
      const description = document.createElement('span');
      description.id = 'sl-hint-test';
      labelEl.parentElement!.prepend(description);

      labelEl.setAttribute('aria-describedby', 'sl-hint-test');
      labelEl.setAttribute('data-label-id', 'sl-label-test');
      await new Promise(resolve => setTimeout(resolve));

      expect(labelButton.ariaDescribedByElements).to.deep.equal([description]);
      expect(labelButton.ariaLabelledByElements).to.deep.equal([label]);

      description.remove();
    });

    it('should forward the label when it is in the list of observed attributes', async () => {
      const explicit = document.createElement(
        'forward-aria-explicit-label-id-test'
      ) as InstanceType<typeof ExplicitLabelIdElement>;

      explicit.textContent = 'Click me';
      document.body.appendChild(explicit);
      await explicit.updateComplete;

      // No MutationObserver involved, so this is forwarded synchronously
      explicit.setAttribute('data-label-id', 'sl-label-test');

      expect(explicit.renderRoot.querySelector('button')!.ariaLabelledByElements).to.deep.equal([
        label
      ]);

      explicit.remove();
    });
  });
});
