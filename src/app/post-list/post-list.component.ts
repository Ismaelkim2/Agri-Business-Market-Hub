import { Post } from './../models/post.model';
import { User, UserDTO } from './../models/user.model';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { PostService } from '../post.service';
import { DataServiceService } from '../data-service.service';
import { ProductService } from '../product-service.service';
import { CartService } from '../cart.service';
import { Product } from '../models/product.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { response } from 'express';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  user?:User[]=[];
  userDTO:UserDTO[]=[];
  formpost!: FormGroup;
  loggedInUser: UserDTO | undefined;
  postsSubscription: Subscription | undefined;
  timeUpdateSubscription: Subscription | undefined;
  products: Product[] = [];
  message:string='Not authorized to delete this post';
  messageVisibility:boolean=false
  selectedImage:File|null=null
  iseditting:boolean=false;
  isedittingpost:Post|null=null;

  constructor(
    private postService: PostService,
    private dataService: DataServiceService,
    private cd: ChangeDetectorRef,
    private productService: ProductService,
    private cartService: CartService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.postsSubscription = this.postService.postsChanged.subscribe(() => {
      this.loadPosts();
    });

    this.dataService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      this.loadPosts();
    });

    this.timeUpdateSubscription = interval(60000).subscribe(() => {
      this.cd.markForCheck();
    });

    this.products = this.productService.getProducts();

    this.formpost = new FormGroup({
      postInput: new FormControl('', Validators.required)
    });
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
      (posts: Post[]) => {
        this.posts = posts.map(post => {
          if (!(post.createdAt instanceof Date)) {
            if (Array.isArray(post.createdAt)) {
              post.createdAt = new Date(Date.UTC(
                post.createdAt[0], 
                post.createdAt[1] - 1,
                post.createdAt[2], 
                post.createdAt[3] || 0, 
                post.createdAt[4] || 0, 
                post.createdAt[5] || 0, 
                post.createdAt[6] || 0 
              ));
            } else {
              post.createdAt = new Date(post.createdAt);
            }
          }

          if (isNaN(post.createdAt.getTime())) {
            console.error('Invalid createdAt date:', post.createdAt);
            post.relativeCreatedAt = 'Invalid date';
          } else {
            post.relativeCreatedAt = this.calculateRelativeTime(post.createdAt);
          }

          if (post.userDTO && this.loggedInUser) {
            post.isOwnedByLoggedInUser = post.userDTO.id === this.loggedInUser.id;
          } else {
            post.isOwnedByLoggedInUser = false;
          }

          post.likedByUser = Array.isArray(post.likedBy) && post.likedBy.includes(this.loggedInUser?.id ?? 0);

          return post;
        });
      },
      (error: any) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  createPost(){
const postData=this.formpost.value;
const Image:File| null=null;
const userId=this.loggedInUser?.id

    this.postService.createPost(postData, Image,userId??0).subscribe(
      (response=>{
        console.log('post created sucessfuly') 
      }),
      (error:any)=>{
        console.log("post crestion failed")
      }
    );
 
  }

  private calculateRelativeTime(createdAt: Date): string {
    const currentDate = new Date();
    const postDate = new Date(createdAt);
    const diffMilliseconds = currentDate.getTime() - postDate.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000);

    const years = Math.floor(diffSeconds / (3600 * 24 * 365));
    const months = Math.floor(diffSeconds / (3600 * 24 * 30));
    const days = Math.floor(diffSeconds / (3600 * 24));
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor(diffSeconds / 60);

    if (years > 0) {
      return years === 1 ? '1yr ago' : `${years} yr ago`;
    } else if (months > 0) {
      return months === 1 ? '1m ago' : `${months} m ago`;
    } else if (days > 0) {
      return days === 1 ? '1d ago' : `${days} d ago`;
    } else if (hours > 0) {
      return hours === 1 ? '1h ago' : `${hours} h ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1m ago' : `${minutes} m ago`;
    } else {
      return diffSeconds < 60 ? 'just now' : `${diffSeconds} seconds ago`;
    }
  }

  toggleLike(postId: number, userId: number): void {
    if (!userId) {
      console.error('User ID is undefined or null.');
      return;
    }

    this.postService.toggleLike(postId, userId).subscribe(
      (updatedPost: Post | null) => {
        if (updatedPost) {
          const index = this.posts.findIndex(post => post.id === updatedPost.id);
          if (index !== -1) {
            this.posts[index] = updatedPost;
          }
        }
      },
      error => {
        console.error('Error liking the post:', error);
      }
    );
  }

  onComment(): void {
    console.log('Comment functionality not implemented.');
    alert(`comment section coming soon!`)
  }

 
   onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  // openEditingForm(post:Post){
  // this.iseditting=true;
  // this.isedittingpost = { ...post };
  // }

  // editPost(post: Post, image: File | null): void {
  //   console.log('Edit functionality for post:', post);
  
  //   const postData = {
  //     ...post, 
  //     userId: post.userDTO?.id
  //   };
  
  //   this.postService.updatePost(postData, image).subscribe({
  //     next: (response) => {
  //       this.posts = this.posts.map(p => p.id === response.id ? response : p);
  //       this.iseditting=false;
  //       console.log('Post edited successfully:', response);
  //     },
  //     error: (err) => {
  //       console.error('Error editing post:', err);
  //     }
  //   });
  // }
  openEditingForm(post: Post): void {
    this.iseditting = true;
    this.isedittingpost = { ...post }; 

    if(!this.loggedInUser){
      this.router.navigate(["/login"])
      console.log("sign in to edit");
    }
    
    if (!this.isedittingpost.userDTO) {
      this.isedittingpost.userDTO = {
        id: post.userDTO?.id ?? 0, 
        firstName: post.userDTO?.firstName ?? '',
        role:post.userDTO?.role,
        lastName: post.userDTO?.lastName ?? '',
        phoneNumber: post.userDTO?.phoneNumber ?? '',
        email: post.userDTO?.email ?? '',
        password: post.userDTO?.password ?? '',
        above18: post.userDTO?.above18 ?? true,
        userImageUrl: post.userDTO?.userImageUrl ?? '',
        createdBy: post.userDTO?.createdBy ?? '',
        documentUrls: post.userDTO?.documentUrls ?? []
      };
    }
  }
  
  saveEditedPost(): void {
    if (this.isedittingpost) {
      const postData = {
        ...this.isedittingpost, 
        userId: this.isedittingpost.userDTO?.id
      };
  
      this.postService.updatePost(postData, this.selectedImage).subscribe({
        next: (response) => {
          this.posts = this.posts.map(p => p.id === response.id ? response : p);
          this.iseditting = false;
          this.isedittingpost = null;
          console.log('Post edited successfully:', response);
        },
        error: (err) => {
          console.error('Error editing post:', err);
        }
      });
    }
  }
  
  
  cancelEditing(): void {
    this.iseditting = false;
    this.isedittingpost = null;
  }
  
  

  deletePost(postId: number, userId: number | undefined): void {
    if (userId === undefined) {
      console.error('User ID is undefined.');
      this.messageVisibility = true;
      setTimeout(() => {
        this.messageVisibility = false;
      }, 4000);
      return;
    }
    this.postService.deletePost(postId, userId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.id !== postId);
        console.log('Post deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        this.messageVisibility = true;
        setTimeout(() => {
          this.messageVisibility = false;
        }, 4000);
      }
    });
  }
  
}
