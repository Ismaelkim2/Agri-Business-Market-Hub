import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from './models/post.model';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';
  postsChanged = new Subject<Post[]>();

  constructor(private http: HttpClient, private dataService: DataServiceService) {}

  // Method to fetch all posts
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // Method to fetch a single post by ID
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // Method to create a new post
  createPost(postData: any, image: File | null): Observable<Post> {
    const formData = this.prepareFormData(postData, image);
    return this.http.post<Post>(`${this.apiUrl}/create`, formData);
  }

  

  // Method to update an existing post
  updatePost(postData: any, image: File | null): Observable<Post> {
    const formData = this.prepareFormData(postData, image);
    return this.http.put<Post>(`${this.apiUrl}/${postData.id}`, formData);
  }

  // Method to delete a post
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`);
  }

  // Method to increment likes for a post
  incrementLikes(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/likes`, null);
  }

  // Method to increment views for a post
  incrementViews(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/views`, null);
  }

  // Method to notify subscribers of changes in posts
  notifyPostsChanged(): void {
    this.getPosts().subscribe(posts => {
      this.postsChanged.next(posts);
    });
  }

  // Private method to prepare form data for post creation/update
  private prepareFormData(postData: any, image: File | null): FormData {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('productType', postData.productType);
    formData.append('age', postData.age);
    formData.append('salesAmount', postData.salesAmount);
    formData.append('createdBy', postData.createdBy); // Ensure 'createdBy' is included
    if (postData.productType === 'Poultry') {
      formData.append('poultryType', postData.poultryType);
      formData.append('weight', postData.weight);
    } else if (postData.productType === 'Livestock') {
      formData.append('livestockType', postData.livestockType);
      formData.append('livestockDescription', postData.livestockDescription);
    }
    if (image) {
      formData.append('image', image, image.name);
    }
    return formData;
  }

  

  // Method to fetch user details after login
  fetchUserDetails(): Observable<any> {
    return this.dataService.loggedInUser.pipe(
      tap(user => console.log('User details fetched:', user))
    );
  }
}
