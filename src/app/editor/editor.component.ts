import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PanZoomConfig, PanZoomModel } from 'ngx-panzoom';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { DialogueNode, Dialogue, Choice, Vector2, CommentNode, EventNode, ConditionNode, Edge, RandomNode, RepeatNode } from 'src/models/models';
import { CommentService } from '../services/dialogue/comment.service';
import { ConditionService } from '../services/dialogue/condition.service';
import { DialogueService } from '../services/dialogue/dialogue.service';
import { EdgeService } from '../services/dialogue/edge.service';
import { EventNodeService } from '../services/dialogue/event-node.service';
import { NodeService } from '../services/dialogue/node.service';
import { EditorStateService } from '../services/editor/editor-state.service';
import { GuidService } from '../services/editor/guid.service';
import { PanZoomService } from '../services/editor/pan-zoom.service';
import dialogueMockData from '../../assets/mock/dialogue-mock.json';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  panZoomConfig: PanZoomConfig;

  private destroy$: Subject<void> = new Subject<void>();
  public dialogue$: Observable<Dialogue> = this.dialogueService.getDialoge()
    .pipe(takeUntil(this.destroy$))


  public characterModalVisible: boolean = false;
  public helpModalVisible: boolean = false;


  constructor(
    private editorStateService: EditorStateService,
    private dialogueService: DialogueService,
    private panZoomService: PanZoomService) {
    this.panZoomConfig = panZoomService.panZoomConfig;
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.panToOrigin();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changeDialogeName(name: string): void {
    this.dialogueService.updateDialogueName(name);
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
    this.dialogueService.addNewDialogueNode(mousePosition);
  }

  public deleteNode(node: DialogueNode): void {
    this.dialogueService.deleteDialogueNode(node);
  }

  public panToOrigin(): void {
    this.panZoomService.panToOrigin();
  }

  public updateNode(node: DialogueNode): void {
    this.dialogueService.updateDialogueNode(node);
  }

  public openContextMenu(eventData: MouseEvent): void {
    this.editorStateService.openContextMenu(
      { x: eventData.pageX, y: eventData.pageY }
    );
  }

  public generateNewComment(mousePosition: Vector2): void {
    this.dialogueService.addNewComment(mousePosition);
  }

  public updateComment(comment: CommentNode): void {
    this.dialogueService.updateComment(comment);
  }

  public deleteComment(comment: CommentNode): void {
    this.dialogueService.deleteComment(comment);
  }

  public generateNewEventNode(mousePosition: Vector2): void {
    this.dialogueService.addNewEventNode(mousePosition);
  }

  public updateEventNode(event: EventNode): void {
    this.dialogueService.updateEventNode(event);
  }

  public deleteEventNode(event: EventNode): void {
    this.dialogueService.deleteEventNode(event);
  }

  public generateNewConditionNode(mousePosition: Vector2): void {
    this.dialogueService.addNewConditionNode(mousePosition);
  }

  public updateConditionNode(condition: ConditionNode) {
    this.dialogueService.updateConditionNode(condition);
  }

  public deleteConditionNode(condition: ConditionNode) {
    this.dialogueService.deleteConditionNode(condition);
  }

  public generateNewRandomNode(mousePosition: Vector2): void {
    this.dialogueService.addNewRandomNode(mousePosition);
  }

  public generateNewRepeatNode(mousePosition: Vector2): void {
    this.dialogueService.addNewRepeatNode(mousePosition);
  }

  public updateRandomNode(randomNode: RandomNode): void {
    this.dialogueService.updateRandomNode(randomNode);
  }

  public deleteRandomNode(randomNode: RandomNode): void {
    this.dialogueService.deleteRandomNode(randomNode);
  }

  public updateRepeatNode(repeatNode: RepeatNode): void {
    this.dialogueService.updateRepeatNode(repeatNode);
  }

  public deleteRepeatNode(repeatNode: RepeatNode): void {
    this.dialogueService.deleteRepeatNode(repeatNode);
  }


  /**
   * Placeholder
   */
  public save(): void {
    console.log(
    );
  }

  public load(): void {

  }

}


