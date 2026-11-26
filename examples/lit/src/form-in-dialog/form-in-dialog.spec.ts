import { type Announcer } from '@sl-design-system/announcer';
import { type Button } from '@sl-design-system/button';
import { type TextField } from '@sl-design-system/text-field';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { FormInDialog } from './form-in-dialog.js';

if (!customElements.get('example-form-in-dialog-test')) {
  customElements.define('example-form-in-dialog-test', FormInDialog);
}

describe('example-form-in-dialog', () => {
  it('should announce validation errors inside the modal dialog', async () => {
    const el = await fixture<FormInDialog>(
      html`<example-form-in-dialog-test></example-form-in-dialog-test>`
    );
    el.showModal();

    await expect
      .poll(() => el.renderRoot.querySelector<TextField>('sl-text-field[name="type"]')?.value)
      .to.equal('Small');
    const field = el.renderRoot.querySelector<TextField>('sl-text-field[name="type"]')!;
    await userEvent.clear(page.elementLocator(field.formControlElement));

    const save = Array.from(el.renderRoot.querySelectorAll<Button>('sl-button')).find(
      button => button.textContent?.trim() === 'Save'
    )!;
    await userEvent.click(page.elementLocator(save));

    await expect
      .poll(() =>
        (
          el.dialog
            ?.querySelector<Announcer>('sl-announcer')
            ?.renderRoot.querySelector('[aria-live="assertive"]')?.textContent ?? ''
        ).replace(/\s+/g, ' ')
      )
      .to.contain('The following fields have errors: Type.');

    expect(el.dialog?.matches(':modal')).to.be.true;
    expect(field.valid).to.be.false;
  });
});
