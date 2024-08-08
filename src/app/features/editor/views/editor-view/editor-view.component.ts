import { Component } from '@angular/core';
import { EditorComponent } from '../../components/editor/editor.component';

@Component({
  selector: 'app-editor-view',
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './editor-view.component.html',
  styleUrl: './editor-view.component.scss'
})
export class EditorViewComponent {

}
