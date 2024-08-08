import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Notification } from 'src/models/models';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  private readonly lifetimeMs = 5000;

  public iconDelete = faXmark;

  @Input() notification: Notification;
  @Output() onDeleteClicked: EventEmitter<Notification> = new EventEmitter<Notification>();

  ngOnInit(): void {
    setTimeout(() => {
      this.onDeleteClicked.emit(this.notification);
    }, this.lifetimeMs);
  }
}
