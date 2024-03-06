import { Injectable } from '@angular/core';
import { Vector2, RandomNode, Possibility, RepeatNode } from 'src/models/models';
import { GuidService } from '../editor/guid.service';
import { PortService } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class RepeatService {

  constructor(
    private portService: PortService,
    private guidService: GuidService) { }

  public generateRepeatNode(position: Vector2 | null = null): RepeatNode {
    const guid: string = this.guidService.getGuid();

    return new RepeatNode(
      guid,
      position ?? { x: 0, y: 0 },
      1,
      this.portService.generateInputPort(guid),
      this.portService.generateOutputPort(guid)
    );
  }

}
