import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../post.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: [''],
      content: ['']
      // imageUrl: [''] // No need for imageUrl in the form if uploading a file
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }

    const title = this.postForm.get('title')?.value;
    const content = this.postForm.get('content')?.value;

    this.postService.createPost(title, content, this.selectedFile).subscribe(
      () => {
        this.snackBar.open('Post created successfully', 'Close', {
          duration: 5000,
        });
        this.router.navigate(['/post-list']);
      },
      error => {
        this.snackBar.open('Failed to create post', 'Close', {
          duration: 5000,
        });
      }
    );
  }
}
