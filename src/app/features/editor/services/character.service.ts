import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GuidService } from 'src/app/core/services/guid.service';
import { Character } from 'src/models/models';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private readonly defaultCharacter: Character = {
    isDefault: true,
    guid: this.guidService.getGuid(),
    name: "Narrator",
    color: "#6495ed"
  };

  private characters$: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>([this.defaultCharacter]);
  private characters: Character[] = [this.defaultCharacter];

  constructor(private guidService: GuidService) { }

  public loadImportedCharacters(characters: Character[]) {
    this.destroyCharacters();
    this.characters = characters;
    this.updateCharacters();
  }

  /**
   * Sets characters to empty array and updates stream.
   */
  private destroyCharacters(): void {
    this.characters = [];
    this.updateCharacters();
  }

  /**
   * Updates characters$ stream
   */
  private updateCharacters(): void {
    this.characters$.next(this.characters);
  }

  public getCharacters(): Observable<Character[]> {
    return this.characters$;
  }

  public getDefaultCharacter(): Character {
    return this.defaultCharacter;
  }

  public addCharacter(args: { name: string, color: string }): void {
    this.characters.push({
      isDefault: false,
      guid: this.guidService.getGuid(),
      name: args.name,
      color: args.color
    });
    this.updateCharacters();
  }

  public updateCharacter(character: Character): void {
    const index: number = this.characters.findIndex((other: Character) => other.guid == character.guid);
    this.characters[index] = character;
    this.updateCharacters();
  }

  public removeCharacter(guid: string): void {
    const index = this.characters.findIndex((char: Character) => char.guid === guid);
    this.characters.splice(index, 1);
    this.updateCharacters();
  }

  /**
   * Used for CDK Drag & Drop
   * @param previousIndex
   * @param currentIndex
   */
  public moveItemInArray(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.characters, previousIndex, currentIndex);
    this.updateCharacters();
  }
}
