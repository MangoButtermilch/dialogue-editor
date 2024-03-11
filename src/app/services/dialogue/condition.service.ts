import { Injectable } from '@angular/core';
import { Vector2, DialogueNode, ConditionNode, ConditionType, Variable } from 'src/models/models';
import { GuidService } from '../editor/guid.service';
import { PortService } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class ConditionService {

  constructor(
    private portService: PortService,
    private guidService: GuidService) { }

  
  public generateConditionNode(position?: Vector2): ConditionNode {
    const guid: string = this.guidService.getGuid();

    return new ConditionNode(
      guid,
      position ?? { x: 0, y: 0 },
      ConditionType.EQUAL,
      this.portService.generateInputPort(guid),
      this.portService.generateOutputPort(guid),
      this.portService.generateOutputPort(guid),
      null,
      null
    );
  }
}
