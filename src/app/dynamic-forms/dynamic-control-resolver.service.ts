import {Injectable, Type} from '@angular/core';
import {DynamicControl} from '../dynamic-forms.model';
import {DynamicCheckboxComponent} from './dynamic-controls/dynamic-checkbox.component';
import {DynamicGroupComponent} from './dynamic-controls/dynamic-group.component';
import {DynamicInputComponent} from './dynamic-controls/dynamic-input.component';
import {DynamicSelectComponent} from './dynamic-controls/dynamic-select.component';

type DynamicControlsMap = {
  [T in DynamicControl['controlType']]: Type<any>;
};


@Injectable({
  providedIn: 'root'
})
export class DynamicControlResolver {
  private controlComponents: DynamicControlsMap = {
    input: DynamicInputComponent,
    select: DynamicSelectComponent,
    checkbox: DynamicCheckboxComponent,
    group: DynamicGroupComponent
  }

  resolve(controlType: keyof DynamicControlsMap) {
    return this.controlComponents[controlType]
  }
}
