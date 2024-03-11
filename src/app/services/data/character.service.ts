import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Character } from 'src/models/models';
import { GuidService } from '../editor/guid.service';

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

  public getCharacters(): Observable<Character[]> {
    return this.characters$;
  }

  public addCharacter(args: { name: string, color: string }): void {
    this.characters.push({
      isDefault: false,
      guid: this.guidService.getGuid(),
      name: args.name,
      color: args.color
    });
    this.characters$.next(this.characters);
  }

  public updateCharacter(character: Character): void {
    const index: number = this.characters.findIndex((other: Character) => other.guid == character.guid);
    this.characters[index] = character;
    this.characters$.next(this.characters);
  }

  public removeCharacter(guid: string): void {
    const index = this.characters.findIndex((char: Character) => char.guid === guid);
    this.characters.splice(index, 1);
    this.characters$.next(this.characters);
  }

  public getDefaultCharacter(): Character {
    return this.defaultCharacter;
  }

  public moveItemInArray(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.characters, previousIndex, currentIndex);
    this.characters$.next(this.characters);
  }

  public onCharactersUpdate(): Observable<Character[]> {
    return this.characters$.asObservable();
  }
}
