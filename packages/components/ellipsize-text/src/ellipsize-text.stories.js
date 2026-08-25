import { html } from 'lit';
import '../register.js';
export default {
  title: 'Utilities/Ellipsize Text',
  render: ({ text, width }) =>
    html`<sl-ellipsize-text style="width: ${width}px">${text}</sl-ellipsize-text>`
};
export const Basic = {
  args: {
    width: 200,
    text: 'This is a long text that should be truncated'
  }
};
//# sourceMappingURL=ellipsize-text.stories.js.map
