import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Post } from './models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';
  postsChanged = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(postData: any, image: File | null): Observable<Post> {
    const formData = new FormData();
    formData.append('title', postData.title);
    // formData.append('content', postData.content);
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
    return this.http.post<Post>(`${this.apiUrl}/create`, formData);
  }

  updatePost(postData: any, image: File | null): Observable<Post> {
    const formData = new FormData();
    formData.append('title', postData.title);
    // formData.append('content', postData.content);
    formData.append('productType', postData.productType);
    formData.append('age', postData.age);
    formData.append('salesAmount', postData.salesAmount);
    formData.append('createdBy', postData.createdBy); 
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
    return this.http.put<Post>(`${this.apiUrl}/${postData.id}`, formData);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`);
  }

  incrementLikes(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/likes`, null);
  }

  incrementViews(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/views`, null);
  }

  notifyPostsChanged(): void {
    this.getPosts().subscribe(posts => {
      this.postsChanged.next(posts);
    });
  }
}
