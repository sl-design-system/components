import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-a2-class-nav` globally (guarded). A `type`-only
// import here would be elided at build time and the element would never be defined.
import './class-nav.js';
import { type ClassNav, type ClassNavModel, type ClassSection } from './class-nav.js';

const MODEL: ClassNavModel = {
  className: '5A English',
  activeSection: 'participants'
};

type Props = Pick<ClassNav, 'model'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/A2 NSP Class Overview/Class nav',
  args: { model: MODEL },
  argTypes: {
    model: { control: false }
  },
  render: ({ model }) => html`<sl-a2-class-nav .model=${model}></sl-a2-class-nav>`
} satisfies Meta<Props>;

export const Basic: Story = {};

/** Each of the four possible `activeSection` values, one nav bar per section. */
export const ActiveSections: Story = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: var(--sl-size-400);
      }
    </style>
    <div>
      ${(['overview', 'method', 'lessons', 'participants'] as ClassSection[]).map(
        activeSection =>
          html`<sl-a2-class-nav
            .model=${{ className: '5A English', activeSection }}
          ></sl-a2-class-nav>`
      )}
    </div>
  `
};

/** Content projected into the `trailing` slot, after the four section links. */
export const WithTrailing: Story = {
  render: ({ model }) => html`
    <sl-a2-class-nav .model=${model}>
      <button slot="trailing" type="button">Export</button>
    </sl-a2-class-nav>
  `
};

/** `model` is `null` — the component renders nothing, matching its own empty-model guard. */
export const NoModel: Story = {
  args: { model: null }
};
