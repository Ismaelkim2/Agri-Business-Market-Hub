// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { Post } from '../models/post.model';
// import { PostService } from '../post.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-post-list',
//   templateUrl: './post-list.component.html',
//   styleUrls: ['./post-list.component.css']
// })
// export class PostListComponent implements OnInit, OnDestroy {
//   posts: Post[] = [];
//   private postsSubscription: Subscription | null = null;

//   constructor(private postService: PostService, private router: Router) {}

//   ngOnInit(): void {
//     this.postService.getPosts().subscribe(posts => {
//       this.posts = posts;
//     });

//     this.postsSubscription = this.postService.postsChanged.subscribe((posts: Post[]) => {
//       this.posts = posts;
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.postsSubscription) {
//       this.postsSubscription.unsubscribe();
//     }
//   }

//   incrementLikes(postId: number): void {
//     this.postService.incrementLikes(postId).subscribe(() => {
//       const post = this.posts.find(p => p.id === postId);
//       if (post) {
//         post.likes++;
//       }
//     });
//   }

//   incrementViews(postId: number): void {
//     this.postService.incrementViews(postId).subscribe(() => {
//       const post = this.posts.find(p => p.id === postId);
//       if (post) {
//         post.views++;
//       }
//     });
//   }

//   editPost(post: Post): void {
//     this.router.navigate(['/edit-post', post.id]);
//   }

//   deletePost(postId: number): void {
//     this.postService.deletePost(postId).subscribe(() => {
//       this.posts = this.posts.filter(post => post.id !== postId);
//     });
//   }

//   navigateToNewPost(): void {
//     this.router.navigate(['/new-post']);
//   }
// }
