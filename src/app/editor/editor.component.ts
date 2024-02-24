import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PanZoomConfig, PanZoomModel } from 'ngx-panzoom';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { DialogueNode, Dialogue, Choice, Vector2, CommentNode, EventNode, ConditionNode } from 'src/models/models';
import { CommentService } from '../services/dialogue/comment.service';
import { ConditionService } from '../services/dialogue/condition.service';
import { DialogueService } from '../services/dialogue/dialogue.service';
import { EdgeService } from '../services/dialogue/edge.service';
import { EventNodeService } from '../services/dialogue/event-node.service';
import { NodeService } from '../services/dialogue/node.service';
import { EditorStateService } from '../services/editor/editor-state.service';
import { GuidService } from '../services/editor/guid.service';
import { PanZoomService } from '../services/editor/pan-zoom.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  panZoomConfig: PanZoomConfig;

  public dialogue: Dialogue = this.dialogueService.generateDialogue();

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private panPosition: Vector2 = { x: 0, y: 0 };
  private panZoomLevel: number = 2;

  public characterModalVisible: boolean = false;
  public helpModalVisible: boolean = false;

  private panZoomChanged$: Observable<PanZoomModel> = this.panZoomService.panZoomConfig.modelChanged
    .pipe(takeUntil(this.destroy$));

  constructor(
    private conditionService: ConditionService,
    private eventNodeService: EventNodeService,
    private commentService: CommentService,
    private editorStateService: EditorStateService,
    private dialogueService: DialogueService,
    private edgeService: EdgeService,
    private nodeService: NodeService,
    private panZoomService: PanZoomService) {
    this.panZoomConfig = panZoomService.panZoomConfig;
  }

  ngOnInit(): void {

    this.panZoomChanged$.subscribe((model: PanZoomModel) => {
      this.panZoomLevel = model.zoomLevel;
      this.panPosition.x = Math.round(model.pan.x);
      this.panPosition.y = Math.round(model.pan.y);
    });
  }

  ngAfterViewInit(): void {
    this.panToOrigin();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public hideAllModals(): void {
    this.helpModalVisible = false;
    this.characterModalVisible = false;
  }

  public showCharacterModal(): void {
    this.characterModalVisible = true;
  }

  public showHelpModal(): void {
    this.helpModalVisible = true;
  }

  public generateNewNode(mousePosition: Vector2 | null = null): void {
    const instantiatePos = mousePosition !== null ?
      this.getInstantiatePosition(mousePosition) :
      null;

    this.dialogue.nodes.push(
      this.nodeService.generateNode(false, instantiatePos)
    );
  }

  public deleteNode(node: DialogueNode): void {
    if (node.isRoot) return;

    this.edgeService.removeAllEdgesFor(node.inPort);

    node.choices.forEach((c: Choice) => {
      this.edgeService.removeAllEdgesFor(c.outPort)
    });
    this.dialogue.nodes = this.dialogue.nodes.filter((other: DialogueNode) => other.guid !== node.guid);

  }

  public panToOrigin(): void {
    this.panZoomService.panToOrigin();
  }

  public updateNode(node: DialogueNode): void {
    const index = this.dialogue.nodes.findIndex((other: DialogueNode) => other.guid === node.guid);
    this.dialogue.nodes[index] = node;
  }

  public openContextMenu(eventData: MouseEvent): void {
    this.editorStateService.openContextMenu(
      { x: eventData.pageX, y: eventData.pageY }
    );
  }

  public generateNewComment(mousePosition: Vector2): void {
    const instantiatePos = this.getInstantiatePosition(mousePosition);

    this.dialogue.comments.push(
      this.commentService.generateComment(instantiatePos)
    );
  }

  public updateComment(comment: CommentNode): void {
    const index = this.dialogue.comments.findIndex((other: CommentNode) => other.guid === comment.guid);
    this.dialogue.comments[index] = comment;
  }

  public deleteComment(comment: CommentNode): void {
    const index = this.dialogue.comments.findIndex((other: CommentNode) => other.guid === comment.guid);
    this.dialogue.comments.splice(index, 1);
  }

  public generateNewEventNode(mousePosition: Vector2): void {
    const instantiatePos = this.getInstantiatePosition(mousePosition);

    this.dialogue.events.push(
      this.eventNodeService.generateNode(instantiatePos)
    );
  }

  public updateEventNode(event: EventNode): void {
    const index = this.dialogue.events.findIndex((other: EventNode) => other.guid === event.guid);
    this.dialogue.events[index] = event;
  }

  public deleteEventNode(event: EventNode): void {
    this.edgeService.removeAllEdgesFor(event.inPort);
    this.edgeService.removeAllEdgesFor(event.outPort);

    const index = this.dialogue.events.findIndex((other: EventNode) => other.guid === event.guid);
    this.dialogue.events.splice(index, 1);
  }

  public generateNewConditionNode(mousePosition: Vector2): void {
    const instantiatePos = this.getInstantiatePosition(mousePosition);

    this.dialogue.conditions.push(
      this.conditionService.generateConditionNode(instantiatePos)
    );
  }

  public updateConditionNode(condition: ConditionNode) {
    const index = this.dialogue.conditions.findIndex((other: ConditionNode) => other.guid === condition.guid);
    this.dialogue.conditions[index] = condition;
  }

  public deleteConditionNode(condition: ConditionNode) {
    this.edgeService.removeAllEdgesFor(condition.inPort);
    this.edgeService.removeAllEdgesFor(condition.outPort);

    const index = this.dialogue.conditions.findIndex((other: ConditionNode) => other.guid === condition.guid);
    this.dialogue.conditions.splice(index, 1);
  }

  /**
   * Placeholder
   */
  public save(): void {
    console.log(
      JSON.stringify(this.dialogue)
    );
  }

  public load(): void {
    //    console.log(JSON.parse(s));
  }

  private getInstantiatePosition(mousePosition: Vector2) {
    const x: number = (mousePosition.x - this.panPosition.x) * this.zoomMultiplier;
    const y: number = (mousePosition.y - this.panPosition.y) * this.zoomMultiplier;

    return { x: x, y: y }
  }

  private get zoomMultiplier() {
    return this.zoomLevelToMultiplierMap.get(this.panZoomLevel);
  }

  /**
   * Holds information about how to multiply a position in the editor by a given zoom level.
   * 3 is most zoom in and 0 is furthest zoom out.
   */
  private readonly zoomLevelToMultiplierMap: Map<number, number> = new Map(
    [
      [3, 0.5],
      [2, 1],
      [1, 2],
      [0, 4]
    ]
  );


}


