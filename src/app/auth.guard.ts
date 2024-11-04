import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private dataService: DataServiceService, private router: Router) {}

  canActivate(): boolean {
    if (this.dataService.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}


