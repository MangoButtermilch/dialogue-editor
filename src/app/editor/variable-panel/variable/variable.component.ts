import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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


  public readonly variableControlName: string = "variableName";

  public formGroup: FormGroup = new FormGroup({
    [this.variableControlName]: new FormControl("newVariable", [Validators.required, Validators.pattern("^[a-zA-Z_][a-zA-Z0-9_]*$")])
  });

  public variableNameValid: boolean = true;
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

  private isInvalid(): boolean {
    return !!this.variableInputErrors;
  }

  public get variableInputErrors(): ValidationErrors | null | undefined {
    return this.formGroup?.get(this.variableControlName)?.errors;
  }

}
