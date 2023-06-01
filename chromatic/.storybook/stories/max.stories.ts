import { All as AllButton} from "../../../packages/components/button/src/button.stories";
import { All as AllCheckbox} from "../../../packages/components/checkbox/src/checkbox.stories";
import { All as AllRadioGroup} from "../../../packages/components/radio-group/src/radio-group.stories";
import { html } from 'lit';
import { setTheme, setPseudoStates } from "../../utils/theme";

export default {
  title: 'Max',
  decorators: [
    (Story) => {
      return html`
        ${setTheme('max')}
        ${Story()}
        <div class="sb-fake-hover">
          ${Story()}
        </div>
        <div class="sb-fake-active">
          ${Story()}
        </div>
        <div class="sb-fake-focus-visible">
          ${Story()}
        </div>
        ${setPseudoStates()}`
    },
  ],
  args: {
    text: 'Button',
    icon: 'none',
    size: 'md',
    fill: 'default',
    variant: 'default'
  }
};

export const Button = AllButton;
export const Checkbox = AllCheckbox;
export const RadioGroup = AllRadioGroup;
