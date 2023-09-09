import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Port, Vector2 } from 'src/models/models';
import { EditorStateService } from '../editor/editor-state.service';

@Injectable({
  providedIn: 'root'
})
export class DomEventService {

  private domResize$: Subject<void> = new Subject<void>();
  private selectedPort$: Observable<Port | null> = this.editorStateService.onPortSelected();
  private portClickCount: number = 0;

  private domClickEventRef: any = null;
  private domResizeEventRef: any = null;
  private domMouseMoveEventRef: any = null;

  private mousePosition: Vector2 = { x: 0, y: 0 };

  constructor(
    private editorStateService: EditorStateService
  ) {
    this.addDomEvents();

    //Everytime a new port has been selected or deselected, we can reset the click count
    this.selectedPort$
      .subscribe((port: Port | null) => {
        this.portClickCount = 0;
      });
  }

  private addDomEvents(): void {
    this.domClickEventRef = (event: any) => this.domClickEvent(event);
    this.domResizeEventRef = (event: any) => this.domResizeEvent(event);
    this.domMouseMoveEventRef = (event: any) => this.domMouseMoveEvent(event);

    document.body.addEventListener("click", this.domClickEventRef);
    window.addEventListener("resize", this.domResizeEventRef);
    window.addEventListener("mousemove", this.domMouseMoveEventRef);
  }

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
  }

  private domResizeEvent(event: any): void {
    this.domResize$.next();
  }

  public onDomResize(): Observable<void> {
    return this.domResize$.asObservable();
  }

  public getMousePosition(): Vector2 {
    return this.mousePosition;
  }

}
