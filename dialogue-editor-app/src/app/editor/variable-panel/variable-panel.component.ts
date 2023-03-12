import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { VariableService } from 'src/app/services/data/variable.service';
import { Variable, VariableType } from 'src/models/models';

@Component({
  selector: 'app-variable-panel',
  templateUrl: './variable-panel.component.html',
  styleUrls: ['./variable-panel.component.scss']
})
export class VariablePanelComponent implements OnInit {

  public variables$: Observable<Variable[]> = this.variableService.getVariables();

  constructor(private variableService: VariableService) { }

  ngOnInit(): void {

  }

  public generateVariable(): void {
    this.variableService.addVariable({ name: "newVariable", value: "0", type: VariableType.BOOL })
  }

  public updateVariable(variable: Variable): void {
    this.variableService.updateVariable(variable);
  }

  public deleteVariable(variable: Variable): void {
    this.variableService.removeVariable(variable.guid);
  }

}
