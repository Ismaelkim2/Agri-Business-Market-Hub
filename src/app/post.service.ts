import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './models/post.model'; 

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts'; 

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(title: string, content: string, image: File | null): Observable<Post> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image, image.name);
    }
    return this.http.post<Post>(`${this.apiUrl}/create`, formData);
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${post.id}`, post);
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
}
