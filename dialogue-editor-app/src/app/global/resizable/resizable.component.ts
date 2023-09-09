import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { Vector2 } from 'src/models/models';

@Component({
  selector: 'app-resizable',
  templateUrl: './resizable.component.html',
  styleUrls: ['./resizable.component.scss']
})
export class ResizableComponent implements OnInit {

  @Input() width: number;
  @Input() height: number;
  @Input() left: number;
  @Input() top: number;
  @Input() fitHeight: boolean = false;
  @Input() fitWidth: boolean = false;

  private initialWidth: number;
  private initialHeight: number;

  private resizeStartPos: Vector2 = { x: 0, y: 0 };
  private resizeEndPos: Vector2 = { x: 0, y: 0 };


  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.initialHeight = this.height;
    this.initialWidth = this.width;
  }

  public resizeStart(eventData: DragEvent): void {
    this.resizeStartPos = { x: eventData.pageX, y: eventData.pageY };
  }

  public resize(eventData: DragEvent): void {
    if (eventData.pageX <= 0 || eventData.pageY <= 0) return;
    this.resizeEndPos = { x: eventData.pageX, y: eventData.pageY };

    const diff = {
      x: this.resizeEndPos.x - this.resizeStartPos.x,
      y: this.resizeEndPos.y - this.resizeStartPos.y
    }

    this.width = this.initialWidth + diff.x;
    this.height = this.initialHeight + diff.y;

  }

  public resizeEnd(eventData: DragEvent): void {
    this.initialWidth = this.width;
    this.initialHeight = this.height;
  }

}
