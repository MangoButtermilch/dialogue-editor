import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { VariableService } from 'src/app/features/editor/services/variable.service';
import { ConditionNode, ConditionType, Port, Variable, VariableType } from 'src/models/models';
import { PortComponent } from '../port/port.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [PortComponent, FontAwesomeModule, ReactiveFormsModule, CommonModule],
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit, OnDestroy {

  @Output() onDelete: EventEmitter<ConditionNode> = new EventEmitter<ConditionNode>();
  @Output() onUpdate: EventEmitter<ConditionNode> = new EventEmitter<ConditionNode>();

  @Input() conditionNode: ConditionNode;

  private destroy$: Subject<void> = new Subject<void>();

  public readonly guidFieldName: string = "variableGuid";
  public readonly conditionFieldName: string = "variableCondition";
  public readonly valueFieldName: string = "variableTargetValue";

  public formGroup: FormGroup | null = null;

  private formValueChanges$: Observable<object> | null = null;
  public variables$: Observable<Variable[]> | null = null
  private stateChange$: Observable<[object, Variable[]]> | null = null;

  public conditionTypes = ConditionType;
  public errorMessage: string = "";

  public iconDelete = faXmark;

  constructor(private variableService: VariableService) { }

  ngOnInit(): void {
    this.initFormAndObservables();
    this.errorMessage = this.getErrorMessage();

    //manually triggering for stateChange$ to fire
    this.variables$.subscribe((vars: Variable[]) => {
      this.formGroup.updateValueAndValidity({ emitEvent: true });
    })

    this.stateChange$.subscribe((data: [object, Variable[]]) => {
      const [formData, variables] = data;

      this.conditionNode.variable = null;
      this.conditionNode.variable = variables.find((other: Variable) => other.guid === formData[this.guidFieldName]);
      this.conditionNode.type = formData[this.conditionFieldName];
      this.conditionNode.expectedValue = formData[this.valueFieldName];

      if (this.isBooleanCondition()) {
        this.conditionNode.expectedValue = this.conditionNode.type === ConditionType.TRUE ? true : false;
      }

      this.onUpdate.emit(this.conditionNode);
      this.errorMessage = this.getErrorMessage();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public updateInPort(port: Port): void {
    this.conditionNode.inPort = port;
    this.onUpdate.emit(this.conditionNode);
  }

  public updateOutPortMatches(port: Port): void {
    this.conditionNode.outPortMatches = port;
    this.onUpdate.emit(this.conditionNode);
  }

  public updateOutPortFails(port: Port): void {
    this.conditionNode.outPortFails = port;
    this.onUpdate.emit(this.conditionNode);
  }

  private initFormAndObservables(): void {

    const guid = this.conditionNode.variable?.guid ?? null;
    const condition = this.conditionNode.type ?? null;
    const value = this.conditionNode.expectedValue ?? null;

    this.formGroup = new FormGroup({
      [this.guidFieldName]: new FormControl(guid),
      [this.conditionFieldName]: new FormControl(condition),
      [this.valueFieldName]: new FormControl(value)
    });
    this.formValueChanges$ = this.formGroup.valueChanges.pipe(takeUntil(this.destroy$));
    this.variables$ = this.variableService.getVariables().pipe(takeUntil(this.destroy$));
    this.stateChange$ = combineLatest([
      this.formValueChanges$,
      this.variables$
    ]).pipe(takeUntil(this.destroy$));

  }

  public getErrorMessage(): string {

    if (!this.hasVariable()) {
      return "No variables defined or selected";
    }

    switch (this.conditionNode.type) {

      case ConditionType.FALSE:
        return this.getBoolErrorMessage();
      case ConditionType.TRUE:
        return this.getBoolErrorMessage();
      case ConditionType.STR_EQUAL:
        return this.getTextErrorMessage();
      default:
        return this.getNumberErrorMessage();
    }
  }

  private getTextErrorMessage(): string {

    if (!this.hasTextVariable()) {
      return "Text variable required"
    }

    if (!this.hasValue()) {
      return "Input value required";
    }
    return "";
  }

  private getBoolErrorMessage(): string {
    if (!this.hasBooleanVariable()) {
      return "Bool variable requried"
    }
    return "";
  }

  private getNumberErrorMessage(): string {
    if (!this.hasNumericVariable()) {
      return "Number variable requried"
    }

    if (!this.isCorrectNumberInput()) {
      return "Numeric value required";
    }
    return "";
  }

  private isCorrectNumberInput(): boolean {
    return this.hasNumericVariable() && this.hasValue() && this.isNumeric(this.expectedValue);
  }

  private hasValue(): boolean {
    return this.conditionNode.expectedValue !== null && this.conditionNode.expectedValue !== undefined && this.conditionNode.expectedValue !== "";
  }

  private hasBooleanVariable(): boolean {
    return this.variableType === VariableType.BOOL;
  }

  private hasTextVariable(): boolean {
    return this.variableType === VariableType.TEXT;
  }

  private hasNumericVariable(): boolean {
    return this.variableType === VariableType.NUM;
  }

  private hasVariable(): boolean {
    return this.conditionNode.variable !== null && this.conditionNode.variable !== undefined;
  }

  private get expectedValue(): any {
    return this.conditionNode.expectedValue;
  }

  private get variableType(): VariableType {
    return this.conditionNode.variable.type;
  }

  public isTextCondition(): boolean {
    return this.isSpecificCondition(
      [
        ConditionType.STR_EQUAL
      ]);
  }

  public isNumberCondition(): boolean {
    return this.isSpecificCondition(
      [
        ConditionType.EQUAL,
        ConditionType.GREATER,
        ConditionType.GREATER_EQ,
        ConditionType.LESS,
        ConditionType.LESS_EQ
      ]
    );
  }

  public getConditionTypeLabel(type: ConditionType): string {
    switch (type) {
      case ConditionType.EQUAL: return "equal (number)";
      case ConditionType.LESS: return "less than";
      case ConditionType.LESS_EQ: return "less or equal than";
      case ConditionType.GREATER: return "greater than";
      case ConditionType.GREATER_EQ: return "greater or equal than";
      case ConditionType.TRUE: return "true";
      case ConditionType.FALSE: return "false";
      case ConditionType.STR_EQUAL: return "equal (text)";
      default: return "";
    }
  }

  public isBooleanCondition(): boolean {
    return this.isSpecificCondition(
      [
        ConditionType.TRUE,
        ConditionType.FALSE
      ]);
  }

  private isSpecificCondition(allowedTypes: ConditionType[]): boolean {
    return allowedTypes.includes(this.conditionNode.type);
  }

  private isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
