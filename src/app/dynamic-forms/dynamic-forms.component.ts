import {HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable, Subject, switchMap, tap} from 'rxjs';
import {DynamicFormConfig} from '../dynamic-forms.model';

@Component({
  selector: 'app-dynamic-forms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent {

  protected formLoadingTrigger$ = new Subject<'user' | 'company'>()
  protected formConfig$!: Observable<DynamicFormConfig>;

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger$.pipe(
      switchMap(config => this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)),
    );
  }
}
