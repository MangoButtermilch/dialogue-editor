import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentNode } from 'src/models/models';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements AfterViewInit {

  @Output() onDelete: EventEmitter<CommentNode> = new EventEmitter<CommentNode>();
  @Output() onUpdate: EventEmitter<CommentNode> = new EventEmitter<CommentNode>();

  @Input() comment: CommentNode;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    const inputField = this.elementRef.nativeElement.querySelector("textarea");
    this.calcInputHeight(inputField);
  }

  public updateColor(eventData: any): void {
    const value = eventData.target.value;
    this.comment.color = value;
    this.onUpdate.emit(this.comment);
  }

  public updateContent(eventData: any): void {
    const value = eventData.target.value;
    this.comment.content = value;
    this.onUpdate.emit(this.comment);
    this.calcInputHeight(eventData.target);
  }

  private calcInputHeight(el: HTMLElement): void {
    el.style.height = (el.scrollHeight) + "px";
  }

  public onDeleteClicked(): void {
    this.onDelete.emit(this.comment);
  }
}
