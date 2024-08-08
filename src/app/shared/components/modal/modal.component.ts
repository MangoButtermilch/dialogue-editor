import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  public iconDelete = faXmark;

  constructor() { }

  ngOnInit(): void {
  }

  public close(): void {
    this.onClose.emit();
  }
}
