import { AvatarComponent } from '@sl-design-system/angular/avatar';
import { IconComponent } from '@sl-design-system/angular/icon';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

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
