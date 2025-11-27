import { ButtonComponent } from '@sl-design-system/angular/button';
import { ButtonBarComponent } from '@sl-design-system/angular/button-bar';
import {
  MenuButtonComponent,
  MenuComponent,
  MenuItemComponent,
  MenuItemGroupComponent
} from '@sl-design-system/angular/menu';
import { ToggleButtonComponent } from '@sl-design-system/angular/toggle-button';
import { ToggleGroupComponent } from '@sl-design-system/angular/toggle-group';
import { ToolBarComponent } from '@sl-design-system/angular/tool-bar';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

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
    description: 'A menu button combines a button with a dropdown menu of options.',
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
    description: 'You can bind actions to buttons using the (sl-toggle) event to respond to toggle state changes.',
    props: {
      action: (event: Event) => console.log('Button toggled, current value:', event)
    },
    template: '<sl-toggle-button (sl-toggle)="action($event)">Toggle me</sl-toggle-button>'
  })
};

export const ToggleGroup: StoryObj = {
  render: () => ({
    description:
      'A toggle group lets users control related actions with clear visual feedback in a compact UI element.',
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
    description: 'A toolbar groups multiple actions together in a single horizontal row.',
    template: `
      <sl-tool-bar>
        <sl-button>Button 1</sl-button>
        <sl-button>Button 2</sl-button>
        <sl-button>Button 3</sl-button>
      </sl-tool-bar>
    `
  })
};
