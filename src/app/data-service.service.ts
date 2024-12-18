import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthResponse } from './login/login.component';
import { environment } from '../environments/environment.prod';




@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiUrl = `${environment.apiUrl}/api`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkInitialLoginStatus());
  private loggedInUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  private checkInitialLoginStatus(): boolean {
    const token = localStorage.getItem('authToken'); 
    return !!token; 
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    console.log('Auth Token:', token);  // Log token for debugging
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
  }

  signIn(credentials: { phoneNumber: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, credentials).pipe(
      map(response => {
        console.log("Login Response:", response);  // Log the response for debugging
        if (response && response.message) {
          const tokenMatch = response.message.match(/Token:\s([\w\-.]+)/);
          if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            localStorage.setItem('authToken', token); // Store the token in localStorage
            this.isLoggedInSubject.next(true);  // Set login status to true
            this.fetchUserDetails(credentials.phoneNumber).subscribe(user => {
              this.loggedInUserSubject.next(user); // Fetch user details
            });
            return true;  // Return true if login is successful
          }
        }
        return false;  // Return false if token not found
      }),
      catchError(error => {
        console.error('Login error:', error);  // Log the error for debugging
        return of(false);
      })
    );
  }
  

  fetchUserDetails(phoneNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/details`, { 
      params: { phoneNumber }, 
      headers: this.getAuthHeaders() 
    });
  }

  signOut(): void {
    console.log('Signing out');
    this.isLoggedInSubject.next(false);
    this.loggedInUserSubject.next(null);
    localStorage.removeItem('authToken'); 
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get loggedInUser(): Observable<any> {
    return this.loggedInUserSubject.asObservable();
  }
}
