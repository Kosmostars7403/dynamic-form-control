import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CONTROL_DATA} from '../control-data.token';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input [value]="controlData.config.value" [id]="controlData.controlKey" [type]="controlData.config.type">
  `,
  styles: [
  ]
})
export class DynamicInputComponent {

  controlData = inject(CONTROL_DATA)

  constructor() {
  }

}
