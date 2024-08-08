import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventNode, Port } from 'src/models/models';
import { PortComponent } from '../port/port.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [PortComponent, FontAwesomeModule],
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {

  @Output() onDelete: EventEmitter<EventNode> = new EventEmitter<EventNode>();
  @Output() onUpdate: EventEmitter<EventNode> = new EventEmitter<EventNode>();

  @Input() eventNode: EventNode;

  public iconDelete = faXmark;

  public onNameInput(eventData: any) {
    const value: string = eventData.target.value;
    this.eventNode.name = value;
    this.onUpdate.emit(this.eventNode);
  }

  public updateInPort(port: Port): void {
    this.eventNode.inPort = port;
    this.onUpdate.emit(this.eventNode);
  }

  public updateOutPort(port: Port): void {
    this.eventNode.outPort = port;
    this.onUpdate.emit(this.eventNode);
  }
}
