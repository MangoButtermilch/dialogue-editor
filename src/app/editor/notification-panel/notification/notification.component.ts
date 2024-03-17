import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notification } from 'src/models/models';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  private readonly lifetimeMs = 5000;

  @Input() notification: Notification;
  @Output() onDeleteClicked: EventEmitter<Notification> = new EventEmitter<Notification>();

  ngOnInit(): void {
    setTimeout(() => {
      this.onDeleteClicked.emit(this.notification);
    }, this.lifetimeMs);
  }
}
