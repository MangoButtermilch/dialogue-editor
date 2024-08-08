import { Component } from '@angular/core';
import { EditorViewComponent } from './features/editor/views/editor-view/editor-view.component';

@Component({
  standalone: true,
  imports: [EditorViewComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dialogue-editor-app';
}
