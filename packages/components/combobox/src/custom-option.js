import { Option } from '@sl-design-system/listbox';
import styles from './custom-option.scss.js';
export class CustomOption extends Option {
  static {
    /** @internal */
    this.styles = [Option.styles, styles];
  }
}
//# sourceMappingURL=custom-option.js.map
