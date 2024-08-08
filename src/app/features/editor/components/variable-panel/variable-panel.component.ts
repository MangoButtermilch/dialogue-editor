import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VariableService } from 'src/app/features/editor/services/variable.service';
import { Variable, VariableType } from 'src/models/models';
import { VariableComponent } from './variable/variable.component';
import { ResizableComponent } from 'src/app/shared/components/resizable/resizable.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  imports: [VariableComponent, ResizableComponent, FontAwesomeModule, CommonModule, CdkDrag, CdkDropList, CdkDragHandle],
  selector: 'app-variable-panel',
  templateUrl: './variable-panel.component.html',
  styleUrls: ['./variable-panel.component.scss']
})
export class VariablePanelComponent implements OnInit {

  public variables$: Observable<Variable[]> = this.variableService.getVariables();

  public iconAdd = faPlus;

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

  public cdkVariableDropped(event: any): void {
    this.variableService.moveItemInArray(event.previousIndex, event.currentIndex);
  }

}
