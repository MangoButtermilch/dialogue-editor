import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CharacterService } from 'src/app/services/data/character.service';
import { Character } from 'src/models/models';

@Component({
  selector: 'app-character-panel',
  templateUrl: './character-panel.component.html',
  styleUrls: ['./character-panel.component.scss']
})
export class CharacterPanelComponent {
  public characters$: Observable<Character[]> = this.characterService.getCharacters();

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
}
