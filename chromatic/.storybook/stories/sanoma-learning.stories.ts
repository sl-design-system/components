import { All as AllButton} from "../../../packages/components/button/src/button.stories";
import { All as AllCheckbox} from "../../../packages/components/checkbox/src/checkbox.stories";
import { All as AllRadioGroup} from "../../../packages/components/radio-group/src/radio-group.stories";

export default {
  title: 'Sanoma Learning',
  args: {theme:'sanoma-learning'}
};

export const Button = AllButton;
export const Checkbox = AllCheckbox;
export const RadioGroup = AllRadioGroup;
