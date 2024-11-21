import { Component, Input } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent {
  @Input() message: string | null = null;
  @Input() showSpinner: boolean = true;
  @Input() showTick: boolean = false;


  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.message$.subscribe((message) => {
      if (message) {
        this.message = message;
      }
    });

    this.notificationService.showSpinner$.subscribe((showSpinner) => {
      this.showSpinner = showSpinner;
    });

    this.notificationService.showTick$.subscribe((showTick) => {
      this.showTick = showTick;
    });
  }


  hideNotification(): void {
    setTimeout(() => {
      this.showSpinner = false;
      this.showTick = true;
    }, 4000);  
  }
}
