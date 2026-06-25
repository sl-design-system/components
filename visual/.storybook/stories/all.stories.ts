import menuButtonMeta, {
  Submenu as MenuStory
} from '../../../packages/components/menu/src/menu-button.stories';
import dialogMeta, {
  Basic as DialogStory
} from '../../../packages/components/dialog/src/dialog.stories';
import singleComboboxMeta, {
  Basic as SingleComboboxStory
} from '../../../packages/components/combobox/src/single.stories.ts';
import multipleComboboxMeta, {
  Basic as MultipleComboboxStory
} from '../../../packages/components/combobox/src/multiple.stories.ts';
import dateFieldMeta, {
  Basic as DateFieldStory
} from '../../../packages/components/date-field/src/date-field.stories';
import selectMeta, {
  Basic as SelectStory
} from '../../../packages/components/select/src/select.stories';
import timeFieldMeta, {
  Basic as TimeFieldStory
} from '../../../packages/components/time-field/src/time-field.stories';
import panelMeta, {
  OverflowActions as PanelStory
} from '../../../packages/components/panel/src/panel.stories';
import treeMeta, { Buttons as TreeStory } from '../../../packages/components/tree/src/tree.stories';
import popoverMeta, {
  Basic as PopoverStory
} from '../../../packages/components/popover/src/popover.stories';
import messageDialogMeta, {
  Alert as MessageDialogStory
} from '../../../packages/components/message-dialog/src/message-dialog.stories';
import tooltipMeta, {
  Basic as TooltipStory
} from '../../../packages/components/tooltip/src/tooltip.stories';
import { nothing } from 'lit';
import { allModes } from '../modes';

export default {
  title: 'All',
  args: {
    theme: 'sanoma-learning',
    icons: Object.keys(window.SLDS?.icons || {})
  },
  parameters: {
    chromatic: {
      modes: Object.fromEntries(Object.entries(allModes).filter(([key]) => key !== 'default'))
    }
  }
};

export const MenuButton = {
  render: () => {
    if (!menuButtonMeta.render) {
      return nothing;
    }

    const args = {
      ...(menuButtonMeta.args ?? {}),
      ...(MenuStory.args ?? {})
    } as Parameters<NonNullable<typeof menuButtonMeta.render>>[0];

    return menuButtonMeta.render(args);
  }
};
export const SingleCombobox = {
  render: () => {
    if (!singleComboboxMeta.render) {
      return nothing;
    }

    const args = {
      ...(singleComboboxMeta.args ?? {}),
      ...(SingleComboboxStory.args ?? {})
    } as Parameters<NonNullable<typeof singleComboboxMeta.render>>[0];

    return singleComboboxMeta.render(args);
  }
};
export const MultipleCombobox = {
  render: () => {
    if (!multipleComboboxMeta.render) {
      return nothing;
    }

    const args = {
      ...(multipleComboboxMeta.args ?? {}),
      ...(MultipleComboboxStory.args ?? {})
    } as Parameters<NonNullable<typeof multipleComboboxMeta.render>>[0];

    return multipleComboboxMeta.render(args);
  }
};
export const DateField = {
  render: () => {
    if (!dateFieldMeta.render) {
      return nothing;
    }

    const args = {
      ...(dateFieldMeta.args ?? {}),
      ...(DateFieldStory.args ?? {})
    } as Parameters<NonNullable<typeof dateFieldMeta.render>>[0];

    return dateFieldMeta.render(args);
  }
};
export const Select = {
  render: () => {
    if (!selectMeta.render) {
      return nothing;
    }

    const args = {
      ...(selectMeta.args ?? {}),
      ...(SelectStory.args ?? {})
    } as Parameters<NonNullable<typeof selectMeta.render>>[0];

    return selectMeta.render(args);
  }
};
export const TimeField = {
  render: () => {
    if (!timeFieldMeta.render) {
      return nothing;
    }

    const args = {
      ...(timeFieldMeta.args ?? {}),
      ...(TimeFieldStory.args ?? {})
    } as Parameters<NonNullable<typeof timeFieldMeta.render>>[0];

    return timeFieldMeta.render(args);
  }
};
export const Panel = {
  render: () => {
    if (!panelMeta.render) {
      return nothing;
    }

    const args = {
      ...(panelMeta.args ?? {}),
      ...(PanelStory.args ?? {})
    } as Parameters<NonNullable<typeof panelMeta.render>>[0];

    return panelMeta.render(args);
  }
};
export const Tree = {
  render: () => {
    if (!treeMeta.render) {
      return nothing;
    }

    const args = {
      ...(treeMeta.args ?? {}),
      ...(TreeStory.args ?? {})
    } as Parameters<NonNullable<typeof treeMeta.render>>[0];

    return treeMeta.render(args);
  }
};
export const Dialog = {
  render: () => {
    if (!dialogMeta.render) {
      return nothing;
    }

    const args = {
      ...(dialogMeta.args ?? {}),
      ...(DialogStory.args ?? {})
    } as Parameters<NonNullable<typeof dialogMeta.render>>[0];

    return dialogMeta.render(args);
  }
};

export const Popover = {
  render: () => {
    if (!popoverMeta.render) {
      return nothing;
    }

    const args = {
      ...(popoverMeta.args ?? {}),
      ...(PopoverStory.args ?? {})
    } as Parameters<NonNullable<typeof popoverMeta.render>>[0];

    return popoverMeta.render(args);
  }
};

export const MessageDialog = {
  render: () => {
    if (!messageDialogMeta.render) {
      return nothing;
    }

    const args = {
      ...(MessageDialogStory.args ?? {})
    } as Parameters<NonNullable<typeof messageDialogMeta.render>>[0];

    return messageDialogMeta.render(args);
  }
};

export const Tooltip = {
  render: () => {
    if (!tooltipMeta.render) {
      return nothing;
    }

    const args = {
      ...(tooltipMeta.args ?? {}),
      ...(TooltipStory.args ?? {})
    } as Parameters<NonNullable<typeof tooltipMeta.render>>[0];

    return tooltipMeta.render(args);
  }
};
