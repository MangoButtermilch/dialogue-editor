import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { CommentNode } from 'src/models/models';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements AfterViewInit {

  @Output() onDelete: EventEmitter<CommentNode> = new EventEmitter<CommentNode>();
  @Output() onUpdate: EventEmitter<CommentNode> = new EventEmitter<CommentNode>();

  @Input() comment: CommentNode;

  public iconDelete = faXmark;

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
