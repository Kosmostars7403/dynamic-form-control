import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Observable, Subject, switchMap, tap} from 'rxjs';
import {DynamicFormConfig} from '../dynamic-forms.model';

@Component({
  selector: 'app-dynamic-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsComponent {

  form!: FormGroup;

  formLoadingTrigger$ = new Subject<'user' | 'company'>()
  formConfig$!: Observable<DynamicFormConfig>;

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger$.pipe(
      switchMap(config => this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)),
      tap(({ controls }) => this.buildForm(controls))
    );
  }

  private buildForm(controls: DynamicFormConfig['controls']) {
    this.form = new FormGroup({})

    Object.keys(controls).forEach(key => {
      this.form.addControl(key, new FormControl(controls[key].value))
    })
  }
}
