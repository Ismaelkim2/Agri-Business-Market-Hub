import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from './../data-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  phoneNumber: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';

  constructor(private dataService: DataServiceService, private router: Router) { }

  onSubmit() {
    this.dataService.signIn({ phoneNumber: this.phoneNumber, password: this.password })
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/post-list']); 
        } else {
          this.errorMessage = 'Incorrect Phone Number or Password';
        }
      }, error => {
        console.error('An error occurred during login.', error);
        this.errorMessage = 'An error occurred during login.';
      });
  }

  registration() {
    this.router.navigate(['/registration']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
