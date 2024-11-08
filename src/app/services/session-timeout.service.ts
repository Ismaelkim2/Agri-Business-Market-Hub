import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private timeoutId: any;
  private readonly timeoutDuration = 1 * 60 * 1000; // 1 minute for demonstration
  public showTimeoutNotification = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private ngZone: NgZone) {
    this.resetTimeout();
    this.startMonitoringUserActivity();
  }

  private startMonitoringUserActivity() {
    ['click', 'mousemove', 'keydown', 'touchstart'].forEach(event =>
      window.addEventListener(event, () => this.resetTimeout())
    );
  }

  private resetTimeout() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.showTimeoutNotification.next(false);

    this.timeoutId = setTimeout(() => {
      this.ngZone.run(() => {
        this.showTimeoutNotification.next(true);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000); 
      });
    }, this.timeoutDuration);
  }
}
