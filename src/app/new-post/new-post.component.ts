import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File | null = null;
  loggedInUser: any;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dataService: DataServiceService
  ) {
    this.postForm = this.fb.group({
      firstName: [{ value: '', disabled: true }, Validators.required],
      userImage: [{ value: '', disabled: true }, Validators.required],
      title: ['', Validators.required],
      productType: ['', Validators.required],
      age: [''],
      salesAmount: [''],
      poultryType: [''],
      weight: [''],
      livestockType: [''],
      livestockDescription: [''],
      createdBy: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.dataService.isLoggedIn.subscribe(loggedIn => {
      if (!loggedIn) {
        this.snackBar.open('You need to be logged in to create a post', 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/login']);
      } else {
        this.dataService.loggedInUser.subscribe(user => {
          if (user) {
            this.loggedInUser = user;
            console.log('User retrieved:', user);
            this.postForm.patchValue({
              firstName: user.firstName,
              userImage: user.userImageUrl,
              createdBy: `${user.firstName} ${user.lastName}`
            });
          } else {
            console.log('No user found');
          }
        });
      }
    });

    this.postForm.get('productType')?.valueChanges.subscribe(() => {
      this.onProductTypeChange();
    });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    const postData = this.postForm.getRawValue(); 
    postData.firstName = this.loggedInUser.firstName; 
    postData.userImage = this.loggedInUser.userImageUrl; 
    postData.createdBy = `${this.loggedInUser.firstName} ${this.loggedInUser.lastName}`;

    this.postService.createPost(postData, this.selectedFile).subscribe(
      () => {
        this.snackBar.open('Post created successfully', 'Close', {
          duration: 5000,
        });
        this.postService.notifyPostsChanged();
        this.router.navigate(['/post-list']);
      },
      error => {
        this.snackBar.open('Failed to create post', 'Close', {
          duration: 5000,
        });
      }
    );
  }

  onProductTypeChange(): void {
    const productType = this.postForm.get('productType')?.value;
    if (productType === 'Poultry') {
      this.postForm.get('poultryType')?.setValidators([Validators.required]);
      this.postForm.get('weight')?.setValidators([Validators.required]);
      this.postForm.get('livestockType')?.clearValidators();
      this.postForm.get('livestockDescription')?.clearValidators();
    } else if (productType === 'Livestock') {
      this.postForm.get('poultryType')?.clearValidators();
      this.postForm.get('weight')?.clearValidators();
      this.postForm.get('livestockType')?.setValidators([Validators.required]);
      this.postForm.get('livestockDescription')?.setValidators([Validators.required]);
    } else {
      this.postForm.get('poultryType')?.clearValidators();
      this.postForm.get('weight')?.clearValidators();
      this.postForm.get('livestockType')?.clearValidators();
      this.postForm.get('livestockDescription')?.clearValidators();
    }
    this.postForm.get('poultryType')?.updateValueAndValidity();
    this.postForm.get('weight')?.updateValueAndValidity();
    this.postForm.get('livestockType')?.updateValueAndValidity();
    this.postForm.get('livestockDescription')?.updateValueAndValidity();
  }
}
