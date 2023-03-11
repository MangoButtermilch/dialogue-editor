import { Injectable } from '@angular/core';
import { Dialogue } from 'src/models/models';
import { GuidService } from '../editor/guid.service';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root'
})
export class DialogueService {

  constructor(
    private guidService: GuidService,
    private nodeService: NodeService) { }

  public generateDialogue(): Dialogue {
    const guid: string = this.guidService.getGuid();
    return new Dialogue(
      "New Dialogue",
      guid,
      new Date("now").toUTCString(),
      [this.nodeService.generateNode(true)]
    );
  }
}
