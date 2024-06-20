import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from '../models/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  post: Post | null = null;
  postId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private snackBar: MatSnackBar
  ) {
    this.postId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadPost();
  }

  loadPost(): void {
    this.postService.getPostById(this.postId).subscribe(
      post => {
        this.post = post;
      },
      error => {
        this.snackBar.open('Failed to load post', 'Close', {
          duration: 5000,
        });
      }
    );
  }

  savePost(): void {
    if (this.post) {
      this.postService.updatePost(this.post).subscribe(
        () => {
          this.snackBar.open('Post updated successfully', 'Close', {
            duration: 5000,
          });
          this.router.navigate(['/post-list']);
        },
        error => {
          this.snackBar.open('Failed to update post', 'Close', {
            duration: 5000,
          });
        }
      );
    }
  }
}
