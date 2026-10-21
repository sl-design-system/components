// Load the scoped registry before registering components, as in Storybook's preview.
// eslint-disable-next-line import/order
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EnvironmentInjector,
  createComponent
} from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { type CheckboxGroup } from '@sl-design-system/checkbox';
import '@sl-design-system/checkbox/register.js';
import { type RadioGroup } from '@sl-design-system/radio-group';
import '@sl-design-system/radio-group/register.js';
import { CheckboxGroupDirective } from './checkbox-group.directive';
import { RadioGroupDirective } from './radio-group.directive';

@Component({
  imports: [ReactiveFormsModule, CheckboxGroupDirective, RadioGroupDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <form [formGroup]="form">
      <sl-checkbox-group formControlName="checkboxes" required>
        <sl-checkbox value="1">One</sl-checkbox>
        <sl-checkbox value="2">Two</sl-checkbox>
      </sl-checkbox-group>
      <sl-radio-group formControlName="radio" required>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
      </sl-radio-group>
    </form>
  `
})
class FormControlGroupsTestComponent {
  form = new FormGroup({
    checkboxes: new FormControl(['1'], { nonNullable: true }),
    radio: new FormControl('2', { nonNullable: true })
  });
}

describe('form control groups with Angular reactive forms', () => {
  let fixture: ComponentFixture<FormControlGroupsTestComponent>;
  let checkboxes: CheckboxGroup;
  let radio: RadioGroup;

  async function stabilize(): Promise<void> {
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    checkboxes = host.querySelector('sl-checkbox-group')!;
    radio = host.querySelector('sl-radio-group')!;
    await Promise.all([checkboxes.updateComplete, radio.updateComplete]);
    // Slot handlers and checked-attribute observers also update the group values.
    await new Promise(resolve => setTimeout(resolve));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlGroupsTestComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(FormControlGroupsTestComponent);
  });

  it('should initialize formControlName with synchronous defaults on first render', async () => {
    fixture.detectChanges();
    await stabilize();

    expect(checkboxes.formValue).toEqual(['1']);
    expect(checkboxes.boxes?.map(box => box.checked)).toEqual([true, false]);
    expect(radio.formValue).toBe('2');
    expect(radio.radios?.map(option => option.checked)).toEqual([false, true]);
    expect(fixture.componentInstance.form.valid).toBeTrue();
  });

  it('should validate during the first change detection before the view is connected', async () => {
    const host = document.createElement('div');
    const component = createComponent(FormControlGroupsTestComponent, {
      environmentInjector: TestBed.inject(EnvironmentInjector),
      hostElement: host
    });

    try {
      // Exercise Angular's real writeValue/validate calls before connectedCallback.
      expect(() => component.changeDetectorRef.detectChanges()).not.toThrow();
      const detachedCheckboxes = host.querySelector('sl-checkbox-group')!;
      const detachedRadio = host.querySelector('sl-radio-group')!;
      expect(detachedCheckboxes.isConnected).toBeFalse();
      expect(typeof detachedCheckboxes.valid).toBe('boolean');
      expect(typeof detachedRadio.valid).toBe('boolean');

      document.body.appendChild(host);
      await Promise.all([detachedCheckboxes.updateComplete, detachedRadio.updateComplete]);
      await new Promise(resolve => setTimeout(resolve));

      expect(detachedCheckboxes.formValue).toEqual(['1']);
      expect(detachedRadio.formValue).toBe('2');
      expect(component.instance.form.valid).toBeTrue();
    } finally {
      component.destroy();
      host.remove();
    }
  });

  it('should synchronize user changes, required validation, reset and disabled state', async () => {
    fixture.detectChanges();
    await stabilize();
    const form = fixture.componentInstance.form;

    radio.dispatchEvent(new CustomEvent('sl-blur'));
    expect(form.controls.radio.touched).toBeTrue();

    checkboxes.querySelector<HTMLElement>('sl-checkbox[value="2"]')!.click();
    radio.querySelector<HTMLElement>('sl-radio[value="1"]')!.click();
    await stabilize();
    expect(form.getRawValue()).toEqual({ checkboxes: ['1', '2'], radio: '1' });

    form.setValue({ checkboxes: [], radio: '' });
    fixture.detectChanges();
    await stabilize();
    expect(form.controls.checkboxes.errors).toEqual({ required: true });
    expect(form.controls.radio.errors).toEqual({ required: true });

    form.reset();
    fixture.detectChanges();
    await stabilize();
    expect(checkboxes.formValue).toEqual(['1']);
    expect(radio.formValue).toBe('2');
    expect(form.valid).toBeTrue();

    form.disable();
    fixture.detectChanges();
    await stabilize();
    expect(checkboxes.boxes?.every(box => box.disabled)).toBeTrue();
    expect(radio.radios?.every(option => option.disabled)).toBeTrue();
  });
});
