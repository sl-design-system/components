import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../src/button/button.component';
import { ButtonBarComponent } from '../src/button-bar/button-bar.component';

export default {
  title: 'Wrappers/Actions',
  decorators: [
    moduleMetadata({
      imports: [ButtonBarComponent, ButtonComponent]
    })
  ]
} as Meta;

export const Button: StoryObj = {
  render: () => ({
    template: '<sl-button>Button</sl-button>'
  })
};

export const ButtonBar: StoryObj = {
  render: () => ({
    template: `
      <sl-button-bar>
        <sl-button>Button 1</sl-button>
        <sl-button>Button 2</sl-button>
      </sl-button-bar>
    `
  })
};
