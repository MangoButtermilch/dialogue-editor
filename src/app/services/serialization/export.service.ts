import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dialogue } from 'src/models/models';
import { DialogueService } from '../dialogue/dialogue.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private dialogue$: Observable<Dialogue> = this.dialogueService.getDialoge();

  constructor(private dialogueService: DialogueService) { }


  public saveToJson(): void {
    this.dialogue$.subscribe((dialoge: Dialogue) => {
      this.downloadJSON(dialoge, dialoge.name);
    }).unsubscribe();
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
