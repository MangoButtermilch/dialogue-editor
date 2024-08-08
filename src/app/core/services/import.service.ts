import { Injectable } from '@angular/core';
import { DialogueService } from 'src/app/features/dialogue/services/dialogue.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Choice, CommentNode, ConditionNode, DialogeIteratableProperty, Dialogue, DialogueNode, EventNode, NotificationType, Port, Possibility, RandomNode, RepeatNode } from 'src/models/models';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(
    private notificationService: NotificationService,
    private dialogueService: DialogueService) { }

  /**
   * This function gets triggered by button in toolbar component and inits the import of a dialouge.
   */
  public loadFromJson(): void {
    this.importJSON((dialogue: Dialogue) => {
      this.reconstructDialougeAfterImport(dialogue);
      this.dialogueService.loadImportedDialogue(dialogue);
      this.notificationService.add("Import done", NotificationType.SUCCESS);
    });
  }

  private reconstructDialougeAfterImport(dialogue: Dialogue) {
    for (const prop of Object.keys(DialogeIteratableProperty)) {
      this.reconstructDialougeProperty(dialogue, prop as DialogeIteratableProperty);
    }
    this.reconstructDialougePortsRecursivley(dialogue, [], dialogue);
  }

  /**
   * Reconstructing object by calling the corresponding class constructor for each element.
   * This allows us to call class member functions later, since that context is usually lost during parsing.
   * This function handles top level elements defined via DialogeIteratableProperty and sublevel objects.
   * These sublevel objects do not include ports since they will be handled by the PortService separatly
   * @param importedDialouge The Dialouge created by the import.
   * @param dialougeProperty The property to iterade and replace objects on.
   */
  private reconstructDialougeProperty(
    importedDialouge: Dialogue,
    dialougeProperty: DialogeIteratableProperty
  ): void {

    for (const property in importedDialouge) {
      const key = property;
      const value = importedDialouge[property];
      const isIteratable = (value instanceof Array || value instanceof Object);
      const isCorrectKey = key.toUpperCase() === dialougeProperty.toString();
      if (!isIteratable || !isCorrectKey) continue;

      for (const entry of Object.entries(value)) {
        const [index, objetToReplace]: any = entry;

        switch (dialougeProperty) {
          case DialogeIteratableProperty.NODES:
            importedDialouge[property][index] = DialogueNode.fromImportedData(objetToReplace);

            //Dialogue nodes contain choices
            const choices = objetToReplace.choices;
            if (!choices) break;

            for (const entry of Object.entries(choices)) {
              const [subIndex, subObject] = entry;
              importedDialouge[property][index][subIndex] = Choice.fromImportedData(subObject);
            }

            break;
          case DialogeIteratableProperty.COMMENTS:
            importedDialouge[property][index] = CommentNode.fromImportedData(objetToReplace);
            break;
          case DialogeIteratableProperty.EVENTS:
            importedDialouge[property][index] = EventNode.fromImportedData(objetToReplace);
            break;
          case DialogeIteratableProperty.CONDITIONS:
            importedDialouge[property][index] = ConditionNode.fromImportedData(objetToReplace);
            break;
          case DialogeIteratableProperty.RANDOMNODES:
            importedDialouge[property][index] = RandomNode.fromImportedData(objetToReplace);

            //Random nodes contain possibility objects
            const possibilities = objetToReplace.possibilites;
            if (!possibilities) break;

            for (const entry of Object.entries(possibilities)) {
              const [subIndex, subObject] = entry;
              importedDialouge[property][index][subIndex] = Possibility.fromImportedData(subObject);
            }

            break;
          case DialogeIteratableProperty.REPEATNODES:
            importedDialouge[property][index] = RepeatNode.fromImportedData(objetToReplace);
            break;
        }
      }
    }
  }

  /**
   * Ports are handled separatley because they are not holded by an iteratable property.
   * This function reconstructs all ports inside the dialouge object with instances of the Port class.
   * @param iteratable initial the imported and reconstructed Dialouge object.
   * @param keyPath Used after recursive step to know which property on the original dialouge object to change.
   * @param dialogue Original dialouge object to be changed.
   */
  private reconstructDialougePortsRecursivley(iteratable: any, keyPath: string[], dialogue: Dialogue): void {
    if (!keyPath) keyPath = [];

    for (const key of Object.keys(iteratable)) {
      const value = iteratable[key];
      const isIteratable = (value instanceof Array || value instanceof Object);

      keyPath.push(key);
      if (isIteratable) {
        this.reconstructDialougePortsRecursivley(value, keyPath, dialogue);
      }

      keyPath.pop();

      const isPort = key.toLowerCase().includes("port") && !key.toLowerCase().includes("connect");
      if (!isPort) continue;

      const port: Port = new Port(
        value.guid,
        value.position ?? { x: 0, y: 0 },
        value.parentGuid,
        value.direction,
        value.capacity,
        value.connectedPortGuids
      );

      //reassigning ports to original dialouge object by traversing with the key path
      let currentObject = dialogue;
      for (const subKey of keyPath) {
        currentObject = currentObject[subKey];
      }
      currentObject[key] = port;
    }
  }

  /**
   * Tries to import Dialogue from JSON file and sets editor import state to prepared when file has been chosen
   * @param callback called after file has been parsed. Gets Dialogue passed as parameter
   */
  private importJSON(callback: Function): void {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        reader.onload = null;

        try {
          const content = readerEvent.target.result as string;
          const dialogue: Dialogue = Dialogue.fromJsonData(content);
          callback(dialogue);
        } catch (error) {
          this.notificationService.add("Invalid JSON format", NotificationType.ERROR);
          console.warn(error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
    input.remove();
  }
}
