import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      title: ['', Validators.required],
      // content: ['', Validators.required],
      productType: ['', Validators.required],
      age: [''],
      salesAmount: [''],
      poultryType: [''],
      weight: [''],
      livestockType: [''],
      livestockDescription: [''],
      createdBy: [' ', Validators.required] // Default or dynamically set 'createdBy'
    });
  }

  ngOnInit(): void {
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

    const postData = this.postForm.value;

    this.postService.createPost(postData, this.selectedFile).subscribe(
      () => {
        this.snackBar.open('Post created successfully', 'Close', {
          duration: 5000,
        });
        this.postService.notifyPostsChanged();  // Notify post creation
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
