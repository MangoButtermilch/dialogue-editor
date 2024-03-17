import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/services/editor/notification.service';
import { Notification } from 'src/models/models';

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  public notifications$: Observable<Notification[]> = this.notificationService.getNotificationQueue()
    .pipe(takeUntil(this.destroy$))

  constructor(private notificationService: NotificationService) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public deleteNotification(notification: Notification): void {
    this.notificationService.remove(notification);
  }
}
