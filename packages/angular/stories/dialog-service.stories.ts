import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { type Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../src/button/button.component';
import { DialogComponent } from '../src/dialog/dialog.component';
import { DialogRef, DialogService } from '../src/services/dialog.service';

// Dialog content component
@Component({
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
      <span slot="title">Title</span>
      <span slot="subtitle">Subtitle</span>
      <p>Proident nulla enim est excepteur exercitation minim ea proident nisi.</p>
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

// Demo component for dialog service
@Component({
  selector: 'sla-dialog-service',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Dialog Service Examples</h1>

      <div style="display: flex; gap: 10px;">
        <sl-button (click)="openBasicDialog()">Open Basic Dialog</sl-button>
        <sl-button (click)="openCustomWidthDialog()">Open Custom Width Dialog</sl-button>
        <sl-button (click)="openNonCancelableDialog()">Open Non-Cancelable Dialog</sl-button>
      </div>

      <div *ngIf="lastResult" style="margin-top: 20px; padding: 10px;">Last dialog result: {{ lastResult }}</div>
    </div>
  `
})
export class DialogServiceDemoComponent {
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

  openCustomWidthDialog(): void {
    const dialogRef = this.dialogService.open<ExampleDialogComponent, string>({
      component: ExampleDialogComponent,
      data: {
        title: 'Custom Width Dialog',
        message: 'This dialog has a custom width of 500px.'
      },
      width: '500px',
      closeButton: true
    });

    dialogRef.afterClosed().subscribe(result => {
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
      imports: [DialogComponent, ButtonComponent, CommonModule, DialogServiceDemoComponent, ExampleDialogComponent]
    })
  ]
} as Meta;

export const DialogServiceExample: StoryFn = () => ({
  template: '<sla-dialog-service></sla-dialog-service>'
});
