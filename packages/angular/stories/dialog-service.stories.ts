import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { type Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../src/button/button.component';
import { DialogComponent } from '../src/dialog/dialog.component';
import { DialogRef, DialogService } from '../src/services/dialog.service';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <span slot="title">Title</span>
    <span slot="subtitle">Subtitle</span>
    <p>This is an example of the dialog content.</p>
    <sl-button (click)="dialogRef.close('cancelled')" slot="primary-actions">Cancel</sl-button>
    <sl-button (click)="dialogRef.close('confirmed')" slot="primary-actions">Confirm</sl-button>
  `
})
export class ExampleDialogComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject('DIALOG_DATA') public data: { title: string; message: string }
  ) {}
}

@Component({
  selector: 'sla-dialog-service',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <h2>Dialog Service examples</h2>

    <div style="display: flex; gap: 10px;">
      <sl-button (click)="openBasicDialog()">Open dialog</sl-button>
      <sl-button (click)="openNonCancelableDialog()">Open dialog without close button</sl-button>
    </div>
  `
})
export class DialogServiceExampleComponent {
  lastResult: string | undefined;

  constructor(private dialogService: DialogService) {}

  openBasicDialog(): void {
    const dialogRef = this.dialogService.open<ExampleDialogComponent, string>({
      component: ExampleDialogComponent,
      data: {
        title: 'Basic Dialog',
        message: 'This is a basic dialog with default settings.'
      },
      closeButton: true
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      this.lastResult = result;
      console.log('Dialog closed with result:', result);
    });
  }

  openNonCancelableDialog(): void {
    const dialogRef = this.dialogService.open<ExampleDialogComponent, string>({
      component: ExampleDialogComponent,
      data: {
        title: 'Non-Cancelable Dialog',
        message: 'This dialog cannot be closed by clicking the backdrop or pressing Escape.'
      },
      disableCancel: true,
      closeButton: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.lastResult = result;
      console.log('Dialog closed with result:', result);
    });
  }
}

export default {
  title: 'Dialog Service',
  decorators: [
    applicationConfig({
      providers: [DialogService, provideRouter([], withHashLocation())]
    }),
    moduleMetadata({
      imports: [DialogComponent, ButtonComponent, CommonModule, DialogServiceExampleComponent, ExampleDialogComponent]
    })
  ]
} as Meta;

export const DialogServiceExample: StoryFn = () => ({
  template: '<sla-dialog-service></sla-dialog-service>'
});
