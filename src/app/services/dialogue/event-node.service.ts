import { Injectable } from '@angular/core';
import { Vector2, DialogueNode, EventNode } from 'src/models/models';
import { GuidService } from '../editor/guid.service';
import { PortService } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class EventNodeService {
  constructor(
    private portService: PortService,
    private guidService: GuidService) { }

  public generateNode(position: Vector2 | null = null): EventNode {
    const guid: string = this.guidService.getGuid();
    return new EventNode(
      guid,
      position ?? { x: 0, y: 0 },
      "newEvent",
      this.portService.generateInputPort(guid),
      this.portService.generateOutputPort(guid)
    );
  }
}
