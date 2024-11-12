import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataServiceService } from './../data-service.service';
import { ToastrService } from 'ngx-toastr';


export interface AuthResponse {
  token: string;
}


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

  loading = false;

  constructor(
    private dataService: DataServiceService, 
    private router: Router,
    private toastr: ToastrService,
  ) {}

  onSubmit() {

    this.loading = true;

    console.log('Submitting login with phone number:', this.phoneNumber);
    this.dataService.signIn({ phoneNumber: this.phoneNumber, password: this.password })
      .subscribe(
        success => {
          if (success) {
            console.log('Login successful, navigating to /records');
            this.router.navigate(['/dashboard']);
          } else {
            console.warn('Login failed, showing error message');
            this.errorMessage = 'Incorrect Phone Number or Password';
          }
        },
        error => {
          console.error('An error occurred during login:', error);
          if (error.status === 401) {
            this.errorMessage = 'Unauthorized: Incorrect credentials';
          } else {
            this.errorMessage = 'An error occurred during login.';
          }
        }
      );

      setTimeout(() => {
        this.loading = false; 
        this.toastr.success('Logged in successfully'); 
        this.router.navigate(['/dashboard']);
      }, 2000);

  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  logout() {
    console.log('Logging out and navigating to login page');
    this.dataService.signOut();
    this.router.navigate(['/login']);
  }
}
