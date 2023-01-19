import { KeyValue } from "@angular/common";
import { Directive, HostBinding, inject, StaticProvider } from "@angular/core";
import { ControlContainer } from "@angular/forms";
import {DynamicControl} from '../../dynamic-forms.model';
import { CONTROL_DATA } from "../control-data.token";

export const comparatorFn = (
  a: KeyValue<string, DynamicControl>,
  b: KeyValue<string, DynamicControl>
): number => a.value.order - b.value.order;

export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true })
}

@Directive()
export class BaseDynamicControl {
  @HostBinding('class') hostClass = 'form-field';

  control = inject(CONTROL_DATA);
}
