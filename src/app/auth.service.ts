// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:8080/api/auth';
//   private tokenKey = 'auth-token';
//   private userIdKey = 'user-id';

//   constructor(private http: HttpClient) {}

//   login(username: string, password: string): Observable<boolean> {
//     const loginData = { username, password };
//     return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
//       map(response => {
//         if (response.token) {
//           this.storeToken(response.token);
//           this.storeUserId(response.userId);
//           return true;
//         } else {
//           return false;
//         }
//       }),
//       catchError(error => {
//         console.error('Login error:', error);
//         return of(false);
//       })
//     );
//   }

//   logout(): void {
//     this.clearToken();
//     this.clearUserId();
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }

//   getToken(): string | null {
//     return localStorage.getItem(this.tokenKey);
//   }

//   private storeToken(token: string): void {
//     localStorage.setItem(this.tokenKey, token);
//   }

//   private clearToken(): void {
//     localStorage.removeItem(this.tokenKey);
//   }

//   getCurrentUserId(): number | null {
//     const userId = localStorage.getItem(this.userIdKey);
//     return userId ? parseInt(userId, 10) : null;
//   }

//   private storeUserId(userId: number): void {
//     localStorage.setItem(this.userIdKey, userId.toString());
//   }

//   private clearUserId(): void {
//     localStorage.removeItem(this.userIdKey);
//   }
// }
