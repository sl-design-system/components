import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-theory-card` actually registers - a type-only import would be
// erased at transform time and the element would never be defined.
import './theory-card.js';
import { type TheoryCard } from './theory-card.js';
import { SUBCHAPTER_FEED_PAGE_DATA } from '../../mock-data.js';
import { type TheoryCardModel } from '../../models.js';

type Props = Pick<TheoryCard, 'model' | 'actionsHidden'>;
type Story = StoryObj<Props>;

// In the real page this would come from `sl-subchapter-feed-list`, which owns the fetch for the
// whole feed; this story exercises the component standalone with the design's first theory item.
const model: TheoryCardModel = SUBCHAPTER_FEED_PAGE_DATA.feed.sections[0].items[0] as TheoryCardModel;

export default {
  title: 'Runs/A1 Kampus Subchapter Feed/Theory card',
  args: { model, actionsHidden: false },
  render: ({ model, actionsHidden }) =>
    html`<sl-theory-card .model=${model} ?actions-hidden=${actionsHidden}></sl-theory-card>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const ActionsHidden: Story = {
  args: { actionsHidden: true }
};

/**
 * A title and excerpt long enough to overflow two lines, showing the `-webkit-line-clamp: 2`
 * truncation in `.content h3` and `.excerpt` doing its job while the card's fixed 798x176 box
 * stays intact.
 */
export const LongTitleAndExcerpt: Story = {
  args: {
    model: {
      ...model,
      title:
        'Kieli, kulttuuri ja identiteetti: miten monikielisyys ja kulttuuritausta muovaavat yksilön käsitystä itsestään ja ympäröivästä yhteisöstä',
      excerpt:
        'A in sit etiam integer nisl habitant a cras viverra himenaeos a ipsum tortor integer bibendum suspendisse urna tortor tempus vestibulum ac a nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.'
    }
  }
};

/**
 * `model.image` is optional; this proves the layout holds when it is absent, which is genuinely
 * useful in this harness since the design's real images all 404 (there is no asset-export step).
 */
export const NoImage: Story = {
  args: {
    model: { ...model, image: undefined }
  }
};
