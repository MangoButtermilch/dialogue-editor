import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EditorStateService } from 'src/app/services/editor/editor-state.service';
import { Vector2 } from 'src/models/models';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy {

  @Output() onNewNode: EventEmitter<Vector2> = new EventEmitter<Vector2>();
  @Output() onNewComment: EventEmitter<Vector2> = new EventEmitter<Vector2>();

  public visible: boolean = false;
  public left: string = "";
  public top: string = "";

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

  public newComment(eventData: MouseEvent): void {
    this.onNewComment.emit({ x: eventData.pageX, y: eventData.pageY });
  }
}
