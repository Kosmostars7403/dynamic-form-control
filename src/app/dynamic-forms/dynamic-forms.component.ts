import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, Subject, switchMap, tap} from 'rxjs';
import {DynamicControl, DynamicFormConfig} from '../dynamic-forms.model';
import {ControlInjectorPipe} from './control-injector.pipe';
import {DynamicControlResolver} from './dynamic-control-resolver.service';

@Component({
  selector: 'app-dynamic-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe],
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsComponent {

  form!: FormGroup;

  formLoadingTrigger$ = new Subject<'user' | 'company'>()
  formConfig$!: Observable<DynamicFormConfig>;

  constructor(
    private http: HttpClient,
    public componentResolver: DynamicControlResolver
    ) { }

  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger$.pipe(
      switchMap(config => this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)),
      tap(({ controls }) => this.buildForm(controls))
    );
  }

  protected onSubmit() {
    console.log('Submitted data: ', this.form.value);
    this.form.reset();
  }
  private buildForm(controls: DynamicFormConfig['controls']) {
    this.form = new FormGroup({});
    Object.keys(controls).forEach(key => this.buildControls(
      key,
      controls[key],
      this.form
    ));
  }
  private buildGroup(controlKey: string, controls: DynamicControl['controls'], parentFormGroup: FormGroup) {
    if (!controls) return;
    const nestedFormGroup = new FormGroup({});
    Object.keys(controls).forEach(key => this.buildControls(key, controls[key], nestedFormGroup));
    parentFormGroup.addControl(controlKey, nestedFormGroup);
  }
  private buildControls(controlKey: string, config: DynamicControl, formGroup: FormGroup) {
    if (config.controlType === 'group') {
      this.buildGroup(controlKey, config.controls, formGroup);
      return;
    }
    const validators = this.resolveValidators(config);
    formGroup.addControl(controlKey, new FormControl(config.value, validators));
  }
  private resolveValidators({ validators = {} }: DynamicControl) {
    return (Object.keys(validators) as Array<keyof typeof validators>).map(validatorKey => {
      const validatorValue = validators[validatorKey];
      if (validatorKey === 'required') {
        return Validators.required;
      }
      if (validatorKey === 'email') {
        return Validators.email;
      }
      if (validatorKey === 'requiredTrue') {
        return Validators.requiredTrue;
      }
      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }
      return Validators.nullValidator;
    })
  }

}
