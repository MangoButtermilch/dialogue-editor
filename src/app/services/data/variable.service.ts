import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Variable, VariableType } from 'src/models/models';
import { GuidService } from '../editor/guid.service';

@Injectable({
  providedIn: 'root'
})
export class VariableService {


  private variables$: BehaviorSubject<Variable[]> = new BehaviorSubject<Variable[]>([]);
  private variables: Variable[] = [];

  constructor(private guidService: GuidService) { }

  public getVariables(): Observable<Variable[]> {
    return this.variables$.asObservable();
  }

  public addVariable(args: { name: string, value: any, type: VariableType }): void {
    this.variables.push({
      guid: this.guidService.getGuid(),
      name: args.name,
      value: args.value,
      type: args.type
    });
    this.variables$.next(this.variables);
  }

  public updateVariable(variable: Variable): void {
    const index: number = this.variables.findIndex((other: Variable) => other.guid == variable.guid);
    this.variables[index] = variable;
    this.variables$.next(this.variables);
  }

  public removeVariable(guid: string): void {
    const index = this.variables.findIndex((other: Variable) => other.guid === guid);
    this.variables.splice(index, 1);
    this.variables$.next(this.variables);
  }

  public moveItemInArray(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.variables, previousIndex, currentIndex);
    this.variables$.next(this.variables);
  }

  public onVariablesUpdate(): Observable<Variable[]> {
    return this.variables$.asObservable();
  }
}
