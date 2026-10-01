import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-itsl-files-section-nav` globally (guarded). A
// `type`-only import here would be erased at transform time and the element would never be
// defined, leaving an unregistered 0x0 element in the story.
import './section-nav.js';
import { type SectionNav, type SectionNavModel } from './section-nav.js';

type Props = Pick<SectionNav, 'model'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/B Itsl Bookmk Course Files/Section Nav',
  render: () => html`<sl-itsl-files-section-nav></sl-itsl-files-section-nav>`
} satisfies Meta<Props>;

export const Basic: Story = {};

// Moves the 4px underline from "Save course materials" (the component's own default) to
// "Your files".
const yourFilesActive: SectionNavModel = { appName: 'Files', activeTabId: 'your-files' };

/** The other route is active — the 4px underline moves to "Your files". */
export const OtherTabActive: Story = {
  render: () => html`<sl-itsl-files-section-nav .model=${yourFilesActive}></sl-itsl-files-section-nav>`
};

// The tool is renameable per institution (that's exactly why `appName` is a model field and not a
// hardcoded label); a longer name checks the bar doesn't crowd or clip against the two tab links.
const longerAppName: SectionNavModel = {
  appName: 'Course Materials Library',
  activeTabId: 'save-course-materials'
};

/** A longer, institution-configured app name in place of the default "Files". */
export const LongerAppName: Story = {
  render: () => html`<sl-itsl-files-section-nav .model=${longerAppName}></sl-itsl-files-section-nav>`
};
