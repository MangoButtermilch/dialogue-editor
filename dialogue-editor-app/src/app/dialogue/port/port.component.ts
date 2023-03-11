import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PanZoomModel } from 'ngx-panzoom';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { PortService } from 'src/app/services/dialogue/port.service';
import { EditorStateService } from 'src/app/services/editor/editor-state.service';
import { PanZoomService } from 'src/app/services/editor/pan-zoom.service';
import { Port, Edge, Vector2, PortCapacity, PortDirection } from 'src/models/models';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent implements OnInit, OnDestroy {

  @Output() onUpdate: EventEmitter<Port> = new EventEmitter<Port>();

  @Input() port: Port;

  public canBeClicked: boolean = true;
  public isCurrentlySelected: boolean = false;
  public selectedPort: Port | null = null;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private editorStateService: EditorStateService) { }

  ngOnInit(): void {
    this.handlePortSelection();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private handlePortSelection(): void {
    this.editorStateService.onPortSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedPort: Port | null) => {

        if (!selectedPort) {
          this.resetPort();
          return;
        }

        this.selectedPort = selectedPort;
        this.isCurrentlySelected = selectedPort.guid === this.port.guid;

        const isAlreadyConnectedToOther: boolean =
          this.port.isConnectedTo(this.selectedPort);

        this.canBeClicked =
          !this.isCurrentlySelected &&
          this.port.direction !== selectedPort.direction &&
          this.port.parentGuid !== selectedPort.parentGuid &&
          !isAlreadyConnectedToOther;

        if (this.hasToRemoveConnection()) {
          const other: Port = this.port.getConnections()[0];
          this.editorStateService.disconnectPort(this.port, other);
        }

        this.onUpdate.emit(this.port);
      });
  }

  public onClicked(): void {
    if (this.isCurrentlySelected || !this.canBeClicked) return;

    if (this.canCreateConnection()) {
      this.editorStateService.connectPort(this.selectedPort, this.port);
      this.editorStateService.deselectPort();
      return;
    }

    this.editorStateService.selectPort(this.port);
  }

  /**
   * If we click a port, we want to connect it to somewhere.
   * But a SINGLE port can only have one connection.
   * So if one already exists it musst be destroyed.
   */
  private hasToRemoveConnection(): boolean {
    return this.hasConnection() && this.isCurrentlySelected && this.port.capacity === PortCapacity.SINGLE;
  }

  private hasConnection(): boolean {
    return this.port.getConnections().length > 0;
  }

  private canCreateConnection(): boolean {

    const isInSelectMode: boolean =
      this.selectedPort !== null &&
      this.selectedPort.guid !== this.port.guid &&
      this.selectedPort.direction !== this.port.direction;

    if (!isInSelectMode) return false;

    const isCircularConnection: boolean = this.port.parentGuid === this.selectedPort.parentGuid;

    const canSingleConnect: boolean =
      this.port.capacity === PortCapacity.SINGLE &&
      this.port.getConnections().length <= 1 &&
      this.selectedPort.capacity === PortCapacity.MULTIPLE;

    const canMultiConnect: boolean =
      this.port.capacity === PortCapacity.MULTIPLE &&
      this.selectedPort.capacity === PortCapacity.SINGLE &&
      this.selectedPort.getConnections().length <= 1;

    const isAlreadyConnectedToOther: boolean =
      this.port.isConnectedTo(this.selectedPort);

    return !isAlreadyConnectedToOther && !isCircularConnection && (canSingleConnect || canMultiConnect);
  }

  private resetPort(): void {
    this.selectedPort = null;
    this.canBeClicked = true;
    this.isCurrentlySelected = false;
  }

}
