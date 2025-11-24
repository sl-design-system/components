import { BadgeComponent } from '@sl-design-system/angular/badge';
import { InlineMessageComponent } from '@sl-design-system/angular/inline-message';
import { ProgressBarComponent } from '@sl-design-system/angular/progress-bar';
import { SkeletonComponent } from '@sl-design-system/angular/skeleton';
import { SpinnerComponent } from '@sl-design-system/angular/spinner';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Feedback & Status',
  decorators: [
    moduleMetadata({
      imports: [BadgeComponent, InlineMessageComponent, ProgressBarComponent, SkeletonComponent, SpinnerComponent]
    })
  ]
} as Meta;

export const Badge: StoryObj = {
  render: () => ({
    description: 'A badge component for displaying status or counts.',
    template: '<sl-badge>badge</sl-badge>'
  })
};

export const InlineMessage: StoryObj = {
  render: () => ({
    description: 'An inline message component for displaying messages with a dismiss option.',
    props: {
      onDismiss: () => console.log('Dismissed')
    },
    template: `
      <sl-inline-message (slDismiss)="onDismiss()">
        <span slot="title">Inline message title</span>
        <p>Et labore exercitation excepteur sunt. Laboris amet minim nisi non ut labore culpa eiusmod reprehenderit nisi. Exercitation veniam quis aute mollit qui commodo magna est commodo veniam magna. Est in pariatur quis laboris non ad. Cillum amet eiusmod duis ullamco dolore irure. Mollit ea incididunt elit nostrud anim sunt do. Cupidatat occaecat nisi aliqua esse occaecat duis amet et labore quis.</p>
      </sl-inline-message>
    `
  })
};

export const ProgressBar: StoryObj = {
  render: () => ({
    description: 'A progress bar component for indicating progress.',
    template: '<sl-progress-bar value="65" max="100"></sl-progress-bar>'
  })
};

export const Skeleton: StoryObj = {
  render: () => ({
    description: 'A skeleton component for displaying loading placeholders.',
    template: '<sl-skeleton></sl-skeleton>'
  })
};

export const Spinner: StoryObj = {
  render: () => ({
    description: 'A spinner component for indicating loading state.',
    template: '<sl-spinner></sl-spinner>'
  })
};
