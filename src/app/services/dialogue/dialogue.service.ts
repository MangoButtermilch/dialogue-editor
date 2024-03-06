import { Injectable } from '@angular/core';
import { PanZoomModel } from 'ngx-panzoom';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { Choice, CommentNode, ConditionNode, Dialogue, DialogueNode, EventNode, Possibility, RandomNode, RepeatNode, Vector2 } from 'src/models/models';
import { EditorStateService } from '../editor/editor-state.service';
import { GuiElementService } from '../editor/gui-element.service';
import { GuidService } from '../editor/guid.service';
import { PanZoomService } from '../editor/pan-zoom.service';
import { CommentService } from './comment.service';
import { ConditionService } from './condition.service';
import { EdgeService } from './edge.service';
import { EventNodeService } from './event-node.service';
import { NodeService } from './node.service';
import { RandomNodeService } from './random-node.service';
import { RepeatService } from './repeat.service';

@Injectable({
  providedIn: 'root'
})
export class DialogueService {

  private dialogue: Dialogue = this.generateDialogue();
  private dialogue$: BehaviorSubject<Dialogue> = new BehaviorSubject<Dialogue>(this.dialogue);

  private panZoomChanged$: Observable<PanZoomModel> = this.panZoomService.panZoomConfig.modelChanged;
  private panPosition: Vector2 = { x: 0, y: 0 };
  private panZoomLevel: number = 2;

  constructor(
    private guiElementService: GuiElementService,
    private conditionService: ConditionService,
    private eventNodeService: EventNodeService,
    private commentService: CommentService,
    private randomNodeService: RandomNodeService,
    private repeatService: RepeatService,
    private edgeService: EdgeService,
    private panZoomService: PanZoomService,
    private guidService: GuidService,
    private nodeService: NodeService) {
    this.handlePanZoomChange();
  }

  private handlePanZoomChange(): void {
    this.panZoomChanged$
      .subscribe((model: PanZoomModel) => {
        this.panZoomLevel = model.zoomLevel;
        this.panPosition.x = Math.round(model.pan.x);
        this.panPosition.y = Math.round(model.pan.y);
      });
  }

  public generateDialogue(): Dialogue {
    const guid: string = this.guidService.getGuid();
    return new Dialogue(
      "New Dialogue",
      guid,
      new Date("now").toUTCString(),
      [this.nodeService.generateNode(true)],
    );
  }

  /**
   * @returns Observable of current Dialogue object
   */
  public getDialoge(): Observable<Dialogue> {
    return this.dialogue$.asObservable();
  }

  /**
   * Use to change dialogue name. Will update dialogue stream.
   * @param name new name for our Dialogue
   */
  public changeDialogueName(name: string): void {
    this.dialogue.name = name;
    this.updateDialogue();
  }

  /**
   * Create new dialogue node at mouse position or at center if null
   * @param mousePosition 
   */
  public addNewDialogueNode(mousePosition: Vector2 | null = null): void {
    this.dialogue.nodes.push(
      this.nodeService.generateNode(false, this.guiElementService.getInstantiatePosition(mousePosition))
    );
    this.updateDialogue();
  }

  /**
   * 
   * @param dialogueNode updated dialoge node.
   */
  public updateDialogueNode(dialogueNode: DialogueNode): void {
    const index = this.dialogue.nodes
      .findIndex((other: DialogueNode) => other.guid === dialogueNode.guid);
    this.dialogue.nodes[index] = dialogueNode;

    this.updateDialogue();
  }

  /**
   * Delete a dialogue node. Won't delete root node. 
   * @param dialogueNode 
   */
  public deleteDialogueNode(dialogueNode: DialogueNode): void {
    if (dialogueNode.isRoot) return;

    //port for incoming connections
    this.edgeService.removeAllEdgesFor(dialogueNode.inPort);

    //ports for outgoing connections
    dialogueNode.choices.forEach((choice: Choice) => {
      this.edgeService.removeAllEdgesFor(choice.outPort)
    });

    //remove by filter
    this.dialogue.nodes = this.dialogue.nodes
      .filter((other: DialogueNode) => other.guid !== dialogueNode.guid);

    this.updateDialogue();
  }

  /**
   * Adds new comment to dialogue.
   * @param mousePosition can not be null since comments can only be added via context menu.
   */
  public addNewComment(mousePosition: Vector2) {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);

    this.dialogue.comments.push(
      this.commentService.generateComment(instantiatePos)
    );

    this.updateDialogue();
  }

  /**
   * Use to update a comment.
   * @param comment 
   */
  public updateComment(comment: CommentNode): void {
    const index = this.dialogue.comments
      .findIndex((other: CommentNode) => other.guid === comment.guid);

    this.dialogue.comments[index] = comment;

    this.updateDialogue();
  }

  /**
   * Use to delete a comment.
   * @param comment 
   */
  public deleteComment(comment: CommentNode): void {
    const index = this.dialogue.comments
      .findIndex((other: CommentNode) => other.guid === comment.guid);

    this.dialogue.comments.splice(index, 1);

    this.updateDialogue();
  }

  /**
   * Create a new event node at mouse position (passed from context menu).
   * @param mousePosition 
   */
  public addNewEventNode(mousePosition: Vector2): void {
    const instantiatePos = this.guiElementService
      .getInstantiatePosition(mousePosition);

    this.dialogue.events.push(
      this.eventNodeService.generateNode(instantiatePos)
    );

    this.updateDialogue();
  }

  /**
   * Use to update a event node
   * @param event 
   */
  public updateEventNode(event: EventNode): void {
    const index = this.dialogue.events
      .findIndex((other: EventNode) => other.guid === event.guid);
    this.dialogue.events[index] = event;
    this.updateDialogue();
  }

  /**
   * Use to delete a event node
   * @param event 
   */
  public deleteEventNode(event: EventNode): void {
    this.edgeService.removeAllEdgesFor(event.inPort);
    this.edgeService.removeAllEdgesFor(event.outPort);

    const index = this.dialogue.events.findIndex((other: EventNode) => other.guid === event.guid);
    this.dialogue.events.splice(index, 1);
    this.updateDialogue();
  }

  /**
   * Use to create new condition as mouse position (passed from context menu).
   * @param mousePosition 
   */
  public addNewConditionNode(mousePosition: Vector2): void {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);

    this.dialogue.conditions.push(
      this.conditionService.generateConditionNode(instantiatePos)
    );
    this.updateDialogue();
  }

  /**
   * Use to update a condition
   * @param condition 
   */
  public updateConditionNode(condition: ConditionNode) {
    const index = this.dialogue.conditions
      .findIndex((other: ConditionNode) => other.guid === condition.guid);
    this.dialogue.conditions[index] = condition;
    this.updateDialogue();
  }

  /**
   * Use to delete a condition
   * @param condition 
   */
  public deleteConditionNode(condition: ConditionNode) {
    this.edgeService.removeAllEdgesFor(condition.inPort);
    this.edgeService.removeAllEdgesFor(condition.outPort);

    const index = this.dialogue.conditions
      .findIndex((other: ConditionNode) => other.guid === condition.guid);
    this.dialogue.conditions.splice(index, 1);
    this.updateDialogue();
  }

  public updateDialogueName(newName: string): void {
    this.dialogue.name = newName;
    this.updateDialogue();
  }


  public addNewRandomNode(mousePosition: Vector2): void {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);

    this.dialogue.randomNodes.push(
      this.randomNodeService.generateRandomNode(instantiatePos)
    );
    this.updateDialogue();
  }

  public updateRandomNode(node: RandomNode) {
    const index = this.dialogue.randomNodes
      .findIndex((other: RandomNode) => other.guid === node.guid);
    this.dialogue.randomNodes[index] = node;
    this.updateDialogue();
  }

  public deleteRandomNode(node: RandomNode) {
    this.edgeService.removeAllEdgesFor(node.inPort);

    //ports for outgoing connections
    node.possibilites.forEach((possibility: Possibility) => {
      this.edgeService.removeAllEdgesFor(possibility.outPort)
    });

    const index = this.dialogue.randomNodes
      .findIndex((other: RandomNode) => other.guid === node.guid);
    this.dialogue.randomNodes.splice(index, 1);

    this.updateDialogue();
  }


  public addNewRepeatNode(mousePosition: Vector2): void {
    const instantiatePos = this.guiElementService.getInstantiatePosition(mousePosition);

    this.dialogue.repeatNodes.push(
      this.repeatService.generateRepeatNode(instantiatePos)
    );
    this.updateDialogue();
  }

  public updateRepeatNode(node: RepeatNode) {
    const index = this.dialogue.repeatNodes
      .findIndex((other: RepeatNode) => other.guid === node.guid);
    this.dialogue.repeatNodes[index] = node;
    this.updateDialogue();
  }

  public deleteRepeatNode(node: RepeatNode) {
    this.edgeService.removeAllEdgesFor(node.inPort);
    this.edgeService.removeAllEdgesFor(node.outPort);

    const index = this.dialogue.repeatNodes
      .findIndex((other: RepeatNode) => other.guid === node.guid);
    this.dialogue.repeatNodes.splice(index, 1);

    this.updateDialogue();
  }


  /**
   * Updates dialogue stream with dialogue object.
   */
  private updateDialogue() {
    this.dialogue$.next(this.dialogue);
  }

}
