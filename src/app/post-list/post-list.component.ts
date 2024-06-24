import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../models/post.model';
import { PostService } from '../post.service';
import { DataServiceService } from '../data-service.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSubscription: Subscription | undefined;
  loggedInUser: any; 

  constructor(private postService: PostService, private dataService: DataServiceService) { }

  ngOnInit(): void {
    this.loadPosts();
    this.postsSubscription = this.postService.postsChanged.subscribe(() => {
      this.loadPosts();
    });

    // Fetch logged in user details
    this.dataService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      console.log("loggedIn user:",this.loggedInUser)
      this.loadPosts
    });
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  private loadPosts(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }

  incrementLikes(postId: number): void {
    this.postService.incrementLikes(postId).subscribe(() => {
      this.loadPosts();
    });
  }

  incrementViews(postId: number): void {
    this.postService.incrementViews(postId).subscribe(() => {
      this.loadPosts();
    });
  }

  editPost(post: Post): void {
    // Implement edit post functionality
  }

  deletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe(() => {
      this.loadPosts();
    });
  }
}
