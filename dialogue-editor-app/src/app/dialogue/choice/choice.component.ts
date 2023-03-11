import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Choice, Port } from 'src/models/models';
import { PortComponent } from '../port/port.component';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent {

  @Output() onUpdate: EventEmitter<Choice> = new EventEmitter<Choice>();
  @Output() onDeleteClicked: EventEmitter<Choice> = new EventEmitter<Choice>();

  @Input() choice: Choice;

  constructor() { }

  ngOnInit(): void { }

  public updateChoiceInput(eventData: any): void {
    const value: string = eventData.target.value;
    this.choice.content = value;
    this.onUpdate.emit(this.choice);
  }

  public updatePort(port: Port): void {
    this.choice.outPort = port;
    this.onUpdate.emit(this.choice);
  }
}
