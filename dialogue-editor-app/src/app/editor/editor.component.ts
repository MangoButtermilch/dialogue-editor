import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PanZoomConfig, PanZoomModel } from 'ngx-panzoom';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DialogueNode, Dialogue, Choice, Vector2 } from 'src/models/models';
import { DialogueService } from '../services/dialogue/dialogue.service';
import { EdgeService } from '../services/dialogue/edge.service';
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

  public characterModalVisible: boolean = false;
  public helpModalVisible: boolean = false;

  constructor(
    private editorStateService: EditorStateService,
    private dialogueService: DialogueService,
    private edgeService: EdgeService,
    private nodeService: NodeService,
    private panZoomService: PanZoomService) {
    this.panZoomConfig = panZoomService.panZoomConfig;
  }

  ngOnInit(): void {

    this.panZoomService.panZoomConfig.modelChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe((model: PanZoomModel) => {
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

  public generateNewNode(position: Vector2 | null = null): void {
    const instantiatePos = position
      ? { x: position.x + this.panPosition.x, y: position.y + this.panPosition.y }
      : null;

    this.dialogue.nodes.push(
      this.nodeService.generateNode(false, instantiatePos)
    );
  }

  public generateNewComment(position: Vector2 | null = null): void {
    const instantiatePos = position
      ? { x: position.x + this.panPosition.x, y: position.y + this.panPosition.y }
      : null;

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

  public focusNode(node: DialogueNode): void {
    const target = document.getElementById(node.guid);
    const rect = target.getBoundingClientRect();

    this.panZoomService.panTo({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
  };

  public updateNode(node: DialogueNode): void {
    const index = this.dialogue.nodes.findIndex((other: DialogueNode) => other.guid === node.guid);
    this.dialogue.nodes[index] = node;
  }

  public openContextMenu(eventData: MouseEvent): void {
    this.editorStateService.openContextMenu(
      { x: eventData.pageX, y: eventData.pageY }
    );
  }
}

