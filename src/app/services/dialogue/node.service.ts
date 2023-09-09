import { Injectable } from '@angular/core';
import { Choice, DialogueNode, Port, Vector2 } from 'src/models/models';
import { CharacterService } from '../data/character.service';
import { GuidService } from '../editor/guid.service';
import { ChoiceService } from './choice.service';
import { PortService } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(
    private choiceService: ChoiceService,
    private characterService: CharacterService,
    private portService: PortService,
    private guidService: GuidService) { }

  /**
   * @param isRoot Should be true for the first node only.
   * @param position Where the node should be instantiated. If null, node will be instantiated at origin.
   * @returns New DialogeNode object.
   */
  public generateNode(isRoot: boolean = false, position: Vector2 | null = null): DialogueNode {
    const guid: string = this.guidService.getGuid();

    return new DialogueNode(
      guid,
      position ?? { x: 0, y: 0 },
      this.characterService.getDefaultCharacter(),
      "",
      "",
      isRoot,
      this.portService.generateInputPort(guid),
      [
        this.choiceService.generateChoiceForNode(guid)
      ]
    );
  }

}
