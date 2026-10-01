import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-exercise-card` actually registers - a type-only import would
// be erased at transform time and the element would never be defined.
import './exercise-card.js';
import { type ExerciseCard } from './exercise-card.js';
import { SUBCHAPTER_FEED_PAGE_DATA } from '../../mock-data.js';
import { type ExerciseCardModel, type ExerciseType } from '../../models.js';

type Props = Pick<ExerciseCard, 'model' | 'actionsHidden'>;
type Story = StoryObj<Props>;

// In the real page this would come from `sl-subchapter-feed-list`, which owns the fetch for the
// whole feed; this story exercises the component standalone with the first of the design's eight
// exercise-card instances ("Tehtävät" section).
const exerciseSection = SUBCHAPTER_FEED_PAGE_DATA.feed.sections.find(section => section.kind === 'exercise');

const model: ExerciseCardModel = (exerciseSection?.items[0] ?? {
  id: 'exercise-1',
  title: '1.7 Vastaa kysymyksiin',
  exerciseType: 'self-correcting',
  difficulty: 2
}) as ExerciseCardModel;

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/Exercise card',
  args: { model },
  render: ({ model, actionsHidden }) =>
    html`<sl-exercise-card .model=${model} ?actions-hidden=${actionsHidden}></sl-exercise-card>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const ActionsHidden: Story = {
  args: { actionsHidden: true }
};

/**
 * The 3-star difficulty indicator at each of its four possible values: 0 (no stars filled)
 * through 3 (all filled).
 */
export const DifficultyRange: Story = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    </style>
    <div>
      ${([0, 1, 2, 3] as const).map(
        difficulty => html`<sl-exercise-card .model=${{ ...model, id: `difficulty-${difficulty}`, difficulty }}></sl-exercise-card>`
      )}
    </div>
  `
};

/**
 * One card per `ExerciseType`, showing its eyebrow label and tile glyph. Only `self-correcting`
 * (including the stray space in "Self -correcting exercise") is evidenced in the design; the
 * `open` and `teacher-checked` labels and their shared glyph were invented by the implementer,
 * since the Figma file publishes no Code Connect mappings enumerating the type's full variant
 * list.
 */
export const ExerciseTypes: Story = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    </style>
    <div>
      ${(['self-correcting', 'open', 'teacher-checked'] as ExerciseType[]).map(
        exerciseType =>
          html`<sl-exercise-card .model=${{ ...model, id: `type-${exerciseType}`, exerciseType }}></sl-exercise-card>`
      )}
    </div>
  `
};
