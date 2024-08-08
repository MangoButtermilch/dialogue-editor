import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character, CommentNode, ConditionNode, Dialogue, DialogueNode, EventNode, RandomNode, RepeatNode, Variable, Vector2 } from 'src/models/models';
import { DialougeFactoryService } from './dialouge-factory.service';
import { EdgeService } from './edge.service';
import { PortService } from './port.service';
import { GuidService } from 'src/app/core/services/guid.service';
import { CharacterService } from '../../editor/services/character.service';
import { GuiElementService } from '../../editor/services/gui-element.service';
import { VariableService } from '../../editor/services/variable.service';


@Injectable({
  providedIn: 'root'
})
export class DialogueService {

  private dialogue: Dialogue = this.generateDialogue();
  private dialogue$: BehaviorSubject<Dialogue> = new BehaviorSubject<Dialogue>(this.dialogue);

  private variables$: Observable<Variable[]> = this.variableService.getVariables();
  private characters$: Observable<Character[]> = this.characterService.getCharacters();


  constructor(
    private dialogueFactory: DialougeFactoryService,
    private edgeService: EdgeService,
    private guidService: GuidService,
    private guiElementService: GuiElementService,
    private variableService: VariableService,
    private characterService: CharacterService,
    private portService: PortService) {


    this.handleVarialesChange();
    this.handleCharactersChange();
  }

  /**
   * generateEdgesAfterImport() does not update the dialogue stream so we don't need to wait for it.
   * @param dialogue Object passed by import service
   */
  public loadImportedDialogue(dialogue: Dialogue): void {
    this.destroyDialouge();

    this.dialogue = dialogue;

    /**
     * TODO: Without setTimeout() dialogue.nodes has an element with index -1
     * that should not exist. This is bad for the port-service since to many ports are created and
     * the edgeservice will then create duplicate edges.
     */
    setTimeout(() => {
      this.variableService.loadImportedVariables(dialogue.variables);
      this.characterService.loadImportedCharacters(dialogue.characters);
      this.portService.loadImportedPorts(dialogue);
      this.edgeService.generateEdgesAfterImport();
    }, 1);

    this.updateDialogue();
  }

  public generateDialogue(): Dialogue {
    const guid: string = this.guidService.getGuid();
    return new Dialogue(
      "New Dialogue",
      guid,
      new Date().toUTCString(),
      [this.dialogueFactory.generateDialogueNode(true)],
    );
  }

  /**
   * @returns Observable of current Dialogue object
   */
  public getDialoge(): Observable<Dialogue> {
    return this.dialogue$.asObservable();
  }

  /**
   * Sets dialouge object to null and updates stream.
   */
  private destroyDialouge(): void {
    this.dialogue = null;
    this.updateDialogue();
  }

  public updateDialogueName(newName: string): void {
    this.dialogue.name = newName;
    this.updateDialogue();
  }

  /**
   * Updates dialogue observable with current dialogue object.
   * Call after every change to dialogue object.
   */
  private updateDialogue() {
    this.dialogue$.next(this.dialogue);
  }

  /**
   * Subscribes to variable-service to keep variables for dialogue object updated.
   */
  private handleVarialesChange(): void {
    this.variables$.subscribe((vars: Variable[]) => {
      this.dialogue.variables = vars;
      this.updateDialogue();
    })
  }

  /**
   * Subscribes to character-service to keep characters for dialogue object updated.
   */
  private handleCharactersChange(): void {
    this.characters$.subscribe((chars: Character[]) => {
      this.dialogue.characters = chars;
      this.updateDialogue();
    });
  }

  /**
   * Create new dialogue node at mouse position or at center if null
   * @param mousePosition
   */
  public addNewDialogueNode(mousePosition: Vector2 | null = null): void {
    this.dialogue.addDialogueNode(
      this.dialogueFactory.generateDialogueNode(false, this.guiElementService.getInstantiatePosition(mousePosition))
    );
    this.updateDialogue();
  }

  /**
   *
   * @param dialogueNode updated dialoge node.
   */
  public updateDialogueNode(dialogueNode: DialogueNode): void {
    this.dialogue.updateDialogueNode(dialogueNode);
    this.updateDialogue();
  }

  /**
   * Delete a dialogue node. Won't delete root node.
   * @param dialogueNode
   */
  public deleteDialogueNode(dialogueNode: DialogueNode): void {
    if (dialogueNode.isRoot) return;
    this.edgeService.removeEdgesForNode(dialogueNode);
    this.portService.removePortsForNode(dialogueNode);
    this.dialogue.removeDialogueNode(dialogueNode);
    this.updateDialogue();
  }

  /**
   * Adds new comment to dialogue.
   * @param mousePosition can not be null since comments can only be added via context menu.
   */
  public addNewComment(mousePosition: Vector2) {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);
    this.dialogue.addCommentNode(
      this.dialogueFactory.generateComment(instantiatePos)
    );
    this.updateDialogue();
  }

  /**
   * Use to update a comment.
   * @param comment
   */
  public updateComment(comment: CommentNode): void {
    this.dialogue.updateCommentNode(comment);
    this.updateDialogue();
  }

  /**
   * Use to delete a comment.
   * @param comment
   */
  public deleteComment(comment: CommentNode): void {
    this.dialogue.removeCommentNode(comment);
    this.updateDialogue();
  }

  /**
   * Create a new event node at mouse position (passed from context menu).
   * @param mousePosition
   */
  public addNewEventNode(mousePosition: Vector2): void {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);
    this.dialogue.addEventNode(
      this.dialogueFactory.generateEventNode(instantiatePos)
    );
    this.updateDialogue();
  }

  /**
   * Use to update a event node
   * @param event
   */
  public updateEventNode(event: EventNode): void {
    this.dialogue.updateEventNode(event);
    this.updateDialogue();
  }

  /**
   * Use to delete a event node
   * @param event
   */
  public deleteEventNode(event: EventNode): void {
    this.edgeService.removeEdgesForEvent(event);
    this.portService.removePortsForEvent(event);
    this.dialogue.removeEventNode(event);
    this.updateDialogue();
  }

  /**
   * Use to create new condition as mouse position (passed from context menu).
   * @param mousePosition
   */
  public addNewConditionNode(mousePosition: Vector2): void {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);
    this.dialogue.addConditionNode(
      this.dialogueFactory.generateConditionNode(instantiatePos)
    );
    this.updateDialogue();
  }

  /**
   * Use to update a condition
   * @param condition
   */
  public updateConditionNode(condition: ConditionNode) {
    this.dialogue.updateConditionNode(condition);
    this.updateDialogue();
  }

  /**
   * Use to delete a condition
   * @param condition
   */
  public deleteConditionNode(condition: ConditionNode) {
    this.edgeService.removeEdgesForCondition(condition);
    this.portService.removePortsForCondition(condition);
    this.dialogue.removeConditionNode(condition);
    this.updateDialogue();
  }


  public addNewRandomNode(mousePosition: Vector2): void {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);
    this.dialogue.addRandomNode(
      this.dialogueFactory.generateRandomNode(instantiatePos)
    );
    this.updateDialogue();
  }

  public updateRandomNode(node: RandomNode) {
    this.dialogue.updateRandomNode(node);
    this.updateDialogue();
  }

  public deleteRandomNode(node: RandomNode) {
    this.edgeService.removeEdgesForRandomNode(node);
    this.portService.removePortsForRandomNode(node);
    this.dialogue.removeRandomNode(node);
    this.updateDialogue();
  }


  public addNewRepeatNode(mousePosition: Vector2): void {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);
    this.dialogue.addRepeatNode(
      this.dialogueFactory.generateRepeatNode(instantiatePos)
    );
    this.updateDialogue();
  }

  public updateRepeatNode(node: RepeatNode) {
    this.dialogue.updateRepeatNode(node);
    this.updateDialogue();
  }

  public deleteRepeatNode(node: RepeatNode) {
    this.edgeService.removeEdgesForRepeatNode(node);
    this.portService.removePortsForRepeatNode(node);
    this.dialogue.removeRepeatNode(node);
    this.updateDialogue();
  }
}
