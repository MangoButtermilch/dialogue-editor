import { CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CharacterService } from 'src/app/features/editor/services/character.service';
import { EditorStateService } from 'src/app/features/editor/services/editor-state.service';
import { Character, Choice, DialogueNode } from 'src/models/models';
import { DialougeFactoryService } from '../../../services/dialouge-factory.service';
import { EdgeService } from '../../../services/edge.service';
import { PortService } from '../../../services/port.service';
import { PortComponent } from '../port/port.component';
import { ChoiceComponent } from '../choice/choice.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlug, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [PortComponent, ChoiceComponent, FontAwesomeModule, CommonModule, CdkDrag, CdkDropList],
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnDestroy {

  @Output() onUpdate: EventEmitter<DialogueNode> = new EventEmitter<DialogueNode>();
  @Output() onDelete: EventEmitter<DialogueNode> = new EventEmitter<DialogueNode>();
  @Input() dialogueNode: DialogueNode;

  private destroy$: Subject<void> = new Subject<void>();
  public characterOptions$: Observable<Character[]> = this.characterService.getCharacters()
    .pipe(takeUntil(this.destroy$));
  private characters: Character[] = [];
  public selectedCharacterIndex: number = 1;

  public iconAdd = faPlus;
  public iconDelete = faXmark;

  constructor(
    private edgeService: EdgeService,
    private editorStateService: EditorStateService,
    private dialogueFactory: DialougeFactoryService,
    private characterService: CharacterService,
    private portService: PortService
  ) { }

  ngOnInit(): void {

    this.characterOptions$.subscribe((characters: Character[]) => {
      this.characters = characters;

      if (characters.length === 0) {
        this.selectedCharacterIndex = -1;
        this.characters = [];
        return;
      }

      this.selectedCharacterIndex = characters.findIndex((chars: Character) =>
        chars.guid === this.dialogueNode.character.guid
      );

      if (this.selectedCharacterIndex < 0) {
        this.selectedCharacterIndex = 0;
      }

      //  if (this.dialogueNode.character.guid !== this.characters[this.selectedCharacterIndex].guid) {
      this.dialogueNode.character = this.characters[this.selectedCharacterIndex];
      this.onUpdate.emit(this.dialogueNode);
      //}
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.dialogueFactory.generateChoiceForNode(this.dialogueNode.guid)
    );

    this.onUpdate.emit(this.dialogueNode);
  }

  public deleteChoice(choice: Choice): void {
    this.edgeService.removeAllEdgesFor(choice.outPort, true);
    this.dialogueNode.choices = this.dialogueNode.choices.filter((other: Choice) => other.guid !== choice.guid);
    this.portService.removePort(choice.outPort);

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
