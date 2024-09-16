import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { DataServiceService } from '../data-service.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  loggedInUser: User | null = null;

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
      age: [''],
      salesAmount: [''],
      productType: [''],
      image: [''],
      createdBy: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.dataService.isLoggedIn.subscribe(loggedIn => {
      if (!loggedIn) {
        this.snackBar.open('You need to be logged in to create a post', 'Close', { duration: 5000 });
        this.router.navigate(['/login']);
      } else {
        this.dataService.loggedInUser.subscribe(user => {
          if (user) {
            this.loggedInUser = user;
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
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviewUrl = e.target.result;
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.imagePreviewUrl = null;
    }
  }
onSubmit(): void {
  if (this.postForm.invalid) {
    this.snackBar.open('Please fill all required fields', 'Close', { duration: 5000 });
    return;
  }

  if (!this.loggedInUser || typeof this.loggedInUser.id === 'undefined') {
    this.snackBar.open('User is not logged in or invalid', 'Close', { duration: 5000 });
    return;
  }

  const postData = this.postForm.getRawValue();

  const formData = new FormData();
  formData.append('post', JSON.stringify(postData));

  if (this.selectedFile) {
    formData.append('image', this.selectedFile, this.selectedFile.name);
  }

  this.postService.createPost(postData, this.selectedFile, this.loggedInUser.id).subscribe(
    () => {
      this.snackBar.open('Post created successfully', 'Close', { duration: 5000 });
      this.router.navigate(['/post-list']);
    },
    error => {
      console.error('Error creating post:', error);
      this.snackBar.open('Failed to create post', 'Close', { duration: 5000 });
    }
  );
}

}
