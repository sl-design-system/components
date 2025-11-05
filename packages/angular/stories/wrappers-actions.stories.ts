import { ButtonComponent } from '@sl-design-system/angular/button';
import {
  MenuButtonComponent,
  MenuComponent,
  MenuItemComponent,
  MenuItemGroupComponent
} from '@sl-design-system/angular/menu';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { ButtonBarComponent } from '../src/button-bar/button-bar.component';
import { ToggleButtonComponent } from '../src/toggle-button/public-api';
import { ToggleGroupComponent } from '../src/toggle-group/public-api';
import { ToolBarComponent } from '../src/tool-bar/public-api';

export default {
  title: 'Wrappers/Actions',
  decorators: [
    moduleMetadata({
      imports: [
        ButtonBarComponent,
        ButtonComponent,
        MenuComponent,
        MenuButtonComponent,
        MenuItemComponent,
        MenuItemGroupComponent,
        ToggleButtonComponent,
        ToggleGroupComponent,
        ToolBarComponent
      ]
    })
  ]
} as Meta;

export const Button: StoryObj = {
  render: () => ({
    description: 'You can bind actions to buttons using the (click) event.',
    props: {
      action: () => console.log('Button clicked')
    },
    template: '<sl-button  (click)="action()">Button</sl-button>'
  })
};

export const ButtonBar: StoryObj = {
  globals: {
    Description: 'A button bar groups multiple buttons together.'
  },
  render: () => ({
    description: 'A button bar groups multiple buttons together.',
    template: `
      <sl-button-bar>
        <sl-button>Button 1</sl-button>
        <sl-button>Button 2</sl-button>
      </sl-button-bar>
    `
  })
};

export const MenuButton: StoryObj = {
  render: () => ({
    template: `
      <sl-menu-button>
          <sl-menu-item>Option 1</sl-menu-item>
          <sl-menu-item>Option 2</sl-menu-item>
          <sl-menu-item>Option 3</sl-menu-item>
      </sl-menu-button>
    `
  })
};

export const ToggleButton: StoryObj = {
  render: () => ({
    template: '<sl-toggle-button>Toggle me</sl-toggle-button>'
  })
};

export const ToggleGroup: StoryObj = {
  render: () => ({
    template: `
      <sl-toggle-group>
        <sl-toggle-button>Option 1</sl-toggle-button>
        <sl-toggle-button>Option 2</sl-toggle-button>
        <sl-toggle-button>Option 3</sl-toggle-button>
      </sl-toggle-group>
    `
  })
};

export const ToolBar: StoryObj = {
  render: () => ({
    template: `
      <sl-tool-bar>
        <sl-button>Button 1</sl-button>
        <sl-button>Button 2</sl-button>
        <sl-button>Button 3</sl-button>
      </sl-tool-bar>
    `
  })
};
