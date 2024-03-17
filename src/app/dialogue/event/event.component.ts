import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventNode, Port } from 'src/models/models';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {

  @Output() onDelete: EventEmitter<EventNode> = new EventEmitter<EventNode>();
  @Output() onUpdate: EventEmitter<EventNode> = new EventEmitter<EventNode>();

  @Input() eventNode: EventNode;

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
