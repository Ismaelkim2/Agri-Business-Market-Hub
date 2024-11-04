import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataServiceService } from './../data-service.service';
import { UserDTO } from './../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  loggedInUser!: UserDTO;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataServiceService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.settingsForm = this.formBuilder.group({
      name: [''],
      role: [''],
      contacts: [''],
      email: [''],
      image:['']
    });

    this.dataService.loggedInUser.subscribe((user: UserDTO) => {
      this.loggedInUser = user;
      this.loadCredentials(user);
    });
  }

  loadCredentials(user: UserDTO): void {
    this.settingsForm.patchValue({
      name: user.firstName + ' ' + user.lastName,
      role: user.role || 'N/A', 
      contacts: user.phoneNumber,
      email: user.email,
      image:user.userImageUrl
    });
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      console.log('Form Submitted:', this.settingsForm.value);
    }
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.settingsForm.patchValue({
          image: e.target.result  
        });
      };
      reader.readAsDataURL(file);
    }
  }

  SignOut(): void {
    this.dataService.signOut();
    this.router.navigate(['/login']);
  } 
}
