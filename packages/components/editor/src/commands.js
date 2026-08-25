import { AllSelection } from 'prosemirror-state';
import { createContentNode } from './utils.js';
export const setHTML = content => (state, dispatch) => {
  dispatch?.(
    state.tr
      .setSelection(new AllSelection(state.doc))
      .replaceSelectionWith(createContentNode(state.schema, content))
  );
  return true;
};
//# sourceMappingURL=commands.js.map
