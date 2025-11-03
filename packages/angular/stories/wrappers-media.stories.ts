import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { AvatarComponent } from '../src/avatar/avatar.component';
import { IconComponent } from '../src/icon/icon.component';

export default {
  title: 'Wrappers/Media',
  decorators: [
    moduleMetadata({
      imports: [AvatarComponent, IconComponent]
    })
  ]
} as Meta;

export const Avatar: StoryObj = {
  render: () => ({
    template: '<sl-avatar displayName="Jan Janssen"></sl-avatar>'
  })
};

export const Icon: StoryObj = {
  render: () => ({
    template: '<sl-icon name="face-smile"></sl-icon>'
  })
};
