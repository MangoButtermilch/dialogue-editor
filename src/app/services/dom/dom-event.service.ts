import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Port, Vector2 } from 'src/models/models';
import { EditorStateService } from '../editor/editor-state.service';

enum CommandType {
  UNDO,
  REDO
}

@Injectable({
  providedIn: 'root'
})
export class DomEventService {

  private domResize$: Subject<void> = new Subject<void>();
  private domDblClick$: Subject<void> = new Subject<void>();
  private domClick$: Subject<void> = new Subject<void>();

  private selectedPort$: Observable<Port | null> = this.editorStateService.onPortSelected();

  private undoState$: Subject<void> = new Subject<void>();
  private redoState$: Subject<void> = new Subject<void>();

  private portClickCount: number = 0;

  private domDblClickEventRef: any = null;
  private domClickEventRef: any = null;
  private domResizeEventRef: any = null;
  private domMouseMoveEventRef: any = null;
  private domKeyDownEventRef: any = null;
  private domKeyUpEventRef: any = null;

  private mousePosition: Vector2 = { x: 0, y: 0 };


  constructor(private editorStateService: EditorStateService) {
    this.addDomEvents();

    //Everytime a new port has been selected or deselected, we can reset the click count
    this.selectedPort$
      .subscribe((port: Port | null) => {
        this.portClickCount = 0;
      });
  }

  private addDomEvents(): void {
    this.domDblClickEventRef = (event: any) => this.domDblClickEvent(event);
    this.domClickEventRef = (event: any) => this.domClickEvent(event);
    this.domResizeEventRef = (event: any) => this.domResizeEvent(event);
    this.domMouseMoveEventRef = (event: any) => this.domMouseMoveEvent(event);
    this.domKeyDownEventRef = (event: any) => this.domKeyDownEvent(event);
    this.domKeyUpEventRef = (event: any) => this.domKeyUpEvent(event);

    document.body.addEventListener("click", this.domClickEventRef);
    document.body.addEventListener("dblclick", this.domDblClickEventRef);
    window.addEventListener("resize", this.domResizeEventRef);
    window.addEventListener("mousemove", this.domMouseMoveEventRef);
    window.addEventListener("keydown", this.domKeyDownEventRef);
    window.addEventListener("keyup", this.domKeyUpEventRef);
  }

  private lastKeyPress: string = null;
  private lastCommand: CommandType = null;

  private readonly undoKey = "z";
  private readonly redoKey = "y";
  private readonly ctrlKey = "Control";

  /**
   * Keeps track of the mouse position. 
   */
  private domMouseMoveEvent(event: any): void {
    this.mousePosition.x = event.pageX;
    this.mousePosition.y = event.pageY;
  }

  /**
   * Handles click event to abort Port selection and for closing context menu.
   */
  private domClickEvent(event: any): void {
    this.portClickCount++;
    if (this.portClickCount % 2 === 0) {
      this.editorStateService.deselectPort();
    }
    this.editorStateService.closeContextMenu();
    this.domClick$.next();
  }

  /**
   * Handles dobule click event to remove edges
   */
  private domDblClickEvent(event: any): void {
    this.domDblClick$.next();
  }

  private domResizeEvent(event: any): void {
    this.domResize$.next();
  }

  public onDomResize(): Observable<void> {
    return this.domResize$.asObservable();
  }

  public onDomDblClick(): Observable<void> {
    return this.domDblClick$.asObservable();
  }

  public onDomClick(): Observable<void> {
    return this.domClick$.asObservable();
  }

  public getMousePosition(): Vector2 {
    return this.mousePosition;
  }

  public onUndo(): Observable<void> {
    return this.undoState$.asObservable();
  }

  public onRedo(): Observable<void> {
    return this.redoState$.asObservable();
  }

  private domKeyUpEvent(event: KeyboardEvent): void {
    this.handleUndoRedoUp(event);
  }

  private domKeyDownEvent(event: KeyboardEvent): void {
    this.handleUndoRedoDown(event);
  }

  /**
   * Handles Undo/Redo actions for keyup event
   * @param event 
   */
  private handleUndoRedoUp(event: KeyboardEvent): void {
    if (event.key === this.ctrlKey) {
      this.lastCommand = null;
      this.lastKeyPress = null;
    }
  }

  /**
   * Handles Undo/Redo actions for keydown event
   * @param event 
   */
  private handleUndoRedoDown(event: KeyboardEvent): void {
    const isSameKey = event.key === this.lastKeyPress;
    const isUndo = event.key === this.undoKey;
    const isRedo = event.key === this.redoKey;

    switch (this.lastKeyPress) {
      case this.ctrlKey:
        if (isUndo) {
          this.executeUndo();
          this.lastCommand = CommandType.UNDO;
        }
        if (isRedo) {
          this.executeRedo();
          this.lastCommand = CommandType.REDO;
        }
        break;
      case this.undoKey:
        if (isSameKey && this.lastCommand === CommandType.UNDO) {
          this.executeUndo();
        }
        break;
      case this.redoKey:
        if (isSameKey && this.lastCommand === CommandType.REDO) {
          this.executeRedo();
        }
        break;
      default: break;
    }

    this.lastKeyPress = event.key;
  }

  private executeUndo(): void {
    this.undoState$.next();
  }

  private executeRedo(): void {
    this.redoState$.next();
  }
}
