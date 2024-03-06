import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { GuiObject, Vector2 } from 'src/models/models';

@Component({
  selector: 'app-gui-element',
  templateUrl: './gui-element.component.html',
  styleUrls: ['./gui-element.component.scss']
})
export class GuiElementComponent {

  @Input() guiElement: GuiObject;

  constructor(private elementRef: ElementRef) { }

  public get transformStyle(): string {
    return `transform: translate3d(${this.guiElement.position.x}px, ${this.guiElement.position.y}px, 0px);`
  }

  public updatePosition(eventData: CdkDragEnd): void {
    const styleDiv = this.elementRef.nativeElement.querySelector(".cdk-drag");
    const style =  window.getComputedStyle(styleDiv);
    const transformMatrix = new DOMMatrix(style.transform);

    // Extract translation values from the matrix
    const x = transformMatrix.m41;
    const y = transformMatrix.m42;

    this.guiElement.position = { x: x, y: y };
  }
}
