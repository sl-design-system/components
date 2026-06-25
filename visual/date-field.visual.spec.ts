import { takeSnapshot } from '@chromatic-com/vitest';
import { render } from 'lit';
import { describe, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { DateField as DateFieldStory } from './.storybook/stories/all.stories.js';

type DateFieldElement = HTMLElement & {
  updateComplete?: Promise<unknown>;
  renderRoot?: ShadowRoot;
};

const mountBasicStory = async () => {
  document.body.innerHTML = '';

  if (!DateFieldStory.render) {
    throw new Error('Expected visual all.stories DateField export to include a render function.');
  }

  render(DateFieldStory.render(), document.body);

  const dateField = document.querySelector('sl-date-field') as DateFieldElement | null;
  await dateField?.updateComplete;
};

const getDateField = (): DateFieldElement => {
  const dateField = document.querySelector('sl-date-field') as DateFieldElement | null;

  if (!dateField) {
    throw new Error('Expected sl-date-field to be rendered.');
  }

  return dateField;
};

const getPickerButton = (): HTMLElement => {
  const dateField = getDateField();
  const button = dateField.renderRoot?.querySelector('sl-field-button') as HTMLElement | null;

  if (!button) {
    throw new Error('Expected sl-field-button to be rendered inside sl-date-field.');
  }

  return button;
};

const waitForPopoverState = async (dateField: DateFieldElement, expectedOpen: boolean) => {
  let attempts = 0;

  while (attempts < 50) {
    const dialog = dateField.renderRoot?.querySelector('dialog');
    const isOpen = dialog?.matches(':popover-open') ?? false;
    if (isOpen === expectedOpen) {
      return;
    }

    await new Promise(resolve => requestAnimationFrame(resolve));
    attempts++;
  }

  throw new Error(
    `Timed out waiting for date-field popover state "${expectedOpen ? 'open' : 'closed'}".`
  );
};

describe('date-field visual', () => {
  it('opens on click and closes on escape', async () => {
    await mountBasicStory();

    const dateField = getDateField();
    const button = getPickerButton();

    await waitForPopoverState(dateField, false);

    await userEvent.click(button);
    await waitForPopoverState(dateField, true);

    await takeSnapshot('date-field-open');

    button.focus();
    await userEvent.keyboard('{Escape}');
    await waitForPopoverState(dateField, false);

    await takeSnapshot('date-field-closed-after-escape');
  });
});
