import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-nsp-class-card` actually registers - a type-only import would
// be erased at transform time and the element would never be defined.
import './class-card.js';
import { type ClassCard, type ClassCardModel } from './class-card.js';

type Props = Pick<ClassCard, 'model'>;
type Story = StoryObj<Props>;

// In the real page this would come from `sl-nsp-home-page`, which owns the fetch for all five
// class records; this story exercises the component standalone with one representative record.
const model: ClassCardModel = {
  id: '5b-english',
  name: '5B English',
  studentCount: 15,
  hasMethod: false
};

export default {
  title: 'Runs/B NSP Home/Class card',
  args: { model },
  render: ({ model }) => html`<sl-nsp-class-card .model=${model}></sl-nsp-class-card>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const WithMethod: Story = {
  args: {
    model: {
      id: '5c-english',
      name: '5C English',
      studentCount: 2,
      hasMethod: true
    }
  }
};

/** `studentCount: 1` exercises the singular "1 student" branch in the component's own pluralization. */
export const SingleStudent: Story = {
  args: {
    model: {
      id: '6c-english',
      name: '6C English',
      studentCount: 1,
      hasMethod: false
    }
  }
};

/** A name long enough to wrap, showing how the fixed 224px card handles overflow. */
export const LongClassName: Story = {
  args: {
    model: {
      id: '7a-advanced-placement',
      name: 'Advanced Placement English Literature and Composition',
      studentCount: 18,
      hasMethod: false
    }
  }
};

/** A large roster, showing the student-count badge with a wider label. */
export const LargeStudentCount: Story = {
  args: {
    model: {
      id: '8a-assembly',
      name: '8A Assembly',
      studentCount: 250,
      hasMethod: true
    }
  }
};

/**
 * Content slotted into `media`, replacing the grey placeholder fallback, proving the slot is a
 * real seam. A CSS-drawn block stands in for a thumbnail image - this run has no asset-export
 * step, so an `<img src>` would 404 and pollute the capture report.
 */
export const WithSlottedMedia: Story = {
  args: { model },
  render: ({ model }) => html`
    <sl-nsp-class-card .model=${model}>
      <div
        slot="media"
        style="inline-size: 100%; block-size: 100%; background: linear-gradient(135deg, var(--sl-color-background-accent-orange-subtle), var(--sl-color-background-accent-orange-bold));"
      ></div>
    </sl-nsp-class-card>
  `
};
