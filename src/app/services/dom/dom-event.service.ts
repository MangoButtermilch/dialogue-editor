import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Edge, Port, Vector2 } from 'src/models/models';
import { EdgeService } from '../dialogue/edge.service';
import { PortService } from '../dialogue/port.service';
import { EditorStateService } from '../editor/editor-state.service';

@Injectable({
  providedIn: 'root'
})
export class DomEventService {

  private domResize$: Subject<void> = new Subject<void>();
  private domDblClick$: Subject<void> = new Subject<void>();
  private domClick$: Subject<void> = new Subject<void>();
  private selectedPort$: Observable<Port | null> = this.editorStateService.onPortSelected();
  private portClickCount: number = 0;

  private domDblClickEventRef: any = null;
  private domClickEventRef: any = null;
  private domResizeEventRef: any = null;
  private domMouseMoveEventRef: any = null;

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

    document.body.addEventListener("click", this.domClickEventRef);
    document.body.addEventListener("dblclick", this.domDblClickEventRef);
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

}
