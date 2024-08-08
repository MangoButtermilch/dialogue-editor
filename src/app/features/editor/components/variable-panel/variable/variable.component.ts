import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Variable, VariableType } from 'src/models/models';

@Component({
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule],
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.scss']
})
export class VariableComponent implements OnInit {

  @Output() onUpdateVariable: EventEmitter<Variable> = new EventEmitter<Variable>();
  @Output() onDeleteVariable: EventEmitter<Variable> = new EventEmitter<Variable>();

  @Input() variable: Variable;

  public iconDelete = faXmark;

  public readonly variableControlName: string = "variableName";
  public variableNameValid: boolean = true;
  public variableTypes = VariableType;
  public formGroup: FormGroup | null = null;

  ngOnInit(): void {
    this.generateFormGroup();
  }

  private generateFormGroup(): void {
    const name = this.variable.name || "newVariable";

    this.formGroup = new FormGroup({
      [this.variableControlName]:
        new FormControl(name, [Validators.required, Validators.pattern("^[a-zA-Z_][a-zA-Z0-9_]*$")])
    });
  }

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

  public get variableInputErrors(): ValidationErrors | null | undefined {
    return this.formGroup?.get(this.variableControlName)?.errors;
  }

}
