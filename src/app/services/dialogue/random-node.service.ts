import { Injectable } from '@angular/core';
import { DialogueNode, Possibility, RandomNode, Vector2 } from 'src/models/models';
import { GuidService } from '../editor/guid.service';
import { PortService } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class RandomNodeService {

  constructor(
    private portService: PortService,
    private guidService: GuidService) { }

  public generateRandomNode(position: Vector2 | null = null): RandomNode {
    const guid: string = this.guidService.getGuid();

    return new RandomNode(
      guid,
      position ?? { x: 0, y: 0 },
      this.portService.generateInputPort(guid),
      []
    );
  }

  public generatePossibility(parentGuid: string): Possibility {
    return new Possibility(
      this.guidService.getGuid(),
      { x: 0, y: 0 },
      parentGuid,
      this.portService.generateOutputPort(parentGuid),
    );
  }

}
