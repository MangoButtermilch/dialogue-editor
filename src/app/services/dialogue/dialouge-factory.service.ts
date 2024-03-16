import { Injectable } from '@angular/core';
import { Vector2, RandomNode, Possibility, RepeatNode, DialogueNode, Choice, CommentNode, ConditionNode, ConditionType, EventNode } from 'src/models/models';
import { CharacterService } from '../data/character.service';
import { GuidService } from '../editor/guid.service';
import { PortService } from './port.service';

@Injectable({
  providedIn: 'root'
})
export class DialougeFactoryService {

  private readonly commentDefaultColor: string = "#198754";

  constructor(
    private portService: PortService,
    private guidService: GuidService,
    private characterService: CharacterService) { }

  /**
   * 
   * @param position
   * @returns new EventNode
   */
  public generateEventNode(position: Vector2 | null = null): EventNode {
    const guid: string = this.guidService.getGuid();
    return new EventNode(
      guid,
      position ?? { x: 0, y: 0 },
      "newEvent",
      this.portService.generateInputPort(guid),
      this.portService.generateOutputPort(guid)
    );
  }

  /**
   * @param position
   * @returns new ConditionNode
   */
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

  /**
   * 
   * @param position
   * @returns new Comment
   */
  public generateComment(position: Vector2 | null = null): CommentNode {
    return new CommentNode(
      this.guidService.getGuid(),
      position ?? { x: 0, y: 0 },
      this.commentDefaultColor,
      ""
    );
  }

  /**
   * @param isRoot Should be true for the first node only.
   * @param position
   * @returns New DialogeNode
   */
  public generateDialogueNode(isRoot: boolean = false, position: Vector2 | null = null): DialogueNode {
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
        this.generateChoiceForNode(guid)
      ]
    );
  }

  /**
   * @param parentNodeGuid guid of DialogueNode
   * @returns new Choice
   */
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

  /**
   * @param position
   * @returns new RepeatNode
   */
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


  /**
   * @param position
   * @returns new RandomNode
   */
  public generateRandomNode(position: Vector2 | null = null): RandomNode {
    const guid: string = this.guidService.getGuid();

    return new RandomNode(
      guid,
      position ?? { x: 0, y: 0 },
      this.portService.generateInputPort(guid),
      []
    );
  }

  /**
   * @param parentGuid guid of RandomNode
   * @returns new Possibility for RandomNode
   */
  public generatePossibility(parentGuid: string): Possibility {
    return new Possibility(
      this.guidService.getGuid(),
      { x: 0, y: 0 },
      parentGuid,
      this.portService.generateOutputPort(parentGuid),
    );
  }
}
