import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Variable, VariableType } from 'src/models/models';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.scss']
})
export class VariableComponent {

  @Output() onUpdateVariable: EventEmitter<Variable> = new EventEmitter<Variable>();
  @Output() onDeleteVariable: EventEmitter<Variable> = new EventEmitter<Variable>();

  @Input() variable: Variable;

  public variableTypes = VariableType;

  public updateVariableName(eventData: any): void {
    const value = eventData.target.value;
    this.variable.name = value;
    this.onUpdateVariable.emit(this.variable);
  }

  public updateVariableValue(eventData: any): void {
    const value = eventData.target.value;
    this.variable.value = value;
    this.onUpdateVariable.emit(this.variable);
  }

  public updateVariableType(eventData: any): void {
    const value = eventData.target.value;
    this.variable.type = value;
    this.onUpdateVariable.emit(this.variable);
  }

}
