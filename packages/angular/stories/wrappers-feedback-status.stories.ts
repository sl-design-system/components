import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { BadgeComponent } from '../src/badge/badge.component';
import { InlineMessageComponent } from '../src/inline-message/inline-message.component';
import { SkeletonComponent } from '../src/skeleton/skeleton.component';
import { SpinnerComponent } from '../src/spinner/spinner.component';

export default {
  title: 'Wrappers/Feedback & Status',
  decorators: [
    moduleMetadata({
      imports: [BadgeComponent, InlineMessageComponent, SkeletonComponent, SpinnerComponent]
    })
  ]
} as Meta;

export const Badge: StoryObj = {
  render: () => ({
    template: '<sl-badge>badge</sl-badge>'
  })
};

export const InlineMessage: StoryObj = {
  render: () => ({
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

export const Skeleton: StoryObj = {
  render: () => ({
    template: '<sl-skeleton></sl-skeleton>'
  })
};

export const Spinner: StoryObj = {
  render: () => ({
    template: '<sl-spinner></sl-spinner>'
  })
};
