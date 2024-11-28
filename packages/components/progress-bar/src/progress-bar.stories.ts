import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/notification/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type ProgressBar } from './progress-bar.js';

type Props = Pick<ProgressBar, 'indeterminate' | 'label' | 'variant' | 'value'> & { slot?(): TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Progress bar',
  tags: ['preview'],
  args: {
    label: 'This is the label of progress bar',
    value: 60,
    indeterminate: false,
    variant: undefined
  },
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100
      }
    },
    variant: {
      control: 'inline-radio',
      options: [undefined, 'success', 'warning', 'error']
    },
    slot: {
      table: {
        disable: true
      }
    }
  },
  render: ({ indeterminate, variant, value, label, slot }) => {
    return html`
      <sl-progress-bar ?indeterminate=${indeterminate} .value=${value} .label=${label} .variant=${variant}>
        ${slot?.() ?? html`<span>Uploaded ${value}% of 100%</span>`}
      </sl-progress-bar>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Overflow: Story = {
  ...Basic,
  args: {
    label:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Nunc lobortis mattis aliquam faucibus purus in massa tempor nec. Tincidunt eget nullam non nisi est sit amet facilisis magna. ' +
      'Dignissim convallis aenean et tortor. Facilisis leo vel fringilla est ullamcorper. Mi proin sed libero enim sed faucibus turpis in. ' +
      'Ullamcorper malesuada proin libero nunc consequat interdum varius. Eget egestas purus viverra accumsan in nisl nisi scelerisque. ' +
      'Erat imperdiet sed euismod nisi porta. Pulvinar pellentesque habitant morbi tristique. Lobortis elementum nibh tellus molestie nunc non blandit massa enim.'
  },
  render: ({ indeterminate, variant, value, label }) => {
    setTimeout(() => {
      const progressBar = document.querySelector('sl-progress-bar') as ProgressBar,
        subtractButton = progressBar?.nextElementSibling,
        addButton = subtractButton?.nextElementSibling;

      addButton?.addEventListener('click', () => {
        const newValue = Math.min(100, progressBar.value + 5);
        progressBar.value = newValue;
        progressBar.requestUpdate();
      });

      subtractButton?.addEventListener('click', () => {
        const newValue = Math.max(0, progressBar.value - 5);
        progressBar.value = newValue;
        progressBar.requestUpdate();
      });
    });

    return html`
      <style>
        sl-progress-bar {
          margin-block-end: 32px;
        }
      </style>
      <sl-progress-bar ?indeterminate=${indeterminate} .value=${value} .label=${label} .variant=${variant}>
        <span>Uploaded ${value}% of 100%</span>
      </sl-progress-bar>
      <sl-button fill="outline" class="minus">Decrease</sl-button>
      <sl-button fill="outline" class="plus">Increase</sl-button>
    `;
  }
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Generating report',
    slot: () => html`<span>This may take a few minutes</span>`
  }
};

export const Download: StoryObj = {
  args: {
    ...Basic.args
  },
  argTypes: {
    label: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    },
    indeterminate: {
      table: {
        disable: true
      }
    },
    variant: {
      table: {
        disable: true
      }
    }
  },
  render: () => {
    let progressBar: ProgressBar, currentProgress: number;
    const helperText = 'Preparing download';
    setTimeout(() => {
      const size = 100;
      progressBar = document.querySelector('sl-progress-bar') as ProgressBar;
      setTimeout(() => {
        const interval = setInterval(() => {
          currentProgress = progressBar.value;
          const progressBarHelper = progressBar.querySelector('span.my-helper'),
            step = Math.random() * 8;

          const running = progressBar.value > 0;
          progressBarHelper!.innerHTML = running
            ? `Downloading ${progressBar.value.toFixed(1)}MB of ${size}MB`
            : 'Preparing download';
          if (currentProgress + step >= 100) {
            progressBar.value = 100;
            progressBarHelper!.innerHTML = 'Done';
          }
          progressBar.variant = progressBar.value >= 100 ? 'success' : undefined;
          if (currentProgress + step < size) {
            progressBar.removeAttribute('indeterminate');
            progressBar.value = Math.round(currentProgress + step);
            return currentProgress + step;
          } else {
            clearInterval(interval);
            return size;
          }
        }, 300);
      }, 6000);
    });
    return html` <style>
        #root-inner {
          display: flex;
          flex-direction: column;
          inline-size: 400px;
        }
      </style>
      <sl-progress-bar indeterminate label="File download">
        <span class="my-helper">${helperText}</span>
      </sl-progress-bar>`;
  }
};

export const All: StoryObj = {
  argTypes: {
    label: {
      table: {
        disable: true
      }
    },
    value: {
      table: {
        disable: true
      }
    },
    indeterminate: {
      table: {
        disable: true
      }
    },
    variant: {
      table: {
        disable: true
      }
    }
  },
  render: () => html`
    <style>
      #root-inner {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }
    </style>
    <h2>With label</h2>
    <sl-progress-bar value="20" label="Progress bar label in the default variant">
      <span>20% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="100" label="Progress bar label in the success variant" variant="success">
      <span>File downloaded</span>
    </sl-progress-bar>
    <sl-progress-bar value="40" label="Progress bar label in the warning variant" variant="warning">
      <span>40% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="50" label="Progress bar label in the error variant" variant="error">
      <span>50% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar indeterminate label="Progress bar label in the indeterminate state">
      <span>Preparing download</span>
    </sl-progress-bar>
    <h2>No label</h2>
    <sl-progress-bar value="20" aria-label="Progress bar label in the default variant">
      <span>20% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="100" variant="success" aria-label="Progress bar label in the success variant">
      <span>File uploaded</span>
    </sl-progress-bar>
    <sl-progress-bar value="40" variant="warning" aria-label="Progress bar label in the warning variant">
      <span>40% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="50" variant="error" aria-label="Progress bar label in the error variant">
      <span>50% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar indeterminate aria-label="Progress bar label in the indeterminate state">
      <span>Preparing download</span>
    </sl-progress-bar>
  `
};
