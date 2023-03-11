import { Injectable } from '@angular/core';
import { DialogueNode, Choice, Port } from 'src/models/models';
import { GuidService } from '../editor/guid.service';
import { NodeService } from './node.service';
import { PortService } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class ChoiceService {

  constructor(
    private portService: PortService,
    private guidService: GuidService) { }


  public generateChoiceForNode(parentNodeGuid: string): Choice {
    const guid: string = this.guidService.getGuid();
    return new Choice(
      guid,
      { x: 0, y: 0 },
      parentNodeGuid,
      this.portService.generateOutputPort(parentNodeGuid),
      "",
    )
  }
}
