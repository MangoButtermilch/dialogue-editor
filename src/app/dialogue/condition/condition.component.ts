import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { VariableService } from 'src/app/services/data/variable.service';
import { ConditionNode, ConditionType, ConditionVariableMap, EventNode, Variable, VariableType } from 'src/models/models';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {

  @Output() onDelete: EventEmitter<ConditionNode> = new EventEmitter<ConditionNode>();
  @Output() onUpdate: EventEmitter<ConditionNode> = new EventEmitter<ConditionNode>();

  @Input() conditionNode: ConditionNode;

  public warnMessage: string = "";
  public varAIndex: number = 0;
  public varBIndex: number = 0;
  public varAtype: string = "";
  public varBtype: string = "";
  public variables$: Observable<Variable[]> = this.variableService.getVariables();
  private variables: Variable[] = [];

  public selectedType: string = "";
  public conditionTypes = ConditionType;

  public hasError: boolean;
  public errorMessage: string;

  private conditionVarMap = ConditionVariableMap;

  constructor(private variableService: VariableService) { }

  ngOnInit(): void {

    this.variables$
      .subscribe((variables: Variable[]) => {
        this.variables = variables;

        if (!variables || variables.length === 0) {
          this.varAIndex = 0;
          this.varBIndex = 0;
          this.errorMessage = "No variables defined";
          this.hasError = true;
          return;
        }

        if (!!this.conditionNode.variableA) {
          this.varAIndex = variables.findIndex((other: Variable) => other.guid === this.conditionNode.variableA.guid);
        } else {
          this.varAIndex = 0;
        }
        this.varAtype = variables[this.varAIndex].type;

        if (!!this.conditionNode.variableB) {
          this.varBIndex = variables.findIndex((other: Variable) => other.guid === this.conditionNode.variableB.guid);
        } else {
          this.varBIndex = 0;
        }
        this.varBtype = variables[this.varBIndex].type;

        this.selectedType = this.conditionNode.type;
        this.handleWarning();
      });
  }

  public handleWarning(): void {
    this.errorMessage = this.getWarnMessage();
    this.hasError = this.errorMessage !== "";
  }


  public onInputVarA(eventData: any) {
    const value = eventData.target.value;
    const index = this.variables.findIndex((other: Variable) => other.guid === value);
    this.varAIndex = index;
    this.conditionNode.variableA = this.variables[index];
    this.handleWarning();

    this.onUpdate.emit(this.conditionNode);
  }

  public onInputType(eventData: any) {
    const value = eventData.target.value;
    this.conditionNode.type = value as ConditionType;
    this.selectedType = value as ConditionType;
    this.handleWarning();
    this.onUpdate.emit(this.conditionNode);
  }

  public onInputVarB(eventData: any) {
    const value = eventData.target.value;
    const index = this.variables.findIndex((other: Variable) => other.guid === value);
    this.varBIndex = index;
    this.conditionNode.variableB = this.variables[index];
    this.handleWarning();
    this.onUpdate.emit(this.conditionNode);
  }

  public isBooleanCondition(): boolean {
    return this.selectedType.toLowerCase() === 'false' || this.selectedType.toLowerCase() === 'true';
  }

  public getWarnMessage(): string {
    if (this.isSameVariable() && !this.isBooleanCondition()) return "Same variables";
    else if (this.isTypeMissmatch() && !this.isBooleanCondition()) return `Type missmatch (${this.varAtype.toLowerCase()} and ${this.varBtype.toLowerCase()})`;
    else if (!this.isConditionTypePossible() && !this.isBooleanCondition()) return `Condition type impossible (${this.varAtype.toLowerCase()} and ${this.varBtype.toLowerCase()} on ${this.selectedType.toLowerCase()})`;
    else if (!this.isConditionTypePossible() && this.isBooleanCondition()) return `Condition type impossible (${this.varAtype.toLowerCase()} on ${this.selectedType.toLowerCase()})`;
    else return "";
  }

  public isConditionTypePossible(): boolean {
    const allowedTypes: string[] = this.conditionVarMap.get(this.selectedType as ConditionType);

    if (this.isBooleanCondition()) {
      return allowedTypes.includes(this.varAtype.toLowerCase());
    }

    return (
      allowedTypes.includes(this.varAtype.toLowerCase()) &&
      allowedTypes.includes(this.varBtype.toLowerCase()));
  }

  public isSameVariable(): boolean {
    return this.varBIndex === this.varAIndex;
  }

  public isTypeMissmatch(): boolean {
    return this.varAtype.toLowerCase() !== this.varBtype.toLowerCase();
  }
}