import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Subject, BehaviorSubject } from 'rxjs';
import { Choice, Edge, Port, Vector2 } from 'src/models/models';
import { EdgeService } from '../dialogue/edge.service';

@Injectable({
  providedIn: 'root'
})
export class EditorStateService {

  private contextMenuOpenState: BehaviorSubject<Vector2 | null> = new BehaviorSubject<Vector2 | null>(null);
  private draggingChoiceState: Subject<Choice | null> = new Subject<Choice | null>();
  private selectedPortState: ReplaySubject<Port | null> = new ReplaySubject<Port | null>();

  constructor(
    private edgeService: EdgeService
  ) { }


  /**
   * @returns Observable of Port or null. Port contains the current Port instance that has been selected.
   * Null indicates that no Port is selected any more.
   */
  public onPortSelected(): Observable<Port | null> {
    return this.selectedPortState.asObservable();
  }

  public selectPort(port: Port): void {
    this.selectedPortState.next(port);
  }

  public deselectPort(): void {
    this.selectedPortState.next(null);
  }

  /**
   * Automatically connects A from B and B from A
   * @param portA 
   * @param portB 
   */
  public connectPort(portA: Port, portB: Port): void {
    this.edgeService.generateEdge(portA, portB);
    portA.connect(portB);
    //portB.connect(portA);
  }

  /**
   * Automatically disonnects A from B and B from A
   * @param portA 
   * @param portB 
   */
  public disconnectPort(portA: Port, portB: Port): void {
    this.edgeService.removeEdgeFor(portA);
    portA.disconnect(portB);
    portB.disconnect(portA);
  }

  /**
   * @returns Observable of Choice or null. Choice contains the current choice instance that is dragged.
   * Null indicates that no choice is dragged any more.
   */
  public onChoiceDrag(): Observable<Choice | null> {
    return this.draggingChoiceState.asObservable();
  }

  public dragStartChoice(choice: Choice): void {
    this.draggingChoiceState.next(choice);
  }

  /**
   * Automatically clears dragging choice state after Choice instance as been emitted.
   * @param choice Dragged Choice instance
   */
  public dragEndChoice(choice: Choice): void {
    this.draggingChoiceState.next(choice);
    this.draggingChoiceState.next(null);
  }


  public openContextMenu(position: Vector2): void {
    this.contextMenuOpenState.next(position);
  }

  public closeContextMenu(): void {
    this.contextMenuOpenState.next(null);
  }

  /**
   * @returns Observable of Vector2 or null. Vector2 indicates where we want to open the context menu.
   * null indicates to close the menu
   */
  public onContextMenuStateChange(): Observable<Vector2 | null> {
    return this.contextMenuOpenState.asObservable();
  }
}
