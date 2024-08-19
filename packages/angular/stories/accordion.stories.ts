import { Component } from '@angular/core';
import { type Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { AccordionComponent, ButtonComponent } from '../src/wrappers';

@Component({
  selector: 'sla-accordion-external-actions',
  template: `<sl-button (click)="this.onClick('dino')">Toggle 🦖</sl-button>
    <sl-button (click)="this.onClick('alien')">Toggle 👽</sl-button>
    dinoState:{{ this.dinoState }} alienState:{{ this.alienState }}
    <sl-accordion>
      <sl-accordion-item summary="Discovering Dinosaurs: A Prehistoric Adventure" [open]="dinoState">
        Embark on a thrilling journey back in time to the age of dinosaurs! 🌎🦕🌿🦖
      </sl-accordion-item>
      <sl-accordion-item summary="Journey Through Ancient Civilizations">
        Pack your virtual bags and travel through time to ancient Egypt, Greece, Rome, and beyond 🌍🏛️🔍🏺
      </sl-accordion-item>
      <sl-accordion-item summary="Space Odyssey: Exploring Planets and Stars" [open]="alienState">
        Buckle up for a cosmic adventure! 🚀🪐👽
      </sl-accordion-item>
    </sl-accordion>`
})
export class AccordionExternalActionsComponent {
  dinoState = true;
  alienState = true;
  onClick(item: string): void {
    if (item === 'dino') {
      this.dinoState = !this.dinoState;
    }
    if (item === 'alien') {
      this.alienState = !this.alienState;
    }
  }
}

export default {
  title: 'Accordion',
  decorators: [
    moduleMetadata({
      declarations: [AccordionExternalActionsComponent],
      imports: [AccordionComponent, ButtonComponent]
    })
  ]
} as Meta;

export const ExternalActions: StoryFn = () => ({
  template: '<sla-accordion-external-actions></sla-accordion-external-actions>'
});
