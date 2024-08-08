import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EditorStateService } from 'src/app/features/editor/services/editor-state.service';
import { Port, PortCapacity } from 'src/models/models';
import { PortService } from '../../../services/port.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent implements OnInit, OnDestroy {

  @Output() onUpdate: EventEmitter<Port> = new EventEmitter<Port>();

  @Input() port: Port;
  @Input() labelOverride: string = null;

  public iconPort = faCircleDot

  private destroy$: Subject<void> = new Subject<void>();
  private selectedPort$: Observable<Port | null> = this.editorStateService.onPortSelected()
    .pipe(takeUntil(this.destroy$));

  private selectedPort: Port | null = null;

  constructor(
    private editorStateService: EditorStateService,
    private portService: PortService
  ) { }

  ngOnInit(): void {
    this.handlePortSelection();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private update(): void {
    this.onUpdate.emit(this.port);
  }

  private handlePortSelection(): void {
    this.selectedPort$.subscribe((selectedPort: Port | null) => {
      this.selectedPort = selectedPort;
      if (this.selectedPort === null) return;

      if (this.hasToRemoveConnection) {
        this.removeAllConnections();
      }
      this.update();
    });
  }

  private removeAllConnections(): void {
    for (const guid of this.port.getConnections()) {
      this.portService.disconnectPortsByGuid(this.port, guid);
    }
  }

  public onClicked(): void {
    if (!this.canBeClicked) return;

    if (this.canCreateConnection) {
      this.portService.connectPorts(this.selectedPort, this.port);
      this.editorStateService.deselectPort();
      return;
    }

    this.editorStateService.selectPort(this.port);
    this.update();
  }

  public get label(): string {
    return this.labelOverride ?? (this.port.direction === "out" ? "Out" : "In");
  }

  /**
   * @returns true if selected port guid is equal to this port guid.
   */
  public get isCurrentlySelected(): boolean {
    return this.selectedPort !== null && this.selectedPort.guid === this.port.guid;
  }

  /**
   * @returns true if this port:
   * - is not selected
   * - does not have to many connections (single port can only have one)
   * - has opposite port-direction of selected port
   * - has different parent guid than selected port
   */
  public get canBeClicked(): boolean {
    return (
      !this.isCurrentlySelected &&
      !this.isCircularConnection &&
      !this.isAlreadyConnectedToSelectedPort &&
      this.port.direction !== this.selectedPort?.direction
    );
  }

  private get canCreateConnection(): boolean {
    return (
      !this.hasToManyConnections &&
      !this.isCircularConnection &&
      !this.isAlreadyConnectedToSelectedPort &&
      (this.canSingleConnect || this.canMultiConnect)
    );
  }

  /**
   * @returns true if this port:
   * - is single capacity
   * - has already a connection
   * - is currently selected
   *
   * In other words: True when user is trying to reconnect this port somewhere else
   */
  private get hasToRemoveConnection(): boolean {
    return (
      this.port.capacity === PortCapacity.SINGLE &&
      this.hasConnections &&
      this.isCurrentlySelected
    );
  }

  /**
   * @returns true if port has any amount of connections
   */
  private get hasConnections(): boolean {
    return this.port.getConnections().length > 0;
  }

  /**
   * @returns true if parent guid is the same for this port and selected port
   */
  private get isCircularConnection(): boolean {
    return this.port.parentGuid === this.selectedPort?.parentGuid;
  }

  /**
   * @returns true if this port guid is inside selected port connections or vice versa.
   */
  private get isAlreadyConnectedToSelectedPort(): boolean {
    return (
      this.selectedPort !== null &&
      (
        this.port.isConnectedTo(this.selectedPort) ||
        this.selectedPort.isConnectedTo(this.port)
      )
    );
  }

  /**
   * @returns true if:
   * - this port is single capacity
   * - already has 1 connection
   */
  private get hasToManyConnections(): boolean {
    return (
      this.port.capacity === PortCapacity.SINGLE &&
      this.port.connectedPortGuids.length >= 1
    );
  }

  /**
   * @returns true if:
   * - this port has single capacity
   * - this port has less than 1 connection
   * - selected port has multi capacity
   */
  private get canSingleConnect(): boolean {
    return (
      this.port.capacity === PortCapacity.SINGLE &&
      this.selectedPort?.capacity === PortCapacity.MULTIPLE &&
      this.port.getConnections().length < 1
    );
  }

  /**
   * @returns true if:
   * - this port has multi capacity
   * - selected port has single capacity
   * - selected port has less than 1 connection
   */
  private get canMultiConnect(): boolean {
    return (
      this.port.capacity === PortCapacity.MULTIPLE &&
      this.selectedPort?.capacity === PortCapacity.SINGLE &&
      this.selectedPort?.getConnections().length < 1
    );
  }
}
