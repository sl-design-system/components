import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import - registers `sl-itsl-course-top-nav` globally (guarded). A `type`-only
// import here would be erased at transform time and the element would never be defined.
import './top-nav.js';
import { type TopNav, type TopNavModel } from './top-nav.js';

const MODEL: TopNavModel = {
  items: [
    { id: 'courses', label: 'Courses' },
    { id: 'updates', label: 'Updates' },
    { id: 'groups', label: 'Groups' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'library', label: 'Library' }
  ],
  sectionLabel: 'Files',
  tabs: [
    { id: 'your-files', label: 'Your files' },
    { id: 'save-course-materials', label: 'Save course materials' }
  ],
  activeTabId: 'save-course-materials',
  searchPlaceholder: 'Search',
  user: { name: 'Anna Larsen', initials: 'AL' }
};

type Props = Pick<TopNav, 'model'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/B Itsl Course Course Files/Top nav',
  render: () => html`<sl-itsl-course-top-nav .model=${MODEL}></sl-itsl-course-top-nav>`
} satisfies Meta<Props>;

export const Basic: Story = {};
