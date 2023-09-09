import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventNode } from 'src/models/models';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  @Output() onDelete: EventEmitter<EventNode> = new EventEmitter<EventNode>();
  @Output() onUpdate: EventEmitter<EventNode> = new EventEmitter<EventNode>();

  @Input() eventNode: EventNode;

  ngOnInit(): void {

  }

  public onNameInput(eventData: any) {
    const value: string = eventData.target.value;
    this.eventNode.name = value;
    this.onUpdate.emit(this.eventNode);
  }
}
