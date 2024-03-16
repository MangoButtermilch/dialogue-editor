import { Component } from '@angular/core';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {

  public controls: any[] = [

    { title: "Mouse wheel", descr: "Zoom in and out" },
    { title: "Mouse button 3", descr: "Pan viewport" },
    { title: "Mouse button 2", descr: "Context menu" },
    { title: "Hover + Double click on edge", descr: "Delete edge" },
  ];

}
