import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

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
    createdBy: 'self',
    userImage: null as File | null
  };
  error: string = '';
  success: string = '';
  loading = false;
  showPassword: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('firstName', this.formData.firstName);
    formData.append('lastName', this.formData.lastName);
    formData.append('email', this.formData.email);
    formData.append('phoneNumber', this.formData.phoneNumber);
    formData.append('password', this.formData.password);
    formData.append('above18', String(this.formData.above18));
    formData.append('createdBy', this.formData.createdBy);
    if (this.formData.userImage) {
      formData.append('userImage', this.formData.userImage, this.formData.userImage.name);
    }

    const apiUrl = environment.apiUrl;

    this.http.post(`${apiUrl}/api/user/create`, formData).subscribe(
      (response: any) => {
        this.formData = { firstName: '', lastName: '', email: '', phoneNumber: '', password: '', above18: false, createdBy: 'self', userImage: null };
        this.error = '';
        this.success = 'Registration successful. Redirecting to login...';
        setTimeout(() => {
          this.success = '';
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error) => {
        this.error = error.status === 409 ? 'Phone number is already registered. Redirecting to login...' : 'Registration failed. Please try again.';
        setTimeout(() => { this.error = ''; }, 2000);
        setTimeout(() => { this.router.navigate(['/login']); }, 3000);
      }
    ).add(() => this.loading = false);
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
    const passwordPattern = /(?=.*\d)(?=.*[a-zA-Z]).{6,}/;

    if (!phoneNumberPattern.test(this.formData.phoneNumber)) {
      this.error = 'Please enter a valid phone number with at least 10 digits.';
      setTimeout(() => { this.error = ''; }, 2000);
      return false;
    }

    if (!emailPattern.test(this.formData.email)) {
      this.error = 'Please enter a valid email address.';
      setTimeout(() => { this.error = ''; }, 2000);
      return false;
    }

    if (!passwordPattern.test(this.formData.password)) {
      this.error = 'Password must contain both letters and numbers and be at least 6 characters long.';
      setTimeout(() => { this.error = ''; }, 2000); 
      return false;
    }

    return true;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
