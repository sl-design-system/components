import { takeSnapshot } from '@chromatic-com/vitest';
import { render } from 'lit';
import { describe, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { TimeField as TimeFieldStory } from './.storybook/stories/all.stories.js';

type TimeFieldElement = HTMLElement & {
  updateComplete?: Promise<unknown>;
  renderRoot?: ShadowRoot;
};

const mountBasicStory = async () => {
  document.body.innerHTML = '';

  if (!TimeFieldStory.render) {
    throw new Error('Expected visual all.stories TimeField export to include a render function.');
  }

  render(TimeFieldStory.render(), document.body);

  const timeField = document.querySelector('sl-time-field') as TimeFieldElement | null;
  await timeField?.updateComplete;
};

const getTimeField = (): TimeFieldElement => {
  const timeField = document.querySelector('sl-time-field') as TimeFieldElement | null;

  if (!timeField) {
    throw new Error('Expected sl-time-field to be rendered.');
  }

  return timeField;
};

const getPickerButton = (): HTMLElement => {
  const timeField = getTimeField();
  const button = timeField.renderRoot?.querySelector('sl-field-button') as HTMLElement | null;

  if (!button) {
    throw new Error('Expected sl-field-button to be rendered inside sl-time-field.');
  }

  return button;
};

const waitForPopoverState = async (timeField: TimeFieldElement, expectedOpen: boolean) => {
  let attempts = 0;

  while (attempts < 50) {
    const dialog = timeField.renderRoot?.querySelector('dialog');
    const isOpen = dialog?.matches(':popover-open') ?? false;
    if (isOpen === expectedOpen) {
      return;
    }

    await new Promise(resolve => requestAnimationFrame(resolve));
    attempts++;
  }

  throw new Error(
    `Timed out waiting for time-field popover state "${expectedOpen ? 'open' : 'closed'}".`
  );
};

describe('time-field visual', () => {
  it('opens on click and closes on escape', async () => {
    await mountBasicStory();

    const timeField = getTimeField();
    const button = getPickerButton();

    await waitForPopoverState(timeField, false);

    await userEvent.click(button);
    await waitForPopoverState(timeField, true);

    await takeSnapshot('time-field-open');

    button.focus();
    await userEvent.keyboard('{Escape}');
    await waitForPopoverState(timeField, false);

    await takeSnapshot('time-field-closed-after-escape');
  });
});
