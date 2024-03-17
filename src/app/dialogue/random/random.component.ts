import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialougeFactoryService } from 'src/app/services/dialogue/dialouge-factory.service';
import { EdgeService } from 'src/app/services/dialogue/edge.service';
import { PortService } from 'src/app/services/dialogue/port.service';
import { Port, Possibility, RandomNode } from 'src/models/models';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.scss']
})
export class RandomComponent {

  @Output() onUpdate: EventEmitter<RandomNode> = new EventEmitter<RandomNode>();
  @Output() onDelete: EventEmitter<RandomNode> = new EventEmitter<RandomNode>();
  @Input() randomNode: RandomNode;

  constructor(
    private dialogueFactory: DialougeFactoryService,
    private edgeService: EdgeService,
    private portService: PortService
  ) { }

  public addPosibility(): void {
    this.randomNode.possibilites.push(
      this.dialogueFactory.generatePossibility(this.randomNode.guid)
    );

    this.onUpdate.emit(this.randomNode);
  }

  public deletePossibility(possibility: Possibility): void {
    this.edgeService.removeAllEdgesFor(possibility.outPort, true);
    this.randomNode.possibilites = this.randomNode.possibilites.filter((other: Possibility) => other.guid !== possibility.guid);
    this.portService.removePort(possibility.outPort);
    this.onUpdate.emit(this.randomNode);
  }

  public updateInPort(port: Port): void {
    this.randomNode.inPort = port;
    this.onUpdate.emit(this.randomNode);
  }

  public updateOutPort(port: Port, possibility: Possibility): void {
    possibility.outPort = port;
    this.onUpdate.emit(this.randomNode);
  }
}
