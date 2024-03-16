import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialougeFactoryService } from 'src/app/services/dialogue/dialouge-factory.service';
import { EdgeService } from 'src/app/services/dialogue/edge.service';
import { Possibility, RandomNode } from 'src/models/models';

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
  ) { }

  public addPosibility(): void {
    this.randomNode.possibilites.push(
      this.dialogueFactory.generatePossibility(this.randomNode.guid)
    );

    this.onUpdate.emit(this.randomNode);
  }

  public deletePossibility(possibility: Possibility): void {
    this.edgeService.removeAllEdgesFor(possibility.outPort);
    this.randomNode.possibilites = this.randomNode.possibilites.filter((other: Possibility) => other.guid !== possibility.guid);
    this.onUpdate.emit(this.randomNode);
  }
}
