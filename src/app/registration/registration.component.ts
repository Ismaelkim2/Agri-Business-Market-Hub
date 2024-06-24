import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  formData = { 
    firstName: '', 
    lastName: '', 
    email: '', 
    phoneNumber: '', 
    password: '', 
    above18: false,
    userImage: null as File | null  
  };
  error: string = '';
  success: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    // Create FormData object to send multipart/form-data
    const formData = new FormData();
    formData.append('firstName', this.formData.firstName);
    formData.append('lastName', this.formData.lastName);
    formData.append('email', this.formData.email);
    formData.append('phoneNumber', this.formData.phoneNumber);
    formData.append('password', this.formData.password);
    formData.append('above18', String(this.formData.above18));
    if (this.formData.userImage) {
      formData.append('userImage', this.formData.userImage, this.formData.userImage.name); // Accessing name property
    }

    this.http.post('http://localhost:8080/api/user/create', formData).subscribe(
      (response: any) => {
        console.log('Registration successful', response);
        this.formData = { 
          firstName: '', 
          lastName: '', 
          email: '', 
          phoneNumber: '', 
          password: '', 
          above18: false,
          userImage: null  
        };
        this.error = '';
        this.success = 'Registration successful. Redirecting to login...';

        setTimeout(() => {
          this.success = '';
          this.router.navigate(["/login"]);
        }, 3000);
      },
      (error) => {
        console.error('Registration failed', error);
        if (error.status === 409) {
          this.error = 'Phone number is already registered. Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 3000);
        } else if (error.status === 400) {
          this.error = error.error.message; 
        } else {
          this.error = 'Registration failed. Please check your credentials and try again.';
        }
        this.success = '';
      }
    );
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.userImage = file;
    }
  }

  private isFormValid(): boolean {
    const phoneNumberPattern = /^[0-9]{10,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneNumberPattern.test(this.formData.phoneNumber)) {
      this.error = 'Please enter a valid phone number with at least 10 digits.';
      return false;
    }

    if (!emailPattern.test(this.formData.email)) {
      this.error = 'Please enter a valid email address.';
      return false;
    }

    return true;
  }
}
