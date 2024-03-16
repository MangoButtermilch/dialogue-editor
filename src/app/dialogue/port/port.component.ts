import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PanZoomModel } from 'ngx-panzoom';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
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
  @Input() labelOverride: string = null;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private selectedPort$: Observable<Port | null> = this.editorStateService.onPortSelected()
    .pipe(takeUntil(this.destroy$));
  public selectedPort: Port | null = null;
  public canBeClicked: boolean = true;
  public isCurrentlySelected: boolean = false;


  constructor(
    private editorStateService: EditorStateService,
    private portService: PortService
  ) { }

  ngOnInit(): void {
    this.handlePortSelection();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public get label(): string {
    return this.labelOverride ??
      (this.port.direction === "out" ? "Out" : "In");
  }

  private handlePortSelection(): void {
    this.selectedPort$
      .subscribe((selectedPort: Port | null) => {

        if (selectedPort === null) {
          this.resetPort();
          return;
        }

        this.selectedPort = selectedPort;
        this.isCurrentlySelected = selectedPort.guid === this.port.guid;

        const isAlreadyConnectedToSelectedPort: boolean =
          this.port.isConnectedTo(this.selectedPort);

        const hasToManyConnections: boolean =
          this.port.capacity === PortCapacity.SINGLE &&
          this.port.connectedPortGuids.length >= 1;


        this.canBeClicked =
          !this.isCurrentlySelected &&
          !hasToManyConnections &&
          this.port.direction !== selectedPort.direction &&
          this.port.parentGuid !== selectedPort.parentGuid &&
          !isAlreadyConnectedToSelectedPort;

        if (this.hasToRemoveConnection()) {
          this.removeAllConnections();
        }

        this.onUpdate.emit(this.port);
      });
  }

  public onClicked(): void {
    if (this.isCurrentlySelected || !this.canBeClicked) return;

    if (this.canCreateConnection()) {
      this.portService.connectPorts(this.selectedPort, this.port);
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
    return this.hasConnections() && this.isCurrentlySelected && this.port.capacity === PortCapacity.SINGLE;
  }

  private hasConnections(): boolean {
    return this.port.getConnections().length > 0;
  }

  private removeAllConnections(): void {
    for (const guid of this.port.getConnections()) {
      this.portService.disconnectPortsByGuid(this.port, guid);
    }
  }

  private resetPort(): void {
    this.selectedPort = null;
    this.canBeClicked = true;
    this.isCurrentlySelected = false;
  }

  private canCreateConnection(): boolean {
    return (
      this.isInSelectMode &&
      !this.isCircularConnection &&
      !this.isAlreadyConnectedToSelectedPort &&
      !this.hasToManyConnections &&
      (this.canSingleConnect || this.canMultiConnect)
    );
  }

  private get isInSelectMode(): boolean {
    return (
      this.selectedPort !== null &&
      this.selectedPort.guid !== this.port.guid &&
      this.selectedPort.direction !== this.port.direction
    );
  }

  private get isCircularConnection(): boolean {
    return this.port.parentGuid === this.selectedPort?.parentGuid;
  }

  private get isAlreadyConnectedToSelectedPort(): boolean {
    return (
      this.port.isConnectedTo(this.selectedPort) ||
      this.selectedPort.isConnectedTo(this.port)
    );
  }

  private get hasToManyConnections(): boolean {
    return (
      this.port.capacity === PortCapacity.SINGLE &&
      this.port.connectedPortGuids.length >= 1
    );
  }

  private get canSingleConnect(): boolean {
    return (
      this.port.capacity === PortCapacity.SINGLE &&
      this.port.getConnections().length <= 1 &&
      this.selectedPort?.capacity === PortCapacity.MULTIPLE
    );
  }

  private get canMultiConnect(): boolean {
    return (
      this.port.capacity === PortCapacity.MULTIPLE &&
      this.selectedPort?.getConnections().length <= 1 &&
      this.selectedPort?.capacity === PortCapacity.SINGLE
    );
  }
}
