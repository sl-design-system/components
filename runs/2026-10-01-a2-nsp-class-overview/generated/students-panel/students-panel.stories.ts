import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { DEFAULT_STUDENT_ROWS } from '../fixtures/class-overview.fixture.js';
// Plain side-effect import so `sl-a2-students-panel` (and its scoped children) actually
// register - a type-only import would be elided at transform time and the element would never
// be defined.
import './students-panel.js';
import { type StudentsPanel, type StudentsPanelModel } from './students-panel.js';

type Props = Pick<StudentsPanel, 'model'>;
type Story = StoryObj<Props>;

const model: StudentsPanelModel = { students: DEFAULT_STUDENT_ROWS };

export default {
  title: 'Runs/A2 NSP Class Overview/Students panel',
  args: { model },
  render: ({ model }) => html`<sl-a2-students-panel .model=${model}></sl-a2-students-panel>`
} satisfies Meta<Props>;

export const Basic: Story = {};
