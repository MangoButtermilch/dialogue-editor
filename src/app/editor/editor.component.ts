import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PanZoomConfig } from 'ngx-panzoom';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommentNode, ConditionNode, Dialogue, DialogueNode, EventNode, RandomNode, RepeatNode, Vector2 } from 'src/models/models';
import { DialogueService } from '../services/dialogue/dialogue.service';
import { EditorStateService } from '../services/editor/editor-state.service';
import { PanZoomService } from '../services/editor/pan-zoom.service';
import { ExportService } from '../services/serialization/export.service';
import { ImportService } from '../services/serialization/import.service';

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
    private exportService: ExportService,
    private importService: ImportService,
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

  public save(): void {
    this.exportService.saveToJson();
  }

  public export(): void {
    this.exportService.exportForEngine();
  }

  public load(): void {
    this.importService.loadFromJson();
  }

}


