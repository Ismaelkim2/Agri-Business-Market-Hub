import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  private showSpinnerSubject = new BehaviorSubject<boolean>(true);
  private showTickSubject = new BehaviorSubject<boolean>(false);

  message$ = this.messageSubject.asObservable();
  showSpinner$ = this.showSpinnerSubject.asObservable();
  showTick$ = this.showTickSubject.asObservable();

  showNotification(message: string, showSpinner: boolean, showTick: boolean): void {
    this.messageSubject.next(message);
    this.showSpinnerSubject.next(showSpinner);
    this.showTickSubject.next(showTick);
    this.hideNotification();
  }

  private hideNotification(): void {
    setTimeout(() => {
      this.showSpinnerSubject.next(false);
      this.showTickSubject.next(true);
    }, 4000);
  }
}
