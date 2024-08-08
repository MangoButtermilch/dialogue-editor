import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Choice, Edge, Port, Vector2 } from 'src/models/models';

@Injectable({
  providedIn: 'root'
})
export class EditorStateService {

  private contextMenuOpenState$: BehaviorSubject<Vector2 | null> = new BehaviorSubject<Vector2 | null>(null);
  private draggingChoiceState$: Subject<Choice | null> = new Subject<Choice | null>();
  private selectedPortState$: ReplaySubject<Port | null> = new ReplaySubject<Port | null>();
  private selectedEdgeState$: BehaviorSubject<Edge | null> = new BehaviorSubject<Edge | null>(null);
  private deletedEdgeState$: BehaviorSubject<Edge | null> = new BehaviorSubject<Edge | null>(null);

  constructor() { }

  /**
   * @returns Observable of Port or null. Port contains the current Port instance that has been selected.
   * Null indicates that no Port is selected any more.
   */
  public onPortSelected(): Observable<Port | null> {
    return this.selectedPortState$.asObservable();
  }

  public selectPort(port: Port): void {
    this.selectedPortState$.next(port);
  }

  public deselectPort(): void {
    this.selectedPortState$.next(null);
  }

  /**
   * @returns Observable of Choice or null. Choice contains the current choice instance that is dragged.
   * Null indicates that no choice is dragged any more.
   */
  public onChoiceDrag(): Observable<Choice | null> {
    return this.draggingChoiceState$.asObservable();
  }

  public dragStartChoice(choice: Choice): void {
    this.draggingChoiceState$.next(choice);
  }

  /**
   * Automatically clears dragging choice state after Choice instance as been emitted.
   * @param choice Dragged Choice instance
   */
  public dragEndChoice(choice: Choice): void {
    this.draggingChoiceState$.next(choice);
    this.draggingChoiceState$.next(null);
  }


  public openContextMenu(position: Vector2): void {
    this.contextMenuOpenState$.next(position);
  }

  public closeContextMenu(): void {
    this.contextMenuOpenState$.next(null);
  }

  /**
   * @returns Observable of Vector2 or null. Vector2 indicates where we want to open the context menu.
   * null indicates to close the menu
   */
  public onContextMenuStateChange(): Observable<Vector2 | null> {
    return this.contextMenuOpenState$.asObservable();
  }

  /**
   * Use to get current selected edge. Edge is defined as selected when user hovers with mouse over it.
   * Handled inside canvas component.
   * @returns Observable of currently selected edge or null if nothing selected.
   */
  public onEdgeSelected(): Observable<Edge | null> {
    return this.selectedEdgeState$.asObservable();
  }

  public selectEdge(edge: Edge): void {
    this.selectedEdgeState$.next(edge);
  }

  public deselectEdge(): void {
    this.selectedEdgeState$.next(null);
  }

  /**
   * Set the state for the edge that has been deleted right now.
   * @param edge 
   */
  public setDeleteEdge(edge: Edge): void {
    this.deletedEdgeState$.next(edge);
  }

  public onEdgeDeleted(): Observable<Edge | null> {
    return this.deletedEdgeState$.asObservable();
  }
}
