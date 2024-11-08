import { Component } from '@angular/core';
import { SessionTimeoutService } from './services/session-timeout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Brishkim Eco_Eggs';
  showTimeoutAlert = false;

  constructor(private sessionTimeoutService: SessionTimeoutService) {
    this.sessionTimeoutService.showTimeoutNotification.subscribe(show => {
      this.showTimeoutAlert = show;
    });
  }
}
