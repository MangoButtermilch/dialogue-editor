import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { CharacterService } from 'src/app/features/editor/services/character.service';
import { ResizableComponent } from 'src/app/shared/components/resizable/resizable.component';
import { Character } from 'src/models/models';

@Component({
  standalone: true,
  imports: [FontAwesomeModule, ResizableComponent, CommonModule, CdkDrag, CdkDropList, CdkDragHandle],
  selector: 'app-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent {

  public characters$: Observable<Character[]> = this.characterService.getCharacters();

  public iconAdd = faPlus;
  public iconDelete = faXmark;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {

  }

  public generateNew(): void {
    this.characterService.addCharacter(
      { name: "New character", color: "#ffffff" }
    );
  }

  public removeCharacter(char: Character): void {
    this.characterService.removeCharacter(char.guid);
  }

  public updateCharacterName(eventData: any, char: Character) {
    const value = eventData.target.value;
    char.name = value;
    this.updateCharacter(char);
  }

  public updateCharacterColor(eventData: any, char: Character) {
    const value = eventData.target.value;
    char.color = value;
    this.updateCharacter(char);
  }

  private updateCharacter(char: Character): void {
    this.characterService.updateCharacter(char);
  }

  public cdkCharacterDropped(event: any): void {
    this.characterService.moveItemInArray(event.previousIndex, event.currentIndex);
  }
}
