import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type ProgressBar } from './progress-bar.js';

type Props = Pick<ProgressBar, 'indeterminate' | 'label' | 'state' | 'value'> & { buttons: TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Components/Progress bar',
  tags: ['draft'],
  args: {
    label: 'This is the label of progress bar, what if it will be longer? Ellipsis? Or wrap?',
    // helperText: 'This is an optional helper text',
    value: 60,
    indeterminate: false,
    state: 'active'
  },
  argTypes: {
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100
      }
    },
    state: {
      control: 'inline-radio',
      options: ['active', 'success', 'warning', 'error']
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'default'
    }
  },
  render: ({indeterminate, state, value, label}) => {
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
        progressBar.value = value; // TODO: needs to update helper text as well
        progressBar.requestUpdate();
      });

      subtractButton?.addEventListener('click', () => {
        const value = Math.max(0, progressBar.value - 10);
        progressBar.value = value;
        progressBar.requestUpdate();
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
    <sl-progress-bar .indeterminate=${indeterminate} .value=${value} .label=${label} .state=${state}>
      <span>Uploaded ${value}% of 100%</span>
    </sl-progress-bar>
    <sl-button fill="outline" class="minus">- Decrease</sl-button>
    <sl-button fill="outline" class="plus">+ Increase</sl-button>
  `}
} satisfies Meta<Props>;

export const Basic: Story = {};

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

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  }
};

// export const Example: StoryObj = {
//   args: {
//   ...Basic.args
//   },
//   render: () => {
//     let progressBar: ProgressBar;
//     let helperText: string;
//     let currentProgress: number;
//     setTimeout(() => {
//       const size = 728;
//       progressBar = document.querySelector('sl-progress-bar') as ProgressBar;
//       // const [progress, setProgress] = useState(0);
//
//       // incrementCount() {
//       //   this.count += 1;
//       //   this.requestUpdate(); // Trigger Lit Element to re-render
//       // }
//
//       //useEffect(() => {
//       setTimeout(() => {
//         // const progressBar = document.querySelector('sl-progress-bar') as ProgressBar;
//         const interval = setInterval(() => {
//           currentProgress = progressBar.value;
//           const advancement = Math.random() * 8;
//           if (currentProgress + advancement < size) {
//             return currentProgress + advancement;
//           } else {
//             clearInterval(interval);
//             return size;
//           }
//         }, 50);
//       }, 3000);
//       //}, []);
//       const running = progressBar.value > 0;
//       helperText = running ? `${progressBar.value.toFixed(1)}MB of ${size}MB` : 'Fetching assets...';
//       if (progressBar.value >= size) {
//         helperText = 'Done';
//       }
//     });
//     return html`
//       <sl-progress-bar .value=${currentProgress > 0 ? currentProgress : null} max={size}
//                        .state={progress === size ? 'success' : 'active'} label="Export data">
//       <span>${helperText}</span>
//       </sl-progress-bar>`}
// };

// export const Example2 = () => {
//   const size = 728;
//   let progress = 0;
//
//   const updateProgress = () => {
//     const advancement = Math.random() * 8;
//     if (progress + advancement < size) {
//       progress += advancement;
//     } else {
//       clearInterval(interval);
//       progress = size;
//     }
//     // Trigger Lit Element to re-render
//     document.querySelector('progress-bar').value = progress;
//   };
//
//   const interval = setInterval(updateProgress, 50);
//
//   const running = progress > 0;
//   let helperText = running ? `${progress.toFixed(1)}MB of ${size}MB` : 'Fetching assets...';
//   if (progress >= size) {
//     helperText = 'Done';
//   }
//
//   return html`
//         <sl-progress-bar
//             .value="${running ? progress : null}"
//             .max="${size}"
//             .status="${progress === size ? 'finished' : 'active'}"
//             label="Export data"
//             helperText="${helperText}"
//         ></sl-progress-bar>
//     `;
// };

export const All: StoryObj = {
  args: {
    ...Basic.args
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
    <sl-progress-bar value="20" label="Progress bar label in the active state" state="active">
      <span>20% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="30" label="Progress bar label in the success state" state="success">
      <span>30% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="40" label="Progress bar label in the warning state" state="warning">
      <span>40% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="50" label="Progress bar label in the error state" state="error">
      <span>50% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar indeterminate label="Progress bar label in the indeterminate state">
      <span">Preparing download</span>
    </sl-progress-bar>
    <h2>No label</h2>
    <sl-progress-bar value="20" state="active">
      <span>20% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="30" state="success">
      <span>30% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="40" state="warning">
      <span>40% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar value="50" state="error">
      <span>50% of 100%</span>
    </sl-progress-bar>
    <sl-progress-bar indeterminate>
      <span">Preparing download</span>
    </sl-progress-bar>
  `
};

// TODO: increase and decrease buttons only in one story

