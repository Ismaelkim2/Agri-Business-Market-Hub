import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Post } from './models/post.model';
import { DataServiceService } from './data-service.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8081/api/posts';
  postsChanged = new Subject<Post[]>();
  loggedInUser: any;

  constructor(private http: HttpClient, private dataService: DataServiceService) {}

  // ngOnInit() {
  //   this.dataService.getUserById(1).subscribe(user => { 
  //     this.loggedInUser = user;
  //     console.log('Logged In User:', this.loggedInUser);
  //   });
  // }


getPosts(): Observable<Post[]> {
  return this.http.get<Post[]>(this.apiUrl);
}

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/${userId}`).pipe(
      tap(posts => console.log('Posts fetched from API by user:', posts))
    );
  }

  createPost(postData: any, image: File | null, userId: number): Observable<Post> {
    const formData = this.prepareFormData(postData, image);
    formData.append('userId', userId.toString()); 
    return this.http.post<Post>(`${this.apiUrl}/create`, formData);
}

  

updatePost(postData: any, image: File | null): Observable<Post> {
  const formData = new FormData();
  Object.keys(postData).forEach(key => {
    if (postData[key] !== null && postData[key] !== undefined) {
      formData.append(key, postData[key]);
    }
  });
  if (image) {
    formData.append('image', image, image.name);
  }
  return this.http.put<Post>(`${this.apiUrl}/${postData.id}`, formData);
}



  deletePost(postId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${postId}`, {
      params: { userId: userId.toString() }
    }).pipe(
      tap(() => {
        console.log('Post deleted successfully for user:', userId);
      }),
      catchError(error => {
        console.error('Error deleting post:', error);
        return throwError(error);
      })
    );
  }
  

  toggleLike(postId: number, userId: number): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${postId}/likes`, { userId });
  }
  

  incrementViews(postId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${postId}/views`, null);
  }


  notifyPostsChanged(): void {
    this.getPosts().subscribe(posts => {
      this.postsChanged.next(posts);
    });
  }

  private prepareFormData(postData: any, image: File | null): FormData {
    const formData = new FormData();
    formData.append('firstName', postData.firstName);
    formData.append('lastName', postData.lastName);  
    formData.append('userImageUrl', postData.userImageUrl)
    formData.append('title', postData.title);
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
    return formData;
  }

  fetchUserDetails(): Observable<any> {
    return this.dataService.loggedInUser.pipe(
      tap(user => console.log('User details fetched:', user))
    );
  }
}
