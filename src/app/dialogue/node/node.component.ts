import { CdkDragMove, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { CharacterService } from 'src/app/services/data/character.service';
import { ChoiceService } from 'src/app/services/dialogue/choice.service';
import { EdgeService } from 'src/app/services/dialogue/edge.service';
import { NodeService } from 'src/app/services/dialogue/node.service';
import { EditorStateService } from 'src/app/services/editor/editor-state.service';
import { DialogueNode, Choice, Character } from 'src/models/models';
import { ChoiceComponent } from '../choice/choice.component';
import { PortComponent } from '../port/port.component';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnDestroy {

  @Output() onUpdate: EventEmitter<DialogueNode> = new EventEmitter<DialogueNode>();
  @Output() onDelete: EventEmitter<DialogueNode> = new EventEmitter<DialogueNode>();
  @Input() dialogueNode: DialogueNode;

  public characterOptions$: Observable<Character[]> = this.characterService.getCharacters();
  private characters: Character[] = [];
  public selectedCharacterIndex: number = 1;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private edgeService: EdgeService,
    private editorStateService: EditorStateService,
    private choiceService: ChoiceService,
    private characterService: CharacterService
  ) { }

  ngOnChanges(): void {
    if (!this.dialogueNode) return;

    this.characterOptions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((characters: Character[]) => {
        this.characters = characters;

        this.selectedCharacterIndex = characters.findIndex((chars: Character) =>
          chars.guid === this.dialogueNode.character.guid
        );

        if (this.selectedCharacterIndex < 0) {
          this.selectedCharacterIndex = 0;
        }

        if (this.dialogueNode.character.guid !== this.characters[this.selectedCharacterIndex].guid) {
          this.dialogueNode.character = this.characters[this.selectedCharacterIndex];
          this.onUpdate.emit(this.dialogueNode);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public cdkChoiceDragStarted(eventData: any, choice: Choice): void {
    this.editorStateService.dragStartChoice(choice);
  }

  public cdkChoiceDragEnded(eventData: any, choice: Choice): void {
    this.editorStateService.dragEndChoice(choice);
  }

  public cdkChoiceDropped(eventData: any): void {
    moveItemInArray(this.dialogueNode.choices, eventData.previousIndex, eventData.currentIndex);
  }

  public addChoice(): void {
    this.dialogueNode.choices.push(
      this.choiceService.generateChoiceForNode(this.dialogueNode.guid)
    );

    this.onUpdate.emit(this.dialogueNode);
  }

  public deleteChoice(choice: Choice): void {
    this.edgeService.removeAllEdgesFor(choice.outPort);
    this.dialogueNode.choices = this.dialogueNode.choices.filter((other: Choice) => other.guid !== choice.guid);

    this.onUpdate.emit(this.dialogueNode);
  }

  public updateChoice(choice: Choice): void {
    const index = this.dialogueNode.choices.findIndex((other: Choice) => other.guid === choice.guid);
    this.dialogueNode.choices[index] = choice;

    this.onUpdate.emit(this.dialogueNode);
  }

  public onCharacterChange(eventData: any): void {
    const selectValue: string = eventData.target.value;
    this.dialogueNode.character = this.characters.filter((other: Character) => other.guid === selectValue)[0];
    this.selectedCharacterIndex = this.characters.findIndex(
      (chars: Character) => chars.guid === this.dialogueNode.character.guid
    );

    this.onUpdate.emit(this.dialogueNode);
  }

  public onLabelInput(eventData: any) {
    const value: string = eventData.target.value;
    this.dialogueNode.label = value;
    this.onUpdate.emit(this.dialogueNode);
  }

  public onContentInput(eventData: any) {
    const value: string = eventData.target.value;
    this.dialogueNode.content = value;
    this.onUpdate.emit(this.dialogueNode);
  }
}
