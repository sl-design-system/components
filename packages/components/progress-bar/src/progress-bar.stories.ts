import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type ProgressBar } from './progress-bar.js';

type Props = Pick<ProgressBar, 'indeterminate' | 'helperText' | 'label' | 'status' | 'value'> & { buttons: TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Components/Progress bar',
  tags: ['draft'],
  args: {
    label: 'This is the label of progress bar, what if it will be longer? Ellipsis? Or wrap?',
    helperText: 'This is an optional helper text',
    value: 60,
    indeterminate: false,
    status: 'active'
  },
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100
      }
    },
    status: {
      control: 'inline-radio',
      options: ['active', 'success', 'warning', 'error']
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'default'
    }
  },
  render: ({helperText, indeterminate, status, value, label}) => {
    // const increaseProgressBarValue = (value: number): number => {
    //   console.log('value', value);
    //   // const progressBar = document.getElementById("progress-bar"); // Replace with your actual progress bar element
    //   // let value = 0;
    //
    //   const intervalId = setInterval(() => {
    //     value += 1;
    //     // progressBar.style.width = `${value}%`;
    //     console.log('value2', value);
    //
    //     if (value >= 100) {
    //       clearInterval(intervalId);
    //       return 100;
    //     }
    //     return value;
    //   }, 1); // Change the interval duration as needed
    // }

// Call the function to start increasing the progress bar value
//     increaseProgressBarValue(value);

//     const increaseProgressBarValue = (value: number): number => {
//       console.log('value', value);
//
//       // Initialize the interval ID outside the setInterval callback
//       let intervalId: NodeJS.Timeout | null = null;
//
//       const incrementValue = () => {
//         value += 1;
//         console.log('value2', value);
//
//         if (value >= 100) {
//           clearInterval(intervalId!); // Use the non-null assertion operator
//           return 100;
//         }
//         return value;
//       };
//
//       // Start the interval
//       intervalId = setInterval(incrementValue, 10); // Change the interval duration as needed
//
//       return value; // Return the initial value
//     };
//
// // Example usage:
// //     const initialValue = 0;
//     const finalValue = increaseProgressBarValue(value);
//     console.log('Final value:', finalValue);

    setTimeout(() => {
      const progressBar = document.querySelector('sl-progress-bar') as ProgressBar;
      const subtractButton = progressBar?.nextElementSibling;
      const addButton = subtractButton?.nextElementSibling;
      console.log('progressBar', progressBar, subtractButton, addButton, document.querySelector('sl-progress-bar'));

      addButton?.addEventListener('click', () => {
        const value = Math.min(100, progressBar.value + 10);
        progressBar.value = value;
      });

      subtractButton?.addEventListener('click', () => {
        const value = Math.max(0, progressBar.value - 10);
        progressBar.value = value;
      });
    });

    return html`
    <style>
      @media (max-width: 600px) {
        sl-button-bar {
          --sl-button-bar-vertical: var(--sl-ON);
        }
      }
    </style>
    <sl-progress-bar .indeterminate=${indeterminate} .value=${value} .label=${label} .helperText='${helperText} blablabla ${value}% of 100%' .status=${status}>
      <span slot="helper">blablabla ${value}% of 100%</span>
    </sl-progress-bar>
    <sl-button class="minus">- Decrease</sl-button>
    <sl-button class="plus">+ Increase</sl-button>
  `}
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Alignment: Story = {
  render: () => {
    const buttons = html`
      <sl-button><sl-icon name="home-blank"></sl-icon> Foo</sl-button>
      <sl-button><sl-icon name="pinata"></sl-icon> Bar</sl-button>
      <sl-button><sl-icon name="smile"></sl-icon> Baz</sl-button>
    `;
    return html`
      <p>Start:</p>
      <sl-button-bar style="--sl-button-bar-align: start;"> ${buttons} </sl-button-bar>
      <p>End:</p>
      <sl-button-bar style="--sl-button-bar-align: end;"> ${buttons} </sl-button-bar>
      <p>Center:</p>
      <sl-button-bar style="--sl-button-bar-align: center;"> ${buttons} </sl-button-bar>
      <p>Space between:</p>
      <sl-button-bar style="--sl-button-bar-align: space-between;"> ${buttons} </sl-button-bar>
    `;
  }
};

export const Overflow: Story = {
  ...Basic,
  args: {
    label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
      'Nunc lobortis mattis aliquam faucibus purus in massa tempor nec. Tincidunt eget nullam non nisi est sit amet facilisis magna. ' +
      'Dignissim convallis aenean et tortor. Facilisis leo vel fringilla est ullamcorper. Mi proin sed libero enim sed faucibus turpis in. ' +
      'Ullamcorper malesuada proin libero nunc consequat interdum varius. Eget egestas purus viverra accumsan in nisl nisi scelerisque. ' +
      'Erat imperdiet sed euismod nisi porta. Pulvinar pellentesque habitant morbi tristique. Lobortis elementum nibh tellus molestie nunc non blandit massa enim.',
  }
};

export const Wrapping: Story = {
  args: {
    buttons: html`
      <sl-button>Lorem </sl-button>
      <sl-button>dolor</sl-button>
      <sl-button>sit</sl-button>
      <sl-button>amet</sl-button>
      <sl-button>officia</sl-button>
      <sl-button>esse</sl-button>
      <sl-button>sunt</sl-button>
      <sl-button>nulla</sl-button>
      <sl-button>et</sl-button>
      <sl-button>sint</sl-button>
      <sl-button>nostrud</sl-button>
      <sl-button>nisi</sl-button>
      <sl-button>ullamco</sl-button>
      <sl-button>ut</sl-button>
    `
  }
};

export const IconOnly: Story = {
  args: {
    buttons: html`
      <sl-button fill="ghost">
        <sl-icon name="home-blank"></sl-icon>
      </sl-button>
      <sl-button fill="ghost">
        <sl-icon name="pinata"></sl-icon>
      </sl-button>
      <sl-button fill="ghost">
        <sl-icon name="smile"></sl-icon>
      </sl-button>
    `
  }
};
