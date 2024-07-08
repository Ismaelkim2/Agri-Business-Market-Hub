// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Post } from '../models/post.model';
// import { PostService } from '../post.service';

// @Component({
//   selector: 'app-new-post',
//   templateUrl: './new-post.component.html',
//   styleUrls: ['./new-post.component.css']
// })
// export class NewPostComponent {
//   imageUrl: string = '';
//   description: string = '';
//   createdBy: string = '';
//   selectedFile: File | null = null;

//   constructor(private postService: PostService, private router: Router, private snackBar: MatSnackBar) {}

//   onFileSelected(event: any): void {
//     this.selectedFile = event.target.files[0] as File;
//     const reader = new FileReader();
//     reader.onload = (e: any) => this.imageUrl = e.target.result;
//     reader.readAsDataURL(this.selectedFile);
//   }

//   addPost(): void {
//     if (this.selectedFile) {
//       this.postService.uploadImage(this.selectedFile).subscribe(
//         (response: { url: string }) => {
//           this.imageUrl = response.url;
//           this.createPost();
//         },
//         (error: any) => {
//           this.snackBar.open('Failed to upload image', 'Close', {
//             duration: 5000,
//           });
//         }
//       );
//     } else {
//       this.createPost();
//     }
//   }

//   createPost(): void {
//     const newPost: Post = {
//       id: 0, // Backend will set the correct ID
//       imageUrl: this.imageUrl,
//       description: this.description,
//       likes: 0,
//       views: 0,
//       createdBy: this.createdBy,
//       createdAt: new Date()
//     };

//     this.postService.addPost(newPost).subscribe(
//       () => {
//         this.snackBar.open('Post created successfully and updated in the main wall', 'Close', {
//           duration: 5000,
//         });
//         this.router.navigate(['/post-list']);
//       },
//       (error: any) => {
//         this.snackBar.open('Failed to create post', 'Close', {
//           duration: 5000,
//         });
//       }
//     );

//     // Reset form fields
//     this.imageUrl = '';
//     this.description = '';
//     this.createdBy = '';
//     this.selectedFile = null;
//   }
// }
