import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Vector2 } from 'src/models/models';
import { EditorStateService } from '../../services/editor-state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy {

  @Output() onNewNode: EventEmitter<Vector2> = new EventEmitter<Vector2>();
  @Output() onNewComment: EventEmitter<Vector2> = new EventEmitter<Vector2>();
  @Output() onNewConditionNode: EventEmitter<Vector2> = new EventEmitter<Vector2>();
  @Output() onNewRandomNode: EventEmitter<Vector2> = new EventEmitter<Vector2>();
  @Output() onNewRepeatNode: EventEmitter<Vector2> = new EventEmitter<Vector2>();
  @Output() onNewEventNode: EventEmitter<Vector2> = new EventEmitter<Vector2>();

  public visible: boolean = false;
  public left: string = "";
  public top: string = "";

  public iconChevronRight = faChevronRight;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private editorStateService: EditorStateService) { }

  ngOnInit(): void {

    this.editorStateService.onContextMenuStateChange()
      .pipe(takeUntil(this.destroy$))
      .subscribe((position: Vector2 | null) => {
        if (!position) {
          this.visible = false;
          return;
        }

        this.visible = true;
        this.left = `${position.x}px`;
        this.top = `${position.y}px`;
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public newNode(eventData: MouseEvent): void {
    this.onNewNode.emit({ x: eventData.pageX, y: eventData.pageY });
  }

  public newEventNode(eventData: MouseEvent): void {
    this.onNewEventNode.emit({ x: eventData.pageX, y: eventData.pageY });
  }

  public newComment(eventData: MouseEvent): void {
    this.onNewComment.emit({ x: eventData.pageX, y: eventData.pageY });
  }

  public newConditionNode(eventData: MouseEvent): void {
    this.onNewConditionNode.emit({ x: eventData.pageX, y: eventData.pageY });
  }

  public newRandomNode(eventData: MouseEvent): void {
    this.onNewRandomNode.emit({ x: eventData.pageX, y: eventData.pageY });
  }

  public newRepeatNode(eventData: MouseEvent): void {
    this.onNewRepeatNode.emit({ x: eventData.pageX, y: eventData.pageY });
  }
}
