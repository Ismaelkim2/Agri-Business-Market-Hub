import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Post } from '../models/post.model';
import { PostService } from '../post.service';
import { DataServiceService } from '../data-service.service';
import { UserDTO } from '../models/user.model';
<<<<<<< HEAD
import { ProductService } from '../product-service.service';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model'; // Ensure Product model is imported
=======
>>>>>>> origin/master

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSubscription: Subscription | undefined;
  loggedInUser: UserDTO | undefined;
  timeUpdateSubscription: Subscription | undefined;
<<<<<<< HEAD
  products: Product[] = []; // Initialize products array
=======
>>>>>>> origin/master

  constructor(
    private postService: PostService,
    private dataService: DataServiceService,
<<<<<<< HEAD
    private cd: ChangeDetectorRef,
    private productService: ProductService,
    private cartService: CartService
=======
    private cd: ChangeDetectorRef
>>>>>>> origin/master
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.postsSubscription = this.postService.postsChanged.subscribe(() => {
      this.loadPosts();
    });

    this.dataService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      console.log('Logged In User:', this.loggedInUser);
      this.loadPosts();
    });

    // Set up an interval to refresh the view every minute
    this.timeUpdateSubscription = interval(60000).subscribe(() => {
      this.cd.markForCheck(); // Trigger change detection
    });
<<<<<<< HEAD

    // Fetch products from productService
    this.products = this.productService.getProducts();
=======
>>>>>>> origin/master
  }

  ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    if (this.timeUpdateSubscription) {
      this.timeUpdateSubscription.unsubscribe();
    }
  }

  private loadPosts(): void {
    this.postService.getPosts().subscribe(
      (posts: any[]) => {
        this.posts = posts.map((data: any) => {
          const post = new Post(data);
          if (isNaN(post.createdAt.getTime())) {
            post.relativeCreatedAt = 'Invalid date';
          } else {
            post.relativeCreatedAt = this.calculateRelativeTime(post.createdAt);
          }
          console.log(`Post createdAt: ${post.createdAt}, relativeCreatedAt: ${post.relativeCreatedAt}`);
          return post;
        });
        console.log('Posts loaded in component:', this.posts);
      },
      (error: any) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  private calculateRelativeTime(createdAt: Date): string {
    const currentDate = new Date();
    const postDate = new Date(createdAt);
    const diffMilliseconds = currentDate.getTime() - postDate.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000);

    // Calculate different time units
    const years = Math.floor(diffSeconds / (3600 * 24 * 365));
    const months = Math.floor(diffSeconds / (3600 * 24 * 30));
    const days = Math.floor(diffSeconds / (3600 * 24));
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor(diffSeconds / 60);

    if (years > 0) {
      return years === 1 ? '1 year ago' : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else {
      return minutes < 1 ? 'just now' : `${minutes} minutes ago`;
    }
  }

  incrementLikes(postId: number, userId: number): void {
    if (!userId) {
      console.error('User ID is undefined or null.');
      return;
    }
  
    this.postService.incrementLikes(postId, userId).subscribe(
      (updatedPost: Post | null) => {
        if (updatedPost) {
          const index = this.posts.findIndex(post => post.id === updatedPost.id);
          if (index !== -1) {
            this.posts[index] = updatedPost;
          }
        } else {
          console.error('Error: Updated post is null or undefined.');
          // Handle error or provide user feedback
        }
      },
      (error: any) => {
        console.error('Error incrementing likes:', error);
        // Handle HTTP error or provide user feedback
      }
    );
  }
  
  incrementViews(postId: number): void {
    this.postService.incrementViews(postId).subscribe(() => {
      this.loadPosts();
    }, (error: any) => {
      console.error('Error incrementing views:', error);
    });
  }

  editPost(post: Post): void {
    // Implement edit post functionality if needed
  }

  deletePost(postId: number): void {
    this.postService.deletePost(postId).subscribe(() => {
      this.loadPosts();
    }, (error: any) => {
      console.error('Error deleting post:', error);
    });
  }
<<<<<<< HEAD

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  // Convert Post to Product
  postToProduct(post: Post): Product {
    return {
      id: post.id, 
      name: post.title,
      description: post.livestockDescription ? post.livestockDescription : '', 
      price: post.salesAmount ? post.salesAmount : 0, 
      imageUrl: post.imageUrl
    };
  }
=======
>>>>>>> origin/master
}
