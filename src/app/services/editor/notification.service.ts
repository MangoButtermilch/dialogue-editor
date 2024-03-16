import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NotificationType, Notification } from 'src/models/models';
import { GuidService } from './guid.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications: Notification[] = [];
  private notifications$: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);

  constructor(private guidService: GuidService) { }

  public add(message: string, type: NotificationType) {
    this.notifications.push(new Notification(message, type, this.guidService.getGuid()));
    this.updateNoficitaions();
  }

  public remove(notification: Notification): void {
    const index = this.notifications.findIndex(other => other.guid === notification.guid);
    this.notifications.splice(index, 1);
    this.updateNoficitaions();
  }

  public getNotificationQueue(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  private updateNoficitaions(): void {
    this.notifications$.next(this.notifications);
  }
}
