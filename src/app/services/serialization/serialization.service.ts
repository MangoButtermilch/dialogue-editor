import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dialogue } from 'src/models/models';
import { DialogueService } from '../dialogue/dialogue.service';

@Injectable({
  providedIn: 'root'
})
export class SerializationService {


  private dialogue$: Observable<Dialogue> = this.dialogueService.getDialoge();

  constructor(private dialogueService: DialogueService) { }

  public saveToJson(): void {
    this.dialogue$.subscribe((dialoge: Dialogue) => {
      this.downloadJSON(dialoge, dialoge.name);
    }).unsubscribe();
  }

  public loadFromJson(): void {
    this.importJSON((dialouge: Dialogue) => {
      this.dialogueService.loadDialougeFromImport(dialouge);
    });
  }

  /**
   * Tries to import Dialogue from JSON file
   * @param callback called after file has been parsed. Gets Dialogue passed as parameter
   */
  private importJSON(callback: Function): void {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {

        try {
          const content = readerEvent.target.result as string;
          const dialoge: Dialogue = this.dialogueService
            .generateDialogue()
            .overrideWithJsonData(content);

          callback(dialoge);
        } catch (error) {
          console.warn(error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
    input.remove();
  }

  /**
   * Creates a JSON file that will be downloaded by the browser to save a file.
   * @param jsonData 
   * @param filename 
   */
  private downloadJSON(jsonData: object, filename: string) {
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
} 
