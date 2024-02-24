import { Component, Input } from '@angular/core';
import { GuiObject } from 'src/models/models';

@Component({
  selector: 'app-gui-element',
  templateUrl: './gui-element.component.html',
  styleUrls: ['./gui-element.component.scss']
})
export class GuiElementComponent {

  @Input() guiElement: GuiObject;

  public get transformStyle(): string {
    return `transform: translate3d(${this.guiElement.position.x}px, ${this.guiElement.position.y}px, 0px);`
  }
}
